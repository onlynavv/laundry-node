import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import {MongoClient} from "mongodb"
import { servicesRouter } from "./services.js"
import { userAuthRouter } from "./userauth.js"
import { orderRouter } from "./order.js"
import Razorpay from "razorpay"

dotenv.config()

const app = express()

const PORT = process.env.PORT

var instance = new Razorpay({
  key_id:process.env.key_id,
  key_secret:process.env.key_secret
});

app.use(cors({origin: true}));

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

app.get("/laundry/order/createOrder/:grandTotal", (request, response)=>{
    let {grandTotal} = request.params
    const amount = grandTotal * 100
    const currency = "INR"
    const receipt = "receipt#123"
    instance.orders.create({amount, currency, receipt}, (error, order)=>{
        if(error){
            return response.send({error:err.message})
        }else{
            return response.send(order)
        }
    })
})

app.use("/laundry/user", userAuthRouter)
app.use("/services", servicesRouter)
app.use("/laundry/order", orderRouter)


app.listen(PORT, ()=>{
    console.log("app started at", PORT)
})