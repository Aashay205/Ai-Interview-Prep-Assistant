# 🚀 AI Interview Preparation Assistant

An AI-powered interview preparation platform that helps students and job seekers practice technical and HR interviews with personalized AI-generated questions and intelligent feedback.

## 🌟 Features

- 🤖 AI-generated interview questions based on a job description
- 💬 Personalized feedback using Google Gemini AI
- 🔐 Secure JWT Authentication
- 👤 User Registration & Login
- 📄 Resume upload or self-description support
- 📚 Technical and behavioral interview preparation
- 📈 Track interview reports and match scores
- 🎙️ Live mock interview sessions with AI feedback
- 📥 Generate an improved resume PDF
- 📱 Fully responsive UI
- ⚡ Fast and intuitive user experience

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Sass
- Axios
- React Router
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt

### AI
- Google Gemini API

---
## 📂 Project Structure

```text
AI-Interview-Prep-Assistant/
│
├── Backend/
│   ├── src/
│   │   ├── config/          # Database & configuration files
│   │   ├── controllers/     # Business logic
│   │   ├── middlewares/     # Authentication and file upload middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # AI & utility services
│   │   └── services/        # AI service integration
│   │
│   ├── server.js            # Entry point
│   ├── package.json
│   └── .gitignore
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Shared components
│   │   ├── features/        # Auth and interview features
│   │   │   ├── auth/        # Authentication pages, context, hooks, and API
│   │   │   └── interview/   # Interview pages, context, hooks, styles, and API
│   │   ├── App.jsx
│   │   └── app.routes.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

## ✨ Workflow

1. User creates an account or logs in.
2. User enters a target job description.
3. User uploads a PDF/DOCX resume or provides a self-description.
4. Gemini AI generates a personalized interview plan with technical and behavioral questions.
5. User reviews the generated plan and match score.
6. User can start a live mock interview and submit answers for AI evaluation.
7. AI provides a score, strengths, improvements, and follow-up questions.
8. User can review previous reports or generate an improved resume PDF.

---

## 📸 Screenshots
<img width="1897" height="893" alt="Screenshot 2026-07-23 133909" src="https://github.com/user-attachments/assets/e9fec501-f472-43b5-9f2f-dbd404f4be7b" />
<img width="1917" height="911" alt="Screenshot 2026-07-23 133849" src="https://github.com/user-attachments/assets/9c12f1d4-2cc5-49e8-894b-c0b5c694361a" />
<img width="1917" height="897" alt="Screenshot 2026-07-23 133606" src="https://github.com/user-attachments/assets/49b45022-0fa1-444f-a8f0-a6c260be7452" />
<img width="1916" height="911" alt="Screenshot 2026-07-23 133554" src="https://github.com/user-attachments/assets/f73eb3cd-6f43-44f0-8561-e306d3a96e1f" />
<img width="1917" height="907" alt="Screenshot 2026-07-23 133540" src="https://github.com/user-attachments/assets/352d2f38-f02b-4443-9f01-0225c3fb9e8f" />


---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/Aashay205/Ai-Interview-Prep-Assistant.git
```

Move into the project

```bash
cd Ai-Interview-Prep-Assistant
```

---

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file

```env
NODE_ENV=development

PORT=3000

CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

Run backend

```bash
npm start
```

---

### Frontend Setup

```bash
cd Frontend
npm install
```

Run frontend

```bash
npm run dev
```

The application will be available at

```
http://localhost:5173
```

For a custom backend URL, create `Frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| NODE_ENV | Application environment |
| PORT | Backend port |
| CLIENT_URL | Allowed frontend origin |
| MONGO_URI | MongoDB Connection String |
| JWT_SECRET | Secret Key for JWT |
| GOOGLE_GENAI_API_KEY | Google Gemini API Key |
| VITE_API_URL | Backend API URL used by the frontend |

---

## 📖 Future Enhancements

- 🎙 Voice-based interview
- 📹 Video interview simulation
- 📊 Interview analytics dashboard
- 🏆 Leaderboard
- 📝 Resume Analyzer
- 📄 ATS Resume Checker
- 📅 Interview scheduling
- 🌐 Multi-language support

---
