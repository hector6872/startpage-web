# 🚀 startpage-web

[![Build Check](https://github.com/hector6872/startpage-web/actions/workflows/build-check.yml/badge.svg)](https://github.com/hector6872/startpage-web/actions/workflows/build-check.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

A beautiful, minimalist landing page featuring task management, calendar schedules, weather forecasts, world clocks, quote widgets, and integrations with Git, Jira, and Google APIs. ✨

---

## ☁️ Google Cloud Console & APIs Setup Guide

To enable Google Calendar and Gmail integrations on this dashboard, you need to set up a project in the Google Cloud Console and configure OAuth 2.0 credentials. Follow these steps:

### 1. 🏗️ Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Log in with your Google account.
3. Click on the project dropdown at the top navigation bar and select **New Project**.
4. Give your project a name (e.g., `Personal Dashboard`) and click **Create**.

### 2. 🔌 Enable Required APIs
You must enable the APIs that this dashboard communicates with:
1. Go directly to the [Google Cloud API Library](https://console.cloud.google.com/apis/library).
2. Search for and enable the following APIs one by one:
   - 📅 **Google Calendar API**
   - ✉️ **Gmail API**
   - ✅ **Google Tasks API**
   - 👥 **People API** (Optional, used for user info retrieval)

### 3. 🛡️ Configure the OAuth Consent Screen
Before creating credentials, you must configure the OAuth consent screen to define what permissions your application will request:
1. Go directly to the [Google Cloud OAuth Consent Screen Page](https://console.cloud.google.com/apis/credentials/consent).
2. Select **External** (or **Internal** if you have a Google Workspace organization and want to restrict access to your domain) and click **Create**.
3. **App Information**:
   - Enter **App name** (e.g., `My Startpage`).
   - Select your email in **User support email**.
   - Scroll to the bottom and enter your email in **Developer contact information**.
   - Click **Save and Continue**.
4. **Data Access / Scopes Step (Crucial)**:
   - In the wizard steps sidebar on the left, this step is labeled as **Data Access** (or **Scopes**).
   - On the **Scopes** page, click the **Add or Remove Scopes** button at the top. A sliding panel will open on the right side of the screen.
   - In the sliding panel, scroll to the bottom to the section labeled **Manually add scopes**.
   - Copy and paste the following exact URIs into the text box (you can paste them comma-separated or one by one):
     ```text
     https://www.googleapis.com/auth/userinfo.email
     https://www.googleapis.com/auth/calendar.readonly
     https://www.googleapis.com/auth/gmail.readonly
     https://www.googleapis.com/auth/tasks.readonly
     ```
   - Click the **Add to table** button.
   - Look at the table above in the sliding panel and verify that the checkboxes next to these newly added scopes are checked (usually they are checked automatically after adding).
   - Scroll to the bottom of the sliding panel and click the blue **Update** button.
   - Back on the main Scopes page, verify that these scopes are now listed in the "Your sensitive scopes" or "Your non-sensitive scopes" tables.
   - Scroll to the bottom of the main page and click **Save and Continue**.
5. **Test Users Step**:
   - In the wizard steps sidebar on the left, this step is labeled as **Audience** (or **Test Users**).
   - Under the **Test Users** section, click **Add Users**.
   - Enter the Google email addresses of the accounts you intend to log in with (both your **Personal** and **Work** Gmail/Workspace emails).
   - Click **Add** / **Save**.
   - Click **Save and Continue**, then review the summary and click **Back to Dashboard**.

### 4. 🔑 Create OAuth 2.0 Credentials
1. Go directly to the [Google Cloud Credentials Page](https://console.cloud.google.com/apis/credentials).
2. Click **Create Credentials** at the top and select **OAuth client ID**.
3. Choose **Web application** as the Application type.
4. Name your client (e.g., `Web Client`).
5. Under **Authorized JavaScript origins**, click **Add URI** and enter:
   - `http://localhost:5173` (or the specific local/production URL where your landing page is served).
   - *Note: Wildcards and IP addresses are not permitted as Authorized JavaScript origins by Google. Always use localhost or a qualified domain name.*
6. Click **Create**.
7. Copy the generated **Client ID** (it looks like `xxxxxxxx.apps.googleusercontent.com`).

### 5. ⚙️ Configure the Dashboard
1. Open your dashboard in the browser.
2. Click the settings gear icon (`⚙️`) in the bottom corner.
3. Navigate to the **Google** tab.
4. Paste your **Google Client ID** into the input field and save settings.
5. You can now log into your **Personal** and **Work** accounts separately! 🎉

---

## 🐙 Git Integrations (GitHub, Bitbucket, GitLab)

This dashboard supports aggregating pull requests and merge requests across git providers. 

For each active provider, the dashboard:
* 🔄 Automatically fetches open Pull/Merge Requests from your **5 most recently updated** repositories/projects.
* 🔍 Filters to show teammate PRs/MRs where you are a **requested reviewer** (and have not approved yet), and your own open PRs/MRs that have **merge conflicts, requested changes, or unresolved discussion threads**.

### ⚙️ Configuration Requirements:

- 🐙 **GitHub**: Requires your Username and a [Personal Access Token (PAT)](https://github.com/settings/tokens/new?scopes=repo&description=Personal%20Startpage) with `repo` scope.
- 🪣 **Bitbucket**: Requires your Workspace ID (the slug/identifier of your workspace found in the URL after `bitbucket.org/`), your Atlassian Account Email, and your [Personal API Token](https://bitbucket.org/account/settings/api-tokens/) (ensure you select both `Repositories: Read` and `Pull requests: Read` scopes).
- 🦊 **GitLab**: Requires your GitLab Username, a [Personal Access Token (PAT)](https://gitlab.com/-/profile/personal_access_tokens?name=Personal%20Startpage&scopes=api) with the `api` scope, and the GitLab Host URL (defaults to `https://gitlab.com` but supports self-hosted GitLab instances).

---

## 🎯 Jira Cloud Setup Guide

This dashboard integrates with Jira Cloud to display your assigned open issues in real-time.

### 1. 🔑 Generate an Atlassian API Token
1. Go directly to [Atlassian Account Security: API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens).
2. Log in with your Atlassian account.
3. Click **Create API token**.
4. In the dialog, provide a label (e.g., `Personal Dashboard`) and click **Create**.
5. Click **Copy** to save the generated API token (you won't be able to view it again).

### 2. 🌐 Identify your Jira Host URL
Your Jira Host URL is the root domain of your Jira Cloud workspace:
- Example: `https://yourcompany.atlassian.net` (without any trailing slash or `/jira` suffix).

### 3. ⚙️ Configure the Dashboard
1. Open your dashboard in the browser.
2. Click the settings gear icon (`⚙️`) in the bottom corner.
3. Navigate to the **Jira Cloud** tab.
4. Fill in the required fields:
   - **Jira Host URL**: e.g., `https://yourcompany.atlassian.net`
   - **Atlassian Account Email**: The email address of your Atlassian account (e.g., `you@yourcompany.com`).
   - **Jira API Token**: The API token generated in step 1.
5. Click **Test Connection** to verify credentials. When successful, the button will show **Connected!** and the status dot will turn green.

### 4. 📊 What the Jira Widget Displays
- Queries assigned open issues using JQL: `assignee = currentUser() AND statusCategory != Done`.
- Displays up to 5 assigned tasks with:
  - 📝 Issue key & summary (e.g., `[PROJ-123] Fix authentication bug`).
  - 📌 Current status (e.g., `In Progress`, `To Do`).
  - 🏷️ Priority badge (e.g., `High`, `Medium`, `Highest`).
  - 💡 Hover tooltips with complete details.
  - 🔗 Direct links to open each issue in Jira Cloud (`/browse/{KEY}`).
- Includes a live counter badge in the **Work** column header.
- Respects **Out of Office (OOO)** settings with the option to hide Jira tasks while on leave.

---

## 🏖️ Out of Office (OOO) Mode

Under Settings (`⚙️`) -> Google APIs, you can toggle **Out of Office (OOO) Mode**:
1. When enabling OOO, the dashboard will prompt you to select a return date.
2. While OOO is active:
   - 🛑 **Work** events (Gmail, Tasks, Google Calendar) will be hidden from the Today/This Week panels.
   - 🔒 You can choose to hide **Jira**, **GitHub**, **Bitbucket**, and **GitLab** integrations individually if OOO is active.
   - 🔴 OOO status is indicated by a red "OOO" badge in the Today and This Week column headers. Clicking this badge takes you directly to the Google Settings tab.
3. OOO mode automatically disables itself on or after the specified return date.

---

## 🔄 CORS Handling & Multi-Platform Deployment (Jira & Gmail APIs)

Direct browser-to-API calls for **Jira Cloud** (`*.atlassian.net`) and **Gmail** (`gmail.googleapis.com`) typically face CORS restrictions because their endpoints do not return permissive `Access-Control-Allow-Origin` headers for raw browser clients.

To solve this completely without requiring browser extensions, this project includes built-in transparent proxy handlers for all major deployment platforms:

### 1. 💻 Local Development (`npm run dev`)
- Powered by a custom Vite middleware in [`vite.config.js`](file:///Users/hector.de.isidro/Developer/startpage-web/vite.config.js) under the endpoint `/api/proxy`.
- Requests from `safeFetch()` are proxied on-the-fly to Jira and Gmail with all authentication headers forwarded securely.
- **No browser extensions required.**

### 2. ⚡ Cloudflare Pages
- Powered by Cloudflare Pages Functions in [`functions/api/proxy.js`](file:///Users/hector.de.isidro/Developer/startpage-web/functions/api/proxy.js).
- When deployed to Cloudflare Pages, requests to `/api/proxy` are automatically executed as a lightweight Edge Function that attaches CORS headers and relays HTTPS requests securely.
- Fully serverless, zero maintenance, and works automatically.

### 3. ▲ Vercel
- Powered by Vercel Serverless Functions in [`api/proxy.js`](file:///Users/hector.de.isidro/Developer/startpage-web/api/proxy.js).
- Deploying to Vercel automatically exposes the `/api/proxy` serverless endpoint with zero configuration.

### 4. 💎 Netlify
- Powered by Netlify Functions in [`netlify/functions/proxy.js`](file:///Users/hector.de.isidro/Developer/startpage-web/netlify/functions/proxy.js) with routing configured via [`netlify.toml`](file:///Users/hector.de.isidro/Developer/startpage-web/netlify.toml).
- Transparently proxies requests in Netlify without requiring extra setup.

### 5. 📦 Pure Static Hosting (GitHub Pages, Firebase Hosting, AWS S3)
- Pure static web hosts do not execute serverless functions.
- If deploying to a pure static host, you can either:
  - Deploy a free standalone Cloudflare Worker proxy endpoint.
  - Or use a browser extension (such as *Allow CORS*).

### 6. 🐳 Self-Hosted Server / Docker (Node.js, Nginx)
- Run `npm run preview` or configure a reverse proxy in Nginx forwarding `/api/proxy` to target services.

---

## ⚡ Quick Actions & Keyboard Navigation

The dashboard is built with first-class accessibility and full keyboard navigation support across the entire app:

### ⌨️ Global Shortcuts

| Shortcut | Action | Destination |
|:---:|---|---|
| <kbd>E</kbd> | ✉️ **Compose Email** | Opens Gmail compose window directly |
| <kbd>C</kbd> | 📅 **Create Event** | Opens Google Calendar event creation |
| <kbd>T</kbd> | ✅ **New Task** | Opens the Quick Task creation modal |
| <kbd>N</kbd> | 📝 **Quick Notes** | Opens the Quick Notes modal |
| <kbd>Esc</kbd> | ❌ **Close Modal** | Closes any open dialog or modal |

> **Note**: Global single-key shortcuts are automatically disabled while typing in text fields, textareas, notes, or when dialogs are active.

### 🧭 Full Keyboard Navigation

- **Sequential Tab Order**: Navigate seamlessly through all widgets, header buttons, task items, and modals using <kbd>Tab</kbd> and <kbd>Shift + Tab</kbd>.
- **Visible Focus Indicator**: Accessible `:focus-visible` outline rings highlight the active element with clean contrast across dark and light themes.
- **Settings Tabs (WAI-ARIA Pattern)**:
  - <kbd>→</kbd> / <kbd>↓</kbd>: Move to next settings tab.
  - <kbd>←</kbd> / <kbd>↑</kbd>: Move to previous settings tab.
  - <kbd>Home</kbd> / <kbd>End</kbd>: Jump directly to the first or last tab.
- **Accessible Modal Trapping & Restoration**:
  - Tabbing is trapped within open modals to prevent accidental background interaction.
  - When closing a modal, focus automatically returns to the button that opened it.
- **Interactive Widgets Activation**:
  - Activate the World Clock, Weather widget, Upcoming Events banner, or Out of Office badges using <kbd>Enter</kbd> or <kbd>Space</kbd>.
- **Quick Notes Undo / Redo**:
  - <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>Z</kbd>: Undo note changes.
  - <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> (or <kbd>Ctrl</kbd> + <kbd>Y</kbd>): Redo note changes.

---

## 🤝 Contributing

Contributions are welcome! Please check out the [Contributing Guidelines](./CONTRIBUTING.md) for details on how to submit issues and pull requests.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
