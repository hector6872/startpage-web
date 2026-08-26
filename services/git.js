import { state } from "../utils/state.js";
import { t } from "../locales/index.js";
import { safeFetch, escapeHtml } from "../utils/helpers.js";
import { saveSettings } from "./storage.js";
import { translatePage } from "../ui/settings.js";

// Update Git status indicators (dots)
export function updateGitStatusIndicators(appState = state, escapeHtmlFn = escapeHtml) {
  const ghStatus = appState.githubStatus || 'disconnected';
  const bbStatus = appState.bitbucketStatus || 'disconnected';
  const glStatus = appState.gitlabStatus || 'disconnected';

  let ghTooltip = 'GitHub: ';
  if (ghStatus === 'disconnected') {
    ghTooltip += t('git-disconnected');
  } else if (ghStatus === 'connected') {
    ghTooltip += t('git-connected');
  } else {
    ghTooltip += t('git-error-prefix') + (appState.githubError || '');
  }

  let bbTooltip = 'Bitbucket: ';
  if (bbStatus === 'disconnected') {
    bbTooltip += t('git-disconnected');
  } else if (bbStatus === 'connected') {
    bbTooltip += t('git-connected');
  } else {
    bbTooltip += t('git-error-prefix') + (appState.bitbucketError || '');
  }

  let glTooltip = 'GitLab: ';
  if (glStatus === 'disconnected') {
    glTooltip += t('git-disconnected');
  } else if (glStatus === 'connected') {
    glTooltip += t('git-connected');
  } else {
    glTooltip += t('git-error-prefix') + (appState.gitlabError || '');
  }

  const ghClass = ghStatus === 'connected' ? 'github' : ghStatus;
  const bbClass = bbStatus === 'connected' ? 'bitbucket' : bbStatus;
  const glClass = glStatus === 'connected' ? 'gitlab' : glStatus;

  const hasGitError = ghStatus === 'error' || bbStatus === 'error' || glStatus === 'error';
  const gitErrDetail = appState.githubError || appState.bitbucketError || appState.gitlabError || '';
  const gitWarningTooltip = gitErrDetail ? `${t('git-error-prefix')}${gitErrDetail}` : t('btn-failed');

  const gitWarningIconHTML = `<span class="status-warning-icon" data-tooltip="${escapeHtmlFn(gitWarningTooltip)}" onclick="event.stopPropagation(); window.openSettingsGitTab();">⚠️</span>`;

  const html = `
    ${hasGitError ? gitWarningIconHTML : ''}
    <span class="status-dot ${ghClass}" title="${escapeHtmlFn(ghTooltip)}"></span>
    <span class="status-dot ${bbClass}" title="${escapeHtmlFn(bbTooltip)}"></span>
    <span class="status-dot ${glClass}" title="${escapeHtmlFn(glTooltip)}"></span>
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

  // Update Test Connection buttons in settings panel
  ['github', 'bitbucket', 'gitlab'].forEach(p => {
    const btn = document.querySelector(`.test-conn-btn[data-provider="${p}"]`);
    if (!btn) return;
    const pStatus = p === 'github' ? ghStatus : (p === 'bitbucket' ? bbStatus : glStatus);
    if (pStatus === 'connected') {
      if (btn.dataset.cooldownInterval) {
        clearInterval(parseInt(btn.dataset.cooldownInterval, 10));
        delete btn.dataset.cooldownInterval;
      }
      btn.textContent = t('btn-connected');
      btn.setAttribute('data-i18n', 'btn-connected');
      btn.disabled = true;
      btn.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
      btn.style.color = '#27ae60';
      btn.style.borderColor = '#27ae60';
      btn.style.cursor = 'default';
    } else if (!btn.dataset.cooldownInterval) {
      btn.disabled = false;
      btn.textContent = t('btn-connect');
      btn.setAttribute('data-i18n', 'btn-connect');
      btn.style.backgroundColor = '';
      btn.style.color = '';
      btn.style.borderColor = '';
      btn.style.cursor = '';
    }
  });
}

// Cooldown tracker for failed connection tests (30 seconds)
export function startTestCooldown(provider, button) {
  if (button.dataset.cooldownInterval) {
    clearInterval(parseInt(button.dataset.cooldownInterval, 10));
  }

  let remaining = 30;
  button.disabled = true;
  button.style.backgroundColor = 'rgba(235, 87, 87, 0.1)';
  button.style.color = '#eb5757';
  button.style.borderColor = '#eb5757';
  button.style.cursor = 'not-allowed';

  const originalText = t('btn-connect');
  button.textContent = `${originalText} (${remaining}s)`;
  
  const interval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(interval);
      delete button.dataset.cooldownInterval;
      button.disabled = false;
      button.textContent = originalText;
      button.setAttribute('data-i18n', 'btn-connect');
      button.style.backgroundColor = '';
      button.style.color = '';
      button.style.borderColor = '';
      button.style.cursor = '';
      if (typeof translatePage === 'function') translatePage();
    } else {
      button.textContent = `${originalText} (${remaining}s)`;
    }
  }, 1000);
  
  button.dataset.cooldownInterval = String(interval);
}

// Test connection endpoint validator using inputs currently in the settings form
export async function testGitConnection(provider, button) {
  const originalText = t('btn-connect');
  button.textContent = t('btn-connecting');
  button.disabled = true;

  let success = false;
  let errorMsg = '';

  try {
    if (provider === 'github') {
      const token = document.getElementById('github-token').value.trim();
      if (!token) {
        throw new Error(t('git-enter-token'));
      }

      const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      };
      const res = await fetch(`https://api.github.com/user`, { headers });
      if (res.ok) {
        success = true;
        state.settings.githubToken = token;
        await saveSettings(state);
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    } else if (provider === 'bitbucket') {
      const workspace = document.getElementById('bitbucket-workspace').value.trim();
      const email = document.getElementById('bitbucket-username').value.trim();
      const token = document.getElementById('bitbucket-token').value.trim();
      if (!workspace || !email || !token) {
        throw new Error(t('git-fill-fields'));
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
          throw new Error(t('git-token-scope'));
        }
        throw new Error(`${userRes.status} ${userRes.statusText}`);
      }
      if (!reposRes.ok) {
        throw new Error(`${reposRes.status} ${reposRes.statusText}`);
      }
      success = true;
      state.settings.bitbucketWorkspace = workspace;
      state.settings.bitbucketUsername = email;
      state.settings.bitbucketToken = token;
      await saveSettings(state);
    } else if (provider === 'gitlab') {
      let host = document.getElementById('gitlab-host').value.trim() || 'https://gitlab.com';
      host = host.replace(/\/$/, "");
      const token = document.getElementById('gitlab-token').value.trim();
      if (!token) {
        throw new Error(t('git-enter-token'));
      }

      const headers = { 'PRIVATE-TOKEN': token };
      const res = await fetch(`${host}/api/v4/user`, { headers });
      if (res.ok) {
        success = true;
        state.settings.gitlabHost = host;
        state.settings.gitlabToken = token;
        await saveSettings(state);
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
  } else {
    if (provider === 'github') { state.githubStatus = 'error'; state.githubError = errorMsg; }
    if (provider === 'bitbucket') { state.bitbucketStatus = 'error'; state.bitbucketError = errorMsg; }
    if (provider === 'gitlab') { state.gitlabStatus = 'error'; state.gitlabError = errorMsg; }
  }

  // Update Settings dot status and tooltips reactively
  updateGitStatusIndicators(state, escapeHtml);

  if (success) {
    if (button.dataset.cooldownInterval) {
      clearInterval(parseInt(button.dataset.cooldownInterval, 10));
      delete button.dataset.cooldownInterval;
    }
    button.textContent = t('btn-connected');
    button.setAttribute('data-i18n', 'btn-connected');
    button.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
    button.style.color = '#27ae60';
    button.style.borderColor = '#27ae60';
    button.style.cursor = 'default';
    button.disabled = true;
    
    // Refresh main list
    fetchAllPRs(state, safeFetch, escapeHtml);
  } else {
    // 30s cooldown on failure
    startTestCooldown(provider, button);
    fetchAllPRs(state, safeFetch, escapeHtml);
  }
}

// Fetch GitHub, Bitbucket & GitLab PRs
export async function fetchAllPRs(appState = state, safeFetchFn = safeFetch, escapeHtmlFn = escapeHtml) {
  const container = document.getElementById('prs-container');
  const prsBadge = document.getElementById('prs-count-badge');
  if (prsBadge) prsBadge.classList.add('hidden');
  
  if (appState.settings.showGit === false) {
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
    container.innerHTML = `<p class="empty-msg">${t('git-ooo-active')}</p>`;
    return;
  }

  if (!hasGithub && !hasBitbucket && !hasGitlab) {
    const configLinkText = t('git-config-link');
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
                  statusLabel: t('pr-needs-review'),
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
                  let statusLabel = t('pr-in-review');
                  if (hasConflicts && hasRequestedChanges) {
                    status = 'conflicts_changes_requested';
                    statusLabel = t('pr-conflicts-changes');
                  } else if (hasConflicts) {
                    status = 'conflicts';
                    statusLabel = t('pr-conflicts');
                  } else if (hasRequestedChanges) {
                    status = 'changes_requested';
                    statusLabel = t('pr-changes-requested');
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
                    statusLabel: t('pr-in-review'),
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

      // 2. Get the 10 most recently updated repositories in the workspace
      const reposRes = await fetch(`https://api.bitbucket.org/2.0/repositories/${workspace}?sort=-updated_on&pagelen=10`, { headers });
      if (!reposRes.ok) {
        state.bitbucketStatus = 'error';
        state.bitbucketError = `${reposRes.status} ${reposRes.statusText}`;
      } else {
        const reposData = await reposRes.json();
        const repos = reposData.values || [];

        // 3. Fetch open pull requests for each repository in parallel
        const prPromises = repos.map(async (repo) => {
          try {
            const repoSlug = repo.slug || repo.name;
            const prsRes = await fetch(`https://api.bitbucket.org/2.0/repositories/${workspace}/${encodeURIComponent(repoSlug)}/pullrequests?state=OPEN&pagelen=20`, { headers });
            if (prsRes.ok) {
              const data = await prsRes.json();
              return (data.values || []).map(pr => ({
                ...pr,
                _repoName: repo.name || repoSlug
              }));
            }
            return [];
          } catch (e) {
            console.error(`Error fetching Bitbucket PRs for ${repo.name}:`, e);
            return [];
          }
        });

        const allRepoPRs = await Promise.all(prPromises);
        const prs = allRepoPRs.flat();

        prs.forEach(pr => {
          const isAuthor = isMatchingUser(pr.author);
          const isReviewer = pr.reviewers && pr.reviewers.some(r => isMatchingUser(r));
          const repoName = pr._repoName || (pr.source && pr.source.repository && pr.source.repository.name) || '';

          if (isReviewer) {
            // Teammate's PR: check if I already approved it
            const hasApproved = pr.participants && pr.participants.some(p => p.approved && isMatchingUser(p.user));
            if (!hasApproved) {
              prList.push({
                title: pr.title,
                status: 'review',
                statusLabel: t('pr-needs-review'),
                url: pr.links && pr.links.html ? pr.links.html.href : '#',
                repo: repoName,
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
            let statusLabel = t('pr-in-review');
            if (hasNeedsWork && hasTasks) {
              status = 'changes_requested_tasks';
              statusLabel = t('pr-changes-tasks');
            } else if (hasNeedsWork) {
              status = 'changes_requested';
              statusLabel = t('pr-changes-requested');
            } else if (hasTasks) {
              status = 'tasks_open';
              statusLabel = t('pr-tasks-open');
            }

            prList.push({
              title: pr.title,
              status: status,
              statusLabel: statusLabel,
              url: pr.links && pr.links.html ? pr.links.html.href : '#',
              repo: repoName,
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
                        statusLabel: t('pr-needs-review'),
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
                let statusLabel = t('pr-in-review');
                if (hasConflicts && hasUnresolvedDiscussions) {
                  status = 'conflicts_discussions';
                  statusLabel = t('pr-conflicts-threads');
                } else if (hasConflicts) {
                  status = 'conflicts';
                  statusLabel = t('pr-conflicts');
                } else if (hasUnresolvedDiscussions) {
                  status = 'discussions_open';
                  statusLabel = t('pr-threads-open');
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
    container.innerHTML = `<p class="empty-msg">${t('no-prs')}</p>`;
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