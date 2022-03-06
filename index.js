import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import {MongoClient} from "mongodb"
import { servicesRouter } from "./services.js"
import { userAuthRouter } from "./userauth.js"
import { orderRouter } from "./order.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT

app.use(cors())

app.use(express.json())

const MONGO_URL = process.env.MONGO_URL

async function createConnection(){
    const client = new MongoClient(MONGO_URL)
    await client.connect()
    console.log("mongodb connected")
    return client
}

export const client = await createConnection()

app.get("/", (request, response)=>{
    response.send("hai from laundry app")
})

app.use("/laundry/user", userAuthRouter)
app.use("/services", servicesRouter)
app.use("/laundry/order", orderRouter)


app.listen(PORT, ()=>{
    console.log("app started at", PORT)
})