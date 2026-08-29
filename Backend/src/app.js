const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173"
const isProduction = process.env.NODE_ENV === "production"

app.use(express.json())
app.use(cookieParser())

// CORS configuration: strict in production
const corsOptions = {
    origin: isProduction ? [allowedOrigin] : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app