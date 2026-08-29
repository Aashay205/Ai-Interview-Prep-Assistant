require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

const PORT = process.env.PORT || 3000

// Validate required environment variables for production
if (process.env.NODE_ENV === "production") {
    const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "GOOGLE_GENAI_API_KEY", "CLIENT_URL"]
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])
    
    if (missingEnvVars.length > 0) {
        console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`)
        process.exit(1)
    }
}

// Validate JWT_SECRET in all environments
if (!process.env.JWT_SECRET) {
    console.error("ERROR: JWT_SECRET is required but not set")
    process.exit(1)
}

connectToDB()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`)
})