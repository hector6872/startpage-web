# Personal Landing Page Dashboard

A beautiful, minimalist landing page featuring task management, calendar schedules, weather forecasts, world clocks, quote widgets, and integrations with Git, Jira, and Google APIs.

## Google Cloud Console & APIs Setup Guide

To enable Google Calendar and Gmail integrations on this dashboard, you need to set up a project in the Google Cloud Console and configure OAuth 2.0 credentials. Follow these steps:

### 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Log in with your Google account.
3. Click on the project dropdown at the top navigation bar and select **New Project**.
4. Give your project a name (e.g., `Personal Dashboard`) and click **Create**.

### 2. Enable Required APIs
You must enable the APIs that this dashboard communicates with:
1. Go directly to the [Google Cloud API Library](https://console.cloud.google.com/apis/library).
2. Search for and enable the following APIs one by one:
   - **Google Calendar API**
   - **Gmail API**
   - **Google Tasks API**
   - **People API** (Optional, used for user info retrieval)

### 3. Configure the OAuth Consent Screen
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

### 4. Create OAuth 2.0 Credentials
1. Go directly to the [Google Cloud Credentials Page](https://console.cloud.google.com/apis/credentials).
2. Click **Create Credentials** at the top and select **OAuth client ID**.
3. Choose **Web application** as the Application type.
4. Name your client (e.g., `Web Client`).
5. Under **Authorized JavaScript origins**, click **Add URI** and enter:
   - `http://localhost:5173` (or the specific local/production URL where your landing page is served).
   - *Note: Wildcards and IP addresses are not permitted as Authorized JavaScript origins by Google. Always use localhost or a qualified domain name.*
6. Click **Create**.
7. Copy the generated **Client ID** (it looks like `xxxxxxxx.apps.googleusercontent.com`).

### 5. Configure the Dashboard
1. Open your dashboard in the browser.
2. Click the settings gear icon in the bottom corner.
3. Navigate to the **Google** tab.
4. Paste your **Google Client ID** into the input field and save settings.
5. You can now log into your **Personal** and **Work** accounts separately!

## Git Integrations (GitHub, Bitbucket, GitLab)

This dashboard supports aggregating pull requests and merge requests across GitHub, Bitbucket, and GitLab:

- **GitHub**: Requires a [Personal Access Token (PAT)](https://github.com/settings/tokens/new?scopes=repo&description=Personal%20Startpage) with `repo` scope and your username.
- **Bitbucket**: Supports two authentication methods:
  * **Personal API Token**: Generate it in your Bitbucket **Personal settings -> API tokens** (make sure to select both `Repositories: Read` and `Pull requests: Read` scopes). Under "Atlassian Account Email", enter your Atlassian account email address, and under "API Token", paste the token (starts with `ATAT...`).
  * **Workspace Access Token**: Generate it in your **Workspace Settings -> Access tokens** (with `Pull requests: Read` scope). Under "Atlassian Account Email", enter your username (used for filtering), and under "API Token", paste the token (starts with `ATCT...`).
  * In both cases, **Workspace ID** is the slug/identifier of your workspace (found in the URL after `bitbucket.org/`).
- **GitLab**:
  1. Generate a [Personal Access Token (PAT)](https://gitlab.com/-/profile/personal_access_tokens?name=Personal%20Startpage&scopes=api) in your GitLab Account Settings with the `api` scope.
  2. Enter the GitLab Host URL (defaults to `https://gitlab.com` but supports self-hosted GitLab instances).
  3. Enter your GitLab username.
  4. The dashboard will automatically fetch open Merge Requests where you are either assigned or requested as a reviewer.

## Out of Office (OOO) Mode

Under Settings -> Google APIs, you can toggle **Out of Office (OOO) Mode**:
1. When enabling OOO, the dashboard will prompt you to select a return date.
2. While OOO is active:
   - **Work** events (Gmail, Tasks, Google Calendar) will be hidden from the Today/This Week panels.
   - You can choose to hide **Jira**, **GitHub**, **Bitbucket**, and **GitLab** integrations individually if OOO is active.
   - OOO status is indicated by a red "OOO" badge in the Today and This Week column headers. Clicking this badge takes you directly to the Google Settings tab.
3. OOO mode automatically disables itself on or after the specified return date.

## Known Limitations & Troubleshooting (CORS)

### Gmail & Jira APIs CORS Issue
Because this dashboard is a client-side application running directly in the browser, direct calls to certain Google endpoints (like `gmail.googleapis.com` for fetching emails) and Jira APIs will trigger browser CORS (Cross-Origin Resource Sharing) restrictions. Google Calendar and People APIs allow CORS requests natively, but the Gmail API does not consistently support raw `fetch` requests with custom authorization headers from arbitrary web origins.

To resolve this during local development, you must bypass the browser's CORS checks:

1. Install a CORS-bypassing browser extension. We recommend:
   - **"Allow CORS: Access-Control-Allow-Origin"** by developer **Muyor** (available on Chrome Web Store and Firefox Add-ons).
2. Enable the extension when testing the dashboard locally.
3. Ensure it is configured to allow headers on `https://gmail.googleapis.com` and your Jira server domain.
4. *Remember to turn the extension off when browsing other sites to maintain standard browser security.*
