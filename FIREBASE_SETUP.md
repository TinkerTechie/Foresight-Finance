# How to Set Up Your Own Firebase Backend

The application currently uses a sample Firebase configuration. To secure your data and enable features like **Google Sign-In** on your own domain, you must create your own Firebase project.

## Step 1: Create a Firebase Account & Project
1.  Go to [firebase.google.com](https://firebase.google.com/) and sign in with your Google account.
2.  Click **"Go to Console"** (top right).
3.  Click **"Add project"**.
4.  Enter a name (e.g., `My-Foresight-Finance`) and continue.
5.  Enable Google Analytics if you want (optional).
6.  Click **"Create Project"**.

## Step 2: Enable Authentication
1.  In your new project dashboard, click **"Build"** > **"Authentication"** in the sidebar.
2.  Click **"Get Started"**.
3.  **Enable Email/Password**:
    *   Click "Email/Password".
    *   Toggle "Enable".
    *   Click "Save".
4.  **Enable Google Sign-In**:
    *   Click "Add new provider".
    *   Select "Google".
    *   Toggle "Enable".
    *   Choose a support email.
    *   Click "Save".

## Step 3: Create the Database (Firestore)
1.  Click **"Build"** > **"Firestore Database"** in the sidebar.
2.  Click **"Create Database"**.
3.  Choose a location (e.g., `nam5` for US or one closest to you).
4.  Star in **Test Mode** (easiest for development) or **Production Mode**.
    *   *Note: If you choose Production Mode, you'll need to update Rules to allow users to read/write their own data.*
5.  Click **"Create"**.

## Step 4: Get Your Configuration Keys
1.  In the Project Overview (gear icon ⚙️ > **Project settings**).
2.  Scroll down to "Your apps".
3.  Click the `< / >` (Web) icon to create a web app.
4.  Register the app (nickname: "Foresight Web").
5.  You will see a `firebaseConfig` object (apiKey, authDomain, etc.).

## Step 5: Connect to Your Code
You should use **Environment Variables** to keep these secret.

1.  Create a file named `.env.local` in the root of your project.
2.  Paste your keys like this:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3.  Restart your server: `npm run dev`.

## Important for Deployment
If you deploy to Vercel/Netlify:
1.  Go to **Authentication** > **Settings** > **Authorized domains** in Firebase Console.
2.  Add your deployment domain (e.g., `foresight-finance.vercel.app`).
