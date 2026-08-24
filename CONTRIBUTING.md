# 🤝 Contributing to startpage-web

Thank you for your interest in contributing to **startpage-web**! 🎉 We welcome contributions of all kinds, whether it's reporting bugs, improving documentation, suggesting new features, or submitting code changes.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
  - [Reporting Bugs](#-reporting-bugs)
  - [Suggesting Enhancements](#-suggesting-enhancements)
  - [Pull Request Expectations](#-pull-request-expectations)
- [Development Setup](#-development-setup)
- [Project Structure](#-project-structure)
- [Style & Conventions](#-style--conventions)
- [License](#-license)

---

## 📜 Code of Conduct

Please help us maintain a welcoming and inclusive community. Be respectful, constructive, and open to feedback in all interactions.

---

## 💡 How Can I Contribute?

### 🐛 Reporting Bugs

If you find a bug:
1. Check the [existing Issues](https://github.com/hector6872/startpage-web/issues) to ensure it hasn't already been reported.
2. Open a new issue with a clear description, including:
   - Steps to reproduce the problem.
   - Expected vs actual behavior.
   - Screenshots or console error logs if applicable.
   - Browser and OS details.

### ✨ Suggesting Enhancements

Have an idea to make startpage-web better?
1. Open a new issue outlining your proposal.
2. Clearly describe the motivation and use cases.
3. Share UI mockups or examples if relevant.

### 🚀 Pull Request Expectations

When submitting a Pull Request, we expect the following:

- 🎯 **Focused Scope**: Keep PRs focused on a single feature, fix, or improvement. Avoid large, unrelated changes in a single PR.
- 📝 **Clear & Descriptive Summary**:
  - Explain *what* was changed and *why*.
  - Reference relevant issues (e.g., `Closes #12` or `Fixes #45`).
- 📸 **Visual Evidence (UI Changes)**: If your PR includes visual or layout adjustments, please attach before/after screenshots or screen recordings.
- 🟢 **Passing Builds**: Ensure your code builds cleanly without errors (`npm run build`) and passes all CI/CD checks.
- 🎨 **Code Quality & Clean Architecture**:
  - Adhere to the project's vanilla JS and CSS approach (no unnecessary external heavy dependencies).
  - Ensure UI components remain fully responsive and accessible.
  - Maintain clean, self-explanatory code and meaningful commit messages.
- 🔄 **Up-to-Date Branches**: Keep your branch up to date with the latest base branch and resolve any merge conflicts before requesting a review.

---

## 🛠️ Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hector6872/startpage-web.git
   cd startpage-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```

4. **Build production bundle**:
   ```bash
   npm run build
   ```

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```text
startpage-web/
├── api/            # Vercel serverless proxy functions
├── functions/      # Cloudflare Pages Edge proxy functions
├── netlify/        # Netlify proxy functions
├── index.html      # Main HTML entry point
├── styles.css      # Core stylesheets & UI themes
├── app.js          # Main client-side logic & integrations
├── vite.config.js  # Vite build configuration & local dev proxy
└── package.json    # Project metadata and dependencies
```

---

## 🎨 Style & Conventions

- **Vanilla JavaScript & CSS**: Keep dependencies minimal and lightweight.
- **Responsive & Accessible**: Ensure UI elements adapt cleanly to mobile, tablet, and desktop viewports.
- **Clean Commits**: Write descriptive commit messages (e.g. following [Conventional Commits](https://www.conventionalcommits.org/)).

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
