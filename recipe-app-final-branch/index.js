const dotenv = require("dotenv")
const server = require("./server")
const mongoose = require("mongoose")

dotenv.config()

const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI, {}).then(() => {
    server.listen(port, () => {
        console.log(`Sever is listening on http://localhost:${port}`)
    })
}).catch((e) => {
    console.error(`Failed to start server:`, e)
})