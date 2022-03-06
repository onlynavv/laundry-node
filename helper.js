import { ObjectId } from "mongodb"
import {client} from "./index.js"
import bcrypt from "bcrypt"

async function createService(service){
    return await client.db("laundry").collection("services").insertOne(service)
}

async function createCategories(category){
    return await client.db("laundry").collection("categories").insertOne(category)
}

async function addProducts(data){
    return await client.db("laundry").collection("products").insertOne(data)
}

async function deleteProduct(id){
    return await client.db("laundry").collection("products").deleteOne({_id:ObjectId(id)})
}

async function addExtras(data){
    return await client.db("laundry").collection("extras").insertOne(data)
}

async function setDeliveryMethods(data){
    return await client.db("laundry").collection("deliveryMethods").insertOne(data)
}

async function getAllServices(){
    return await client.db("laundry").collection("services").find({}).toArray()
}

async function getServiceById(id){
    return await client.db("laundry").collection("services").findOne({_id:ObjectId(id)})
}

async function getAllCategoriesForService(id){
    return await client.db("laundry").collection("categories").find({serviceId:id}).toArray()
}

async function getAllProductsForCategory(id){
    return await client.db("laundry").collection("products").find({catId:id}).toArray()
}

async function getAllProductsByService(id){
    // return await client.db("laundry").collection("products").find({serviceId:id}).toArray()
    return await client.db("laundry").collection("products").aggregate([
        {
            $match:{
                serviceId:id
            }
        },
        {
            $group:{
                "_id":"$catId",
                "catName":{"$first":"$catName"},
                "serviceName":{"$first":"$serviceName"},
                "products":{
                    $push:{
                        "_id":"$_id",
                        "name":"$name",
                        "rate":"$rate",
                        "catId":"$catId",
                        "catName":"$catName",
                        "serviceId":"$serviceId",
                        "serviceName":"$serviceName"
                    }
                }
            }
        }
    ]).toArray()
}

async function getProductById(id){
    return await client.db("laundry").collection("products").findOne({_id:ObjectId(id)})
}

async function updateProductById(id, data){
    return await client.db("laundry").collection("products").updateOne({_id:ObjectId(id)},{$set:{name:data.name, rate:data.rate}})
}

async function getExtras(){
    return await client.db("laundry").collection("extras").find({}).toArray()
}

async function getDeliveryMethods(){
    return await client.db("laundry").collection("deliveryMethods").find({}).toArray()
}

async function placeOrder(order) {
    return await client.db("laundry").collection("orders").insertOne(order);
}

async function getOrderDetailById(id){
    return await client.db("laundry").collection("orders").findOne({"_id":ObjectId(id)})
}

async function userGetOrders(userId){
    return await client.db("laundry").collection("orders").find({userId: userId}).sort({orderedAt: -1}).toArray()
}

async function getAllOrders(){
    return await client.db("laundry").collection("orders").find({}).sort({orderedAt: -1}).toArray()
}

async function getNewOrders(){
    return await client.db("laundry").collection("orders").find({orderStatus:{$in:["pickup requested", "laundry pickedup"]}}).sort({orderedAt: -1}).toArray()
}

async function getOnProgressOrders(){
    return await client.db("laundry").collection("orders").find({orderStatus:{$in:["on progress", "completed"]}}).toArray()
}

async function getCompletedOrders(){
    return await client.db("laundry").collection("orders").find({orderStatus: "delivered"}).toArray()
}

async function updateOrderStatus(id, stage){
    return await client.db("laundry").collection("orders").updateOne({"_id":ObjectId(id), "statusArray.stage":stage}, {$set:{"statusArray.$.isCompleted":"true", "statusArray.$.updatedAt":new Date().toISOString(), "orderStatus":stage, "orderUpdatedAt": new Date()}},{upsert:true})
}

async function getUserByEmail(email){
    return await client.db("laundry").collection("users").findOne({email:email})
}

async function getUserById(userId){
    return await client.db("laundry").collection("users").findOne({_id:ObjectId(userId)})
}

async function genPassword(password){
    const NO_OF_ROUNDS = 10
    const salt = await bcrypt.genSalt(NO_OF_ROUNDS)
    
    const hashedPassword = await bcrypt.hash(password, salt)
    
    return hashedPassword
}

async function createUser(data) {
    return await client.db("laundry").collection("users").insertOne(data);
}

export {createService, createCategories, addProducts, addExtras, setDeliveryMethods, getAllServices, getAllCategoriesForService, getAllProductsForCategory, getExtras, getDeliveryMethods, getAllProductsByService, getUserByEmail, genPassword, createUser, getUserById, getServiceById, placeOrder, getOrderDetailById, userGetOrders, getProductById, updateProductById, deleteProduct, getAllOrders, getNewOrders, getOnProgressOrders, getCompletedOrders, updateOrderStatus}