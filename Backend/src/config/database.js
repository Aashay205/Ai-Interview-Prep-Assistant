const mongoose = require("mongoose")

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database")
    }
    catch (err) {
        const isProduction = process.env.NODE_ENV === "production"
        if (isProduction) {
            console.error("Database connection failed - check MONGO_URI configuration")
        } else {
            console.error("Database connection error:", err.message)
        }
        process.exit(1)
    }
}

module.exports = connectToDB