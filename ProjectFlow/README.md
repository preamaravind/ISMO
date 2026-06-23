# ProjectFlow – Modern Project Management

A modern, full-stack project management application built for teams and individuals who want a clean, fast way to organize projects and tasks. Recently updated to support Serverless architecture on Vercel with PostgreSQL!

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)

---

## 🌟 Features

- **Authentication** — Register, login, logout with secure HTTP-only cookies and JWT tokens.
- **Project Management** — Create, view, edit, and delete projects with progress tracking.
- **Task Management** — Full CRUD (Create, Read, Update, Delete) capabilities. Set priorities, due dates, and statuses.
- **Dashboard Analytics** — Real-time stats, dynamic Pie Charts, and recent activity timelines.
- **Serverless Ready** — Pre-configured for zero-config Vercel deployment (Monorepo setup).
- **Responsive Design** — Works beautifully on desktop, tablet, and mobile browsers.

---

## 💻 Tech Stack

| Layer      | Technology                                      |
|------------|------------------------------------------------|
| **Frontend**   | React 18, Vite, Tailwind CSS, React Router v6  |
| **Backend**    | Node.js, Express.js, JWT Auth                  |
| **Database**   | PostgreSQL (Neon DB), Sequelize ORM            |
| **Charts**     | Recharts                                        |
| **Deployment** | Vercel (Serverless Functions)                   |

---

## 📂 Architecture & Structure

This project uses a **Monorepo Structure** optimized for Vercel deployment. The frontend and backend live in the same repository, but Vercel treats the `api/` folder as Serverless Backend Functions.

```
ProjectFlow/
├── api/             # Vercel Serverless Entrypoint for the Backend
│   └── index.js     # Imports Express app and handles database connections
├── client/          # React frontend (Vite)
│   ├── src/         # UI Components, Pages, Axios configuration
│   └── package.json 
├── server/          # Express backend logic
│   ├── config/      # Database config (Sequelize)
│   ├── controllers/ # Route handlers
│   ├── models/      # Database schemas (User, Project, Task)
│   ├── routes/      # Express API routes
│   └── app.js       # Core Express Application
├── vercel.json      # Routing configuration for Vercel
└── package.json     # Root dependencies for Backend
```

---

## 🚀 Deployment (Vercel)

The easiest way to deploy this application is on [Vercel](https://vercel.com). Because of the `vercel.json` file, Vercel will automatically build the React frontend and configure the Node.js backend simultaneously.

### 1. Database Setup (Neon PostgreSQL)
1. Go to [Neon.tech](https://neon.tech/) and create a free PostgreSQL database.
2. Copy your **Connection String** (it starts with `postgresql://...`).

### 2. Vercel Setup
1. Push your code to GitHub.
2. In Vercel, click **Add New Project** and import your GitHub repository.
3. Vercel will automatically detect the **Vite** frontend. Leave the build settings as default.
4. Open the **Environment Variables** tab before clicking Deploy, and add the following:

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_URL` | Your Neon connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | A random, long string | `super_secret_encryption_key_123` |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `NODE_ENV` | Must be set to production | `production` |

5. Click **Deploy**. Vercel will build the frontend and set up the serverless backend.

### 3. Database Initialization
Once deployed, if you encounter database errors (like missing columns or tables), you can instantly reset and build the schema by visiting the hidden reset route in your browser:
`https://your-vercel-domain.vercel.app/api/reset-db`

---

## 🛠 Local Development

If you want to run the app locally on your machine instead of deploying it:

### 1. Setup Database
Create a local PostgreSQL database, or use a free remote Neon database connection string.

### 2. Start the Backend
```bash
# Install dependencies from the root directory
npm install

# Start the Express server
cd server
npm run dev
```

### 3. Start the Frontend
```bash
# Open a new terminal window
cd client

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```
Your backend will run on `http://localhost:5000` and your frontend on `http://localhost:5173`.

---

## 📝 License

MIT — feel free to use and modify it for your own projects!
