# Social Login Setup Guide

To enable social login (Google, GitHub, LinkedIn), you need to obtain Client IDs and Client Secrets from their respective developer consoles and add them to your `backend/.env` file.

## 1. Google OAuth

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Navigate to **APIs & Services** > **Credentials**.
4.  Click **Create Credentials** > **OAuth client ID**.
5.  Select **Web application** as the application type.
6.  Set **Authorized JavaScript origins** to `http://localhost:5173` (Frontend) and `http://localhost:8000` (Backend).
7.  Set **Authorized redirect URIs** to `http://localhost:8000/api/v1/user/auth/google/callback`.
8.  Copy the **Client ID** and **Client Secret**.
9.  Add them to `backend/.env`:
    ```
    GOOGLE_CLIENT_ID=your_client_id_here
    GOOGLE_CLIENT_SECRET=your_client_secret_here
    ```

## 2. GitHub OAuth

1.  Go to [GitHub Developer Settings](https://github.com/settings/developers).
2.  Click **New OAuth App**.
3.  Set **Homepage URL** to `http://localhost:5173`.
4.  Set **Authorization callback URL** to `http://localhost:8000/api/v1/user/auth/github/callback`.
5.  After creation, copy the **Client ID** and generate a new **Client Secret**.
6.  Add them to `backend/.env`:
    ```
    GITHUB_CLIENT_ID=your_client_id_here
    GITHUB_CLIENT_SECRET=your_client_secret_here
    ```

## 3. LinkedIn OAuth

1.  Go to [LinkedIn Developers](https://www.linkedin.com/developers/).
2.  Create a newly app.
3.  In the **Auth** tab, under **OAuth 2.0 settings**, add `http://localhost:8000/api/v1/user/auth/linkedin/callback` to **Authorized redirect URLs**.
4.  Copy the **Client ID** and **Client Secret** from the **Auth** tab.
5.  Add them to `backend/.env`:
    ```
    LINKEDIN_CLIENT_ID=your_client_id_here
    LINKEDIN_CLIENT_SECRET=your_client_secret_here
    ```

## Important Note

Once you update the `.env` file, you **MUST restart the backend server** for the changes to take effect.
