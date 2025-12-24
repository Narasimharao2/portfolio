# 🚀 Deployment Guide: How to Go Live

You asked for manual steps and the "Better" way. Here is the complete guide.

## Part 1: Upload Code to GitHub (Manual Way)
If you don't want to use the script, open your terminal (Command Prompt or Git Bash) in this folder and type these commands one by one:

1.  **Stage Files**:
    ```bash
    git add .
    ```
2.  **Commit Changes**:
    ```bash
    git commit -m "Deployment Update"
    ```
3.  **Link Repository** (Only do this ONCE):
    *   Go to [GitHub.com/new](https://github.com/new) and create a repo.
    *   Copy the URL (e.g., `https://github.com/Start/portfolio.git`).
    *   Run:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    ```
4.  **Push to Cloud**:
    ```bash
    git push -u origin master
    ```

---

## Part 2: The "Better" Way (Actual Hosting)
**GitHub alone is not enough.**
GitHub only stores your *files*. It cannot run your Python code (`app.py`), which means your **Contact Form** and **AI Simulations** will NOT work if you only use GitHub Pages.

**✅ The Solution: Render.com (Free & Powerful)**
Render is "better" because it runs a real server for your Python backend.

### How to Deploy on Render:
1.  **Push your code to GitHub** (using Part 1 or `deploy_website.bat`).
2.  Go to [dashboard.render.com](https://dashboard.render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub Repository.
5.  **Settings**:
    *   **Runtime**: Python 3
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `gunicorn app:app`
6.  **Environment Variables** (Important for Email!):
    *   Add `EMAIL_USER`: `your_gmail@gmail.com`
    *   Add `EMAIL_PASS`: `your_16_char_app_password`
7.  Click **Deploy Web Service**.

Your website will be live at `https://your-app-name.onrender.com`.
This is the professional way to host full-stack apps! 🚀
