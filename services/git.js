import { state as globalState } from "../utils/state.js";
import { translations } from "../locales/index.js";
import { safeFetch as globalSafeFetch, escapeHtml as globalEscapeHtml } from "../utils/helpers.js";

// Update Git status indicators (dots)
export function updateGitStatusIndicators(state = globalState, escapeHtml = globalEscapeHtml) {
  const ghStatus = state.githubStatus || 'disconnected';
  const bbStatus = state.bitbucketStatus || 'disconnected';
  const glStatus = state.gitlabStatus || 'disconnected';
  const dict = translations[state.lang] || translations.en;

  let ghTooltip = 'GitHub: ';
  if (ghStatus === 'disconnected') {
    ghTooltip += dict['git-disconnected'] || 'Disconnected';
  } else if (ghStatus === 'connected') {
    ghTooltip += dict['git-connected'] || 'Connected';
  } else {
    ghTooltip += (dict['git-error-prefix'] || 'Error: ') + (state.githubError || '');
  }

  let bbTooltip = 'Bitbucket: ';
  if (bbStatus === 'disconnected') {
    bbTooltip += dict['git-disconnected'] || 'Disconnected';
  } else if (bbStatus === 'connected') {
    bbTooltip += dict['git-connected'] || 'Connected';
  } else {
    bbTooltip += (dict['git-error-prefix'] || 'Error: ') + (state.bitbucketError || '');
  }

  let glTooltip = 'GitLab: ';
  if (glStatus === 'disconnected') {
    glTooltip += dict['git-disconnected'] || 'Disconnected';
  } else if (glStatus === 'connected') {
    glTooltip += dict['git-connected'] || 'Connected';
  } else {
    glTooltip += (dict['git-error-prefix'] || 'Error: ') + (state.gitlabError || '');
  }

  const ghClass = ghStatus === 'connected' ? 'github' : ghStatus;
  const bbClass = bbStatus === 'connected' ? 'bitbucket' : bbStatus;
  const glClass = glStatus === 'connected' ? 'gitlab' : glStatus;

  const hasGitError = ghStatus === 'error' || bbStatus === 'error' || glStatus === 'error';
  const gitWarningTooltip = dict['status-error-connecting'] || 'Failed to connect to some services';

  const gitWarningIconHTML = `<span class="status-warning-icon" data-tooltip="${escapeHtml(gitWarningTooltip)}" onclick="event.stopPropagation(); window.openSettingsGitTab();">⚠️</span>`;

  const html = `
    ${hasGitError ? gitWarningIconHTML : ''}
    <span class="status-dot ${ghClass}" title="${escapeHtml(ghTooltip)}"></span>
    <span class="status-dot ${bbClass}" title="${escapeHtml(bbTooltip)}"></span>
    <span class="status-dot ${glClass}" title="${escapeHtml(glTooltip)}"></span>
  `;

  const ind1 = document.getElementById('git-status-indicators');
  if (ind1) ind1.innerHTML = html;

  const ghSettingsClass = ghStatus === 'connected' ? 'github' : 'disconnected';
  const bbSettingsClass = bbStatus === 'connected' ? 'bitbucket' : 'disconnected';
  const glSettingsClass = glStatus === 'connected' ? 'gitlab' : 'disconnected';

  // Update dots in Settings panel
  const setDotGh = document.getElementById('settings-git-dot-github');
  const setDotBb = document.getElementById('settings-git-dot-bitbucket');
  const setDotGl = document.getElementById('settings-git-dot-gitlab');

  if (setDotGh) {
    setDotGh.className = `status-dot ${ghSettingsClass}`;
    setDotGh.title = ghTooltip;
  }
  if (setDotBb) {
    setDotBb.className = `status-dot ${bbSettingsClass}`;
    setDotBb.title = bbTooltip;
  }
  if (setDotGl) {
    setDotGl.className = `status-dot ${glSettingsClass}`;
    setDotGl.title = glTooltip;
  }

  const jiraStatus = state.jiraStatus || (state.jiraToken ? 'connected' : 'disconnected');
  const jiraSettingsClass = jiraStatus === 'connected' ? 'connected' : (jiraStatus === 'error' ? 'error' : 'disconnected');
  const setDotJira = document.getElementById('settings-jira-dot');
  if (setDotJira) {
    setDotJira.className = `status-dot ${jiraSettingsClass}`;
    setDotJira.title = jiraStatus === 'connected' 
      ? `Jira: ${dict['git-connected'] || 'Connected'}` 
      : (jiraStatus === 'error' ? (state.jiraError || 'Error') : `Jira: ${dict['git-disconnected'] || 'Disconnected'}`);
  }
}

// Cooldown tracker for successful connection tests (60 seconds)
function startTestCooldown(provider, button) {
  state.lastSuccessGit = state.lastSuccessGit || {};
  state.lastSuccessGit[provider] = Date.now();

  let remaining = 60;
  button.disabled = true;

  const dict = translations[state.lang] || translations.en;
  const originalText = dict['btn-connect'] || 'Connect';
  
  const interval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(interval);
      button.disabled = false;
      button.textContent = originalText;
      button.setAttribute('data-i18n', 'connect-btn');
      if (typeof translatePage === 'function') translatePage();
    } else {
      button.textContent = `${originalText} (${remaining}s)`;
    }
  }, 1000);
  
  button.dataset.cooldownInterval = interval;
}

// Test connection endpoint validator using inputs currently in the settings form
export async function testGitConnection(provider, button) {
  const dict = translations[state.lang] || translations.en;
  const originalText = dict['btn-connect'] || 'Connect';
  button.textContent = dict['btn-connecting'] || 'Connecting...';
  button.disabled = true;

  let success = false;
  let errorMsg = '';

  try {
    if (provider === 'github') {
      const token = document.getElementById('github-token').value.trim();
      if (!token) {
        throw new Error(dict['git-enter-token'] || 'Please enter token');
      }

      const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      };
      const res = await fetch(`https://api.github.com/user`, { headers });
      if (res.ok) {
        success = true;
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    } else if (provider === 'bitbucket') {
      const workspace = document.getElementById('bitbucket-workspace').value.trim();
      const email = document.getElementById('bitbucket-username').value.trim();
      const token = document.getElementById('bitbucket-token').value.trim();
      if (!workspace || !email || !token) {
        throw new Error(dict['git-fill-fields'] || 'Fill all fields');
      }

      const auth = btoa(`${email}:${token}`);
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.bitbucket.org/2.0/user`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
          }
        }),
        fetch(`https://api.bitbucket.org/2.0/repositories/${workspace}?pagelen=1`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
          }
        })
      ]);
      if (!userRes.ok) {
        if (userRes.status === 403) {
          throw new Error(dict['git-token-scope'] || 'Token lacks Account: Read scope');
        }
        throw new Error(`${userRes.status} ${userRes.statusText}`);
      }
      if (!reposRes.ok) {
        throw new Error(`${reposRes.status} ${reposRes.statusText}`);
      }
      success = true;
    } else if (provider === 'gitlab') {
      let host = document.getElementById('gitlab-host').value.trim() || 'https://gitlab.com';
      host = host.replace(/\/$/, "");
      const token = document.getElementById('gitlab-token').value.trim();
      if (!token) {
        throw new Error(dict['git-enter-token'] || 'Please enter token');
      }

      const headers = { 'PRIVATE-TOKEN': token };
      const res = await fetch(`${host}/api/v4/user`, { headers });
      if (res.ok) {
        success = true;
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    } else if (provider === 'jira') {
      let host = document.getElementById('jira-host').value.trim().replace(/\/$/, "");
      if (host && !host.startsWith('http://') && !host.startsWith('https://')) {
        host = 'https://' + host;
      }
      host = host.replace(/\/jira\/?$/, '').replace(/\/secure.*$/, '');
      const email = document.getElementById('jira-email').value.trim();
      const token = document.getElementById('jira-token').value.trim();
      if (!host || !email || !token) {
        throw new Error(dict['git-fill-fields'] || 'Fill all fields');
      }

      const auth = btoa(`${email}:${token}`);
      let res = await safeFetch(`${host}/rest/api/3/myself`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        res = await safeFetch(`${host}/rest/api/2/myself`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
          }
        });
      }
      if (res.ok) {
        success = true;
        state.settings.jiraHost = host;
        state.settings.jiraEmail = email;
        state.settings.jiraToken = token;
        await saveSettings();
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    }
  } catch (e) {
    errorMsg = e.message || String(e);
  }

  // Update State Status and Error Message
  if (success) {
    if (provider === 'github') { state.githubStatus = 'connected'; state.githubError = ''; }
    if (provider === 'bitbucket') { state.bitbucketStatus = 'connected'; state.bitbucketError = ''; }
    if (provider === 'gitlab') { state.gitlabStatus = 'connected'; state.gitlabError = ''; }
    if (provider === 'jira') { state.jiraStatus = 'connected'; state.jiraError = ''; }
  } else {
    if (provider === 'github') { state.githubStatus = 'error'; state.githubError = errorMsg; }
    if (provider === 'bitbucket') { state.bitbucketStatus = 'error'; state.bitbucketError = errorMsg; }
    if (provider === 'gitlab') { state.gitlabStatus = 'error'; state.gitlabError = errorMsg; }
    if (provider === 'jira') { state.jiraStatus = 'error'; state.jiraError = errorMsg; }
  }

  // Update Settings dot status and tooltips reactively
  updateGitStatusIndicators(state, escapeHtml);

  if (success) {
    button.textContent = dict['btn-connected'] || 'Connected!';
    button.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
    button.style.color = '#27ae60';
    button.style.borderColor = '#27ae60';
    
    // Start 1 minute cooldown
    startTestCooldown(provider, button);
    
    // Refresh main PRs list
    fetchAllPRs();
  } else {
    button.textContent = dict['btn-failed'] || 'Failed';
    button.style.backgroundColor = 'rgba(235, 87, 87, 0.1)';
    button.style.color = '#eb5757';
    button.style.borderColor = '#eb5757';
    
    const originalTexti18n = button.getAttribute('data-i18n');
    setTimeout(() => {
      button.disabled = false;
      button.textContent = originalText;
      button.style.backgroundColor = '';
      button.style.color = '';
      button.style.borderColor = '';
      if (originalTexti18n) button.setAttribute('data-i18n', originalTexti18n);
    }, 3000);
    
    fetchAllPRs();
  }
}

// Fetch GitHub, Bitbucket & GitLab PRs
export async function fetchAllPRs(state = globalState, safeFetch = globalSafeFetch, escapeHtml = globalEscapeHtml) {
  const container = document.getElementById('prs-container');
  const prsBadge = document.getElementById('prs-count-badge');
  if (prsBadge) prsBadge.classList.add('hidden');
  
  if (state.settings.showGit === false) {
    return;
  }

  let gitHiddenByOoo = false;
  const hasGithub = !!state.settings.githubToken;
  const hasBitbucket = !!(state.settings.bitbucketToken && state.settings.bitbucketUsername && state.settings.bitbucketWorkspace);
  const hasGitlab = !!state.settings.gitlabToken;

  // Initialize status before fetching
  state.githubStatus = hasGithub ? 'connected' : 'disconnected';
  state.githubError = '';
  state.bitbucketStatus = hasBitbucket ? 'connected' : 'disconnected';
  state.bitbucketError = '';
  state.gitlabStatus = hasGitlab ? 'connected' : 'disconnected';
  state.gitlabError = '';
  updateGitStatusIndicators(state, escapeHtml);
  
  if (state.settings.oooActive && (hasGithub || hasBitbucket || hasGitlab)) {
    const activeGithub = hasGithub && !state.settings.hideGithubOoo;
    const activeBitbucket = hasBitbucket && !state.settings.hideBitbucketOoo;
    const activeGitlab = hasGitlab && !state.settings.hideGitlabOoo;
    if (!activeGithub && !activeBitbucket && !activeGitlab) {
      gitHiddenByOoo = true;
    }
  }

  if (gitHiddenByOoo) {
    container.innerHTML = `<p class="empty-msg">${dict['git-ooo-active'] || 'Out of Office Active'}</p>`;
    return;
  }

  if (!hasGithub && !hasBitbucket && !hasGitlab) {
    const configLinkText = dict['git-config-link'] || 'Configure Git Integration';
    container.innerHTML = `<p class="empty-msg" style="margin: 0.5rem 0;"><a href="#" onclick="event.preventDefault(); window.openSettingsGitTab();" style="color: var(--accent); text-decoration: underline; font-weight: 500;">${configLinkText}</a></p>`;
    return;
  }

  let prList = [];

  // GitHub Fetch
  if (hasGithub && !(state.settings.oooActive && state.settings.hideGithubOoo)) {
    try {
      const headers = {
        'Authorization': `token ${state.settings.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      };

      // 1. Get authenticated user login
      const userRes = await fetch(`https://api.github.com/user`, { headers });
      if (!userRes.ok) {
        state.githubStatus = 'error';
        state.githubError = `${userRes.status} ${userRes.statusText}`;
      } else {
        const userData = await userRes.json();
        const githubUserLogin = userData.login;

        // 2. Get the 5 most recently updated repositories
        const reposRes = await fetch(`https://api.github.com/user/repos?sort=updated&direction=desc&per_page=5`, { headers });
        if (reposRes.ok) {
          const repos = await reposRes.json();
          
          // 3. Fetch open pull requests for each repository in parallel
          const prPromises = repos.map(async (repo) => {
            try {
              const prsRes = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/pulls?state=open`, { headers });
              if (prsRes.ok) {
                return await prsRes.json();
              }
              return [];
            } catch (e) {
              console.error(`Error fetching GitHub PRs for ${repo.full_name}:`, e);
              return [];
            }
          });

          const allRepoPRs = await Promise.all(prPromises);
          const openPRs = allRepoPRs.flat();
          const prDetailPromises = [];

          // 4. Process and filter PRs
          openPRs.forEach(pr => {
            const isAuthor = pr.user && pr.user.login.toLowerCase() === githubUserLogin.toLowerCase();
            const isReviewer = pr.requested_reviewers && pr.requested_reviewers.some(r => r.login.toLowerCase() === githubUserLogin.toLowerCase());
            
            if (isReviewer) {
              // Teammate's PR where I am requested to review
              prDetailPromises.push((async () => {
                prList.push({
                  title: pr.title,
                  status: 'review',
                  statusLabel: dict['pr-needs-review'] || 'Needs Review',
                  url: pr.html_url,
                  repo: pr.base.repo.name,
                  number: pr.number,
                  source: 'GitHub',
                  sortTime: new Date(pr.updated_at).getTime()
                });
              })());
            } else if (isAuthor) {
              // My own PR: check for conflicts and requested changes
              prDetailPromises.push((async () => {
                try {
                  const [detailRes, reviewsRes] = await Promise.all([
                    fetch(pr.url, { headers }).then(r => r.ok ? r.json() : null),
                    fetch(`${pr.url}/reviews`, { headers }).then(r => r.ok ? r.json() : [])
                  ]);

                  const hasConflicts = detailRes && detailRes.mergeable === false;
                  const hasRequestedChanges = reviewsRes && reviewsRes.some(rev => rev.state === 'CHANGES_REQUESTED');

                  let status = 'my_pr';
                  let statusLabel = dict['pr-in-review'] || 'In Review';
                  if (hasConflicts && hasRequestedChanges) {
                    status = 'conflicts_changes_requested';
                    statusLabel = dict['pr-conflicts-changes'] || 'Conflicts | Changes requested';
                  } else if (hasConflicts) {
                    status = 'conflicts';
                    statusLabel = dict['pr-conflicts'] || 'Conflicts';
                  } else if (hasRequestedChanges) {
                    status = 'changes_requested';
                    statusLabel = dict['pr-changes-requested'] || 'Changes requested';
                  }

                  prList.push({
                    title: pr.title,
                    status: status,
                    statusLabel: statusLabel,
                    url: pr.html_url,
                    repo: pr.base.repo.name,
                    number: pr.number,
                    source: 'GitHub',
                    sortTime: new Date(pr.updated_at).getTime()
                  });
                } catch (e) {
                  console.error(`Error fetching details for GitHub PR #${pr.number}:`, e);
                  prList.push({
                    title: pr.title,
                    status: 'my_pr',
                    statusLabel: dict['pr-in-review'] || 'In Review',
                    url: pr.html_url,
                    repo: pr.base.repo.name,
                    number: pr.number,
                    source: 'GitHub',
                    sortTime: new Date(pr.updated_at).getTime()
                  });
                }
              })());
            }
          });

          await Promise.all(prDetailPromises);
        } else {
          state.githubStatus = 'error';
          state.githubError = `${reposRes.status} ${reposRes.statusText}`;
        }
      }
    } catch (e) {
      console.error("Error fetching GitHub PRs:", e);
      state.githubStatus = 'error';
      state.githubError = e.message || String(e);
    }
    updateGitStatusIndicators(state, escapeHtml);
  }

  // Bitbucket Fetch
  if (hasBitbucket && !(state.settings.oooActive && state.settings.hideBitbucketOoo)) {
    try {
      const workspace = state.settings.bitbucketWorkspace;
      const username = state.settings.bitbucketUsername;
      const auth = btoa(`${username}:${state.settings.bitbucketToken}`);
      const headers = {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      };

      // 1. Get authenticated user account_id / uuid
      let bitbucketUserUUID = '';
      let bitbucketAccountID = '';
      let bitbucketUsername = username.toLowerCase();

      try {
        const userRes = await fetch(`https://api.bitbucket.org/2.0/user`, { headers });
        if (userRes.ok) {
          const uData = await userRes.json();
          bitbucketUserUUID = (uData.uuid || '').toLowerCase();
          bitbucketAccountID = (uData.account_id || '').toLowerCase();
          if (uData.username) bitbucketUsername = uData.username.toLowerCase();
          if (uData.nickname) bitbucketUsername = uData.nickname.toLowerCase();
        }
      } catch (e) {
        console.warn("Could not fetch Bitbucket user UUID:", e);
      }

      function isMatchingUser(u) {
        if (!u) return false;
        const uId = (u.account_id || '').toLowerCase();
        const uUuid = (u.uuid || '').toLowerCase();
        const uNick = (u.nickname || '').toLowerCase();
        const uUser = (u.username || '').toLowerCase();
        const uDisplay = (u.display_name || '').toLowerCase();
        return (bitbucketAccountID && uId === bitbucketAccountID) ||
               (bitbucketUserUUID && uUuid === bitbucketUserUUID) ||
               (bitbucketUsername && (uNick === bitbucketUsername || uUser === bitbucketUsername || uDisplay === bitbucketUsername));
      }

      // 2. Fetch open PRs across the workspace
      const prsRes = await fetch(`https://api.bitbucket.org/2.0/pullrequests/${workspace}?state=OPEN&pagelen=30`, { headers });
      if (!prsRes.ok) {
        state.bitbucketStatus = 'error';
        state.bitbucketError = `${prsRes.status} ${prsRes.statusText}`;
      } else {
        const data = await prsRes.json();
        const prs = data.values || [];

        prs.forEach(pr => {
          const isAuthor = isMatchingUser(pr.author);
          const isReviewer = pr.reviewers && pr.reviewers.some(r => isMatchingUser(r));

          if (isReviewer) {
            // Teammate's PR: check if I already approved it
            const hasApproved = pr.participants && pr.participants.some(p => p.approved && isMatchingUser(p.user));
            if (!hasApproved) {
              prList.push({
                title: pr.title,
                status: 'review',
                statusLabel: dict['pr-needs-review'] || 'Needs Review',
                url: pr.links.html.href,
                repo: pr.source.repository.name,
                number: pr.id,
                source: 'Bitbucket',
                sortTime: new Date(pr.updated_on).getTime()
              });
            }
          } else if (isAuthor) {
            // My own PR: check for needs_work (requested changes) or task_count > 0 (blocked)
            const hasNeedsWork = pr.participants && pr.participants.some(p => p.state === 'needs_work');
            const hasTasks = pr.task_count > 0;
            
            let status = 'my_pr';
            let statusLabel = dict['pr-in-review'] || 'In Review';
            if (hasNeedsWork && hasTasks) {
              status = 'changes_requested_tasks';
              statusLabel = dict['pr-changes-tasks'] || 'Changes requested | Tasks';
            } else if (hasNeedsWork) {
              status = 'changes_requested';
              statusLabel = dict['pr-changes-requested'] || 'Changes requested';
            } else if (hasTasks) {
              status = 'tasks_open';
              statusLabel = dict['pr-tasks-open'] || 'Tasks open';
            }

            prList.push({
              title: pr.title,
              status: status,
              statusLabel: statusLabel,
              url: pr.links.html.href,
              repo: pr.source.repository.name,
              number: pr.id,
              source: 'Bitbucket',
              sortTime: new Date(pr.updated_on).getTime()
            });
          }
        });
      }
    } catch (e) {
      console.error("Error fetching Bitbucket PRs:", e);
      state.bitbucketStatus = 'error';
      state.bitbucketError = e.message || String(e);
    }
    updateGitStatusIndicators(state, escapeHtml);
  }

  // GitLab Fetch
  if (hasGitlab && !(state.settings.oooActive && state.settings.hideGitlabOoo)) {
    try {
      const host = (state.settings.gitlabHost || 'https://gitlab.com').replace(/\/$/, "");
      const token = state.settings.gitlabToken;
      const headers = { 'PRIVATE-TOKEN': token };

      // 1. Get authenticated user profile
      const userRes = await fetch(`${host}/api/v4/user`, { headers });
      if (!userRes.ok) {
        state.gitlabStatus = 'error';
        state.gitlabError = `${userRes.status} ${userRes.statusText}`;
      } else {
        const userData = await userRes.json();
        const gitlabUsername = userData.username;

        // 2. Get the 10 most recently active projects (repositories)
        const projectsRes = await fetch(`${host}/api/v4/projects?membership=true&order_by=last_activity_at&sort=desc&per_page=10`, { headers });
        if (projectsRes.ok) {
          const projects = await projectsRes.json();

          // 3. Fetch open merge requests for each project in parallel
          const mrPromises = projects.map(async (project) => {
            try {
              const mrsRes = await fetch(`${host}/api/v4/projects/${project.id}/merge_requests?state=opened`, { headers });
              if (mrsRes.ok) {
                return await mrsRes.json();
              }
              return [];
            } catch (e) {
              console.error(`Error fetching GitLab MRs for project ${project.path_with_namespace}:`, e);
              return [];
            }
          });

          const allProjectMRs = await Promise.all(mrPromises);
          const openMRs = allProjectMRs.flat();
          const mrDetailPromises = [];

          // 4. Process and filter MRs
          openMRs.forEach(mr => {
            const isAuthor = mr.author && mr.author.username.toLowerCase() === gitlabUsername.toLowerCase();
            const isReviewer = mr.reviewers && mr.reviewers.some(r => r.username.toLowerCase() === gitlabUsername.toLowerCase());

            if (isReviewer) {
              // Teammate's MR where I am requested to review: check if I have approved it yet
              mrDetailPromises.push((async () => {
                try {
                  const appRes = await fetch(`${host}/api/v4/projects/${mr.project_id}/merge_requests/${mr.iid}/approvals`, { headers });
                  if (appRes.ok) {
                    const appData = await appRes.json();
                    const hasApproved = appData.approved_by && appData.approved_by.some(app => app.user.username.toLowerCase() === gitlabUsername.toLowerCase());
                    if (!hasApproved) {
                      let repoName = String(mr.project_id);
                      try {
                        const pathParts = mr.web_url.split('/');
                        const idx = pathParts.indexOf('-');
                        if (idx !== -1) {
                          repoName = pathParts.slice(3, idx).join('/');
                        }
                      } catch (e) {}

                      prList.push({
                        title: mr.title,
                        status: 'review',
                        statusLabel: dict['pr-needs-review'] || 'Needs Review',
                        url: mr.web_url,
                        repo: repoName,
                        number: mr.iid,
                        source: 'GitLab',
                        sortTime: new Date(mr.updated_at).getTime()
                      });
                    }
                  }
                } catch (e) {
                  console.error(`Error fetching approvals for GitLab MR #${mr.iid}:`, e);
                }
              })());
            } else if (isAuthor) {
              // My own MR: check for conflicts and unresolved threads (blocking discussions)
              mrDetailPromises.push((async () => {
                const hasConflicts = mr.has_conflicts === true || mr.merge_status === 'cannot_be_merged' || mr.detailed_merge_status === 'conflict';
                const hasUnresolvedDiscussions = mr.blocking_discussions_resolved === false || mr.detailed_merge_status === 'discussions_not_resolved';

                let status = 'my_pr';
                let statusLabel = dict['pr-in-review'] || 'In Review';
                if (hasConflicts && hasUnresolvedDiscussions) {
                  status = 'conflicts_discussions';
                  statusLabel = dict['pr-conflicts-threads'] || 'Conflicts | Threads open';
                } else if (hasConflicts) {
                  status = 'conflicts';
                  statusLabel = dict['pr-conflicts'] || 'Conflicts';
                } else if (hasUnresolvedDiscussions) {
                  status = 'discussions_open';
                  statusLabel = dict['pr-threads-open'] || 'Threads open';
                }

                let repoName = String(mr.project_id);
                try {
                  const pathParts = mr.web_url.split('/');
                  const idx = pathParts.indexOf('-');
                  if (idx !== -1) {
                    repoName = pathParts.slice(3, idx).join('/');
                  }
                } catch (e) {}

                prList.push({
                  title: mr.title,
                  status: status,
                  statusLabel: statusLabel,
                  url: mr.web_url,
                  repo: repoName,
                  number: mr.iid,
                  source: 'GitLab',
                  sortTime: new Date(mr.updated_at).getTime()
                });
              })());
            }
          });

          await Promise.all(mrDetailPromises);
        } else {
          state.gitlabStatus = 'error';
          state.gitlabError = `${projectsRes.status} ${projectsRes.statusText}`;
        }
      }
    } catch (e) {
      console.error("Error fetching GitLab MRs:", e);
      state.gitlabStatus = 'error';
      state.gitlabError = e.message || String(e);
    }
    updateGitStatusIndicators(state, escapeHtml);
  }

  // Sort the final combined list by sortTime descending (most recent first)
  prList.sort((a, b) => (b.sortTime || 0) - (a.sortTime || 0));

  // Render PRs
  if (prList.length === 0) {
    container.innerHTML = `<p class="empty-msg">${translations[state.lang]['no-prs']}</p>`;
    if (prsBadge) prsBadge.classList.add('hidden');
    return;
  }

  container.innerHTML = prList.map(pr => {
    const tooltipText = `${pr.title}\n${pr.source} • ${pr.repo}\n${pr.statusLabel}`;
    return `
      <a href="${pr.url}" target="_blank" class="integration-item" data-tooltip="${escapeHtml(tooltipText)}">
        <span class="item-title">${escapeHtml(pr.title)}</span>
        <div class="item-meta">
          <span style="display: flex; align-items: center; gap: 0.45rem; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            <span class="status-dot ${pr.source.toLowerCase()}" title="${pr.source}"></span>
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(pr.repo)}</span>
          </span>
          <span class="item-badge pr-status-badge ${pr.status}">${escapeHtml(pr.statusLabel)}</span>
        </div>
      </a>
    `;
  }).join('');

  if (prsBadge && prList.length > 0) {
    prsBadge.textContent = prList.length;
    prsBadge.classList.remove('hidden');
  }
}