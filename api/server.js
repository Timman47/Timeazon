import {
    getProducts,
    createProduct,
    deleteProduct
} from './controllers/products.express.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import { healthcheckHandler } from '../CDK/functions/health-check.js'
import {
    createUser,
    loginUser
} from './controllers/users.controller.js'
import { addToCart, getCart, removeFromCart } from './controllers/cart.controllers.js'
import { createImageUploadUrl } from './controllers/uploads.express.js'
import { bootstrap } from './controllers/bootstrap.controller.js'

const app = express()
const PORT = process.env.PORT || 3000
 
app.use(cors())
app.use(express.json())


app.get('/api/products', getProducts)
app.post('/api/products', createProduct)
app.delete('/api/products/:id', deleteProduct)

app.post('/api/image-upload-url', createImageUploadUrl)
app.post('/api/bootstrap', bootstrap)

app.get('/api/addtocart', getCart)
app.post('/api/addtocart', addToCart)
app.delete('/api/addtocart', removeFromCart)

app.post('/api/users', createUser)
app.post('/api/login', loginUser)


app.get('/api/healthcheck', (req, res) => {
    return res.status(200).json({status: 'ok'})})
    
app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
})
