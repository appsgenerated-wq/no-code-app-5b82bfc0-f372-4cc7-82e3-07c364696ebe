# FlavorFind - Restaurant Management App

Welcome to FlavorFind! This is a complete web application built with React and powered exclusively by a Manifest backend. It allows restaurant owners to manage their restaurant profiles and menus online.

## Features

- **User Authentication**: Secure sign-up and login for restaurant owners.
- **Restaurant Management**: Create, view, and delete your restaurant profiles.
- **Menu Management**: Add, view, and remove menu items for each of your restaurants.
- **Ownership Control**: Policies ensure you can only manage what's yours.
- **Built-in Admin Panel**: Access a comprehensive admin interface at `/admin` to manage all data, users, and files.

## Tech Stack

- **Backend**: [Manifest](https://www.mnfst.com/) (Handles database, API, auth, file storage, and policies)
- **Frontend**: [React](https://reactjs.org/) (with Vite)
- **SDK**: [@mnfst/sdk](https://www.npmjs.com/package/@mnfst/sdk)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Heroicons](https://heroicons.com/)

## Getting Started

This project is pre-configured to connect to its Manifest backend deployed on Vercel. No local backend setup is required.

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## Demo Credentials

- **Email**: `owner@demo.com`
- **Password**: `password`

Use the 'Try Demo' button for quick access.
