# 🚀 AI Interview Preparation Assistant

An AI-powered interview preparation platform that helps students and job seekers practice technical and HR interviews with personalized AI-generated questions and intelligent feedback.


 # Live Demo

 https://ai-interview-prep-assistant-rho.vercel.app/
 
## 🌟 Features

- 🤖 AI-generated interview questions based on selected role and experience level
- 💬 Personalized feedback using Google Gemini AI
- 🔐 Secure JWT Authentication
- 👤 User Registration & Login
- 📚 Technical and HR interview preparation
- 📈 Track interview sessions and progress
- 🎯 Role-specific interview practice
- 📱 Fully responsive UI
- ⚡ Fast and intuitive user experience

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

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
│   │   ├── middleware/      # Authentication middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # AI & utility services
│   │   └── utils/           # Helper functions
│   │
│   ├── server.js            # Entry point
│   ├── package.json
│   └── .gitignore
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/          # Images & static assets
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Application pages
│   │   ├── context/         # React Context API
│   │   ├── services/        # API calls
│   │   ├── hooks/           # Custom React hooks
│   │   └── App.jsx
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
2. Selects desired job role.
3. AI generates interview questions.
4. User answers each question.
5. Gemini AI analyzes the response.
6. AI provides:
   - Strengths
   - Weaknesses
   - Suggestions for improvement
7. User continues practicing and improving interview skills.

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
cd server
npm install
```

Create a `.env` file

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

Run backend

```bash
npm start
```

---

### Frontend Setup

```bash
cd client
npm install
```

Run frontend

```bash
npm start
```

The application will be available at

```
http://localhost:3000
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| MONGO_URI | MongoDB Connection String |
| JWT_SECRET | Secret Key for JWT |
| GEMINI_API_KEY | Google Gemini API Key |
| PORT | Backend Port |

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
