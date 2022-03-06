import express, { response } from "express"
import { authAndVerifyAdmin } from "./customauth.js"
import { createService, createCategories, addProducts, addExtras, setDeliveryMethods, getAllServices, getAllCategoriesForService, getAllProductsForCategory, getExtras, getDeliveryMethods, getAllProductsByService, getServiceById, getProductById, updateProductById, deleteProduct} from "./helper.js"
const router = express.Router()

router.route("/createService")
.post(async (request, response)=>{
    console.log(request.body)
    const data = await createService(request.body)
    response.send(data)
})

router.route("/getAllServices")
.get(async (request, response)=>{
    const data = await getAllServices()
    response.send(data)
})

router.route("/adminGetAllServices")
.get(authAndVerifyAdmin, async(request, response)=>{
    const data = await getAllServices()
    response.send(data)
})

router.route("/getServiceById/:id")
.get(async (request, response)=>{
    const {id} = request.params
    const data = await getServiceById(id)
    response.send(data)
})

router.route("/adminGetServiceById/:id")
.get(authAndVerifyAdmin, async (request, response)=>{
    const {id} = request.params
    const data = await getServiceById(id)
    response.send(data)
})

router.route("/createCategories")
.post(async (request, response)=>{
    console.log(request.body)
    const data = await createCategories(request.body)
    response.send(data)
})

router.route("/getAllCategoriesForService/:id")
.get(async (request, response)=>{
    const {id} = request.params
    const data = await getAllCategoriesForService(id)
    response.send(data)
})

router.route("/adminGetAllCategoriesForService/:id")
.get(authAndVerifyAdmin, async (request, response)=>{
    const {id} = request.params
    const data = await getAllCategoriesForService(id)
    response.send(data)
})

router.route("/addProducts")
.post(authAndVerifyAdmin, async (request, response)=>{
    const data = await addProducts({...request.body, rate:parseFloat(request.body.rate)})
    response.send(data)
})

router.route("/adminDeleteProduct/:id")
.delete(authAndVerifyAdmin, async(request, response)=>{
    const {id} = request.params
    const data = await deleteProduct(id)
    response.send(data)
})

router.route("/getAllProductsForCategory/:id")
.get(async (request, response)=>{
    const {id} = request.params
    const data = await getAllProductsForCategory(id)
    response.send(data)
})

router.route("/adminGetAllProductsForCategory/:id")
.get(authAndVerifyAdmin, async (request, response)=>{
    const {id} = request.params
    const data = await getAllProductsForCategory(id)
    response.send(data)
})

router.route("/getAllProductsByService/:id")
.get(async (request, response)=>{
    const {id} = request.params
    const data = await getAllProductsByService(id)
    response.send(data)
})

router.route("/adminGetProductById/:id")
.get(authAndVerifyAdmin, async(request, response)=>{
    const {id} = request.params
    const data = await getProductById(id)
    response.send(data)
})

router.route("/adminUpdateProductById/:id")
.put(authAndVerifyAdmin, async(request, response)=>{
    const {id} = request.params
    const data = await updateProductById(id, {...request.body, rate:parseFloat(request.body.rate)})
    response.send(data)
})

router.route("/addExtras")
.post(async (request, response)=>{
    console.log(request.body)
    const data = await addExtras({...request.body, rate:parseFloat(request.body.rate)})
    response.send(data)
})

router.route("/getExtras")
.get(async (request, response)=>{
    const data = await getExtras()
    response.send(data)
})

router.route("/deliveryMethods")
.post(async (request, response)=>{
    console.log(request.body)
    const data = await setDeliveryMethods(request.body)
    response.send(data)
})

router.route("/getDeliveryMethods")
.get(async (request, response)=>{
    const data = await getDeliveryMethods()
    response.send(data)
})

export const servicesRouter = router