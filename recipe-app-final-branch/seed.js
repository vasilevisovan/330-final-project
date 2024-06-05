const User = require("./models/user")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const ADMIN_NAME = "System Admin"
const ADMIN_EMAIL = "admin@recipesite.com"
const ADMIN_PASS = "passwordAdmin"

const main = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)

        console.log("DB connected")

        const hash = await bcrypt.hash(ADMIN_PASS, 12)

        await User.deleteOne({
            email: ADMIN_EMAIL
        })

        const admin = await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hash,
            roles: ["user", "admin"]
        })

        console.log("Successfully created admin")
        process.exit(1)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

main()