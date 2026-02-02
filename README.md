Crudzaso — Task Manager (Vanilla JS + JSON Server)

Crudzaso is a academic task manager built with Vanilla JavaScript and JSON Serve (`db.json`) as a mock REST API. It supports role-based views for Admin and Users.

Features
- **Auth (demo)**: login by email/password (stored in `db.json`)
- **User view**: list/search “My tasks”, update **status/priority**, delete tasks
- **Admin dashboard**: manage **all tasks**, filters (All/Pending/Completed), inline edit, delete
- **Metrics**: totals, pending/in progress/completed, progress %

Tech Stack
- Frontend: Vanilla JS + HTML/CSS
- API (mock): json-server
- Database: `db.json` (`users`, `tasks`)
- Dev tooling: Vite


Setup & Run
1) Install
```bash
git clone https://github.com/stivenmoscoso/Crudzaso.git
cd Crudzaso
npm install

2) Start JSON Server (API)
Bash

npx json-server --watch db.json --port 3000

API:

http://localhost:3000/users
http://localhost:3000/tasks

3) Start Vite
Bash

npm run dev
Open: http://localhost:5173


Demo Credentials

Admin:

Email: admin@gmail.com
Password: 123456

User:

Email: user@gmail.com
Password: 123456

