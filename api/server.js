import express from 'express'
import cors from 'cors'

import { healthcheckHandler } from '../health-check.js'
import {
    productCatalogHandler,
    postProductHandler,
    deleteProductHandler,
    bootstrapHandler,
    getImageUploadUrlHandler
} from '../utility-functions.js'
import {
    postUsersHandler,
    loginHandler
} from '../users.js'
import {
    postToCartHandler,
    getToCartHandler,
    deleteFromCartHandler
} from '../addToCart.js'

const app = express()
const PORT = process.env.PORT || 3000
 
app.use(cors())
app.use(express.json())

function toLambdaEvent(req) {
    return {
        body: req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : null,
        queryStringParameters: req.query || {},
        pathParameters: req.params || {},
        headers: req.headers || {},
        httpMethod: req.method,
        path: req.path
    }
}

async function runHandler(handler, req, res) {
    try {
        const event = toLambdaEvent(req)
        const result = await handler(event, {})

        const statusCode = result?.statusCode || 200
        const headers = result?.headers || {}
        const body = result?.body ? JSON.parse(result.body) : {}

        Object.entries(headers).forEach(([key, value])) => {
            res.setHeader(key, value)
        }

        return res.status(statusCode).json(body)
    } catch (error) {
        console.error('Adapter error: ', error)
        return res.status(500).json({
            status: 'error',
            message: 'Unhandled server error'
        })
    }
}

app.get('/api/healthcheck', (req, res) =>
    runHandler(healthcheckHandler, req, res)
)
 
app.get('/api/products', (req, res) =>
    runHandler(productCatalogHandler, req, res)
)
 
app.post('/api/products', (req, res) =>
    runHandler(postProductHandler, req, res)
)
 
app.delete('/api/products/:id', (req, res) =>
    runHandler(deleteProductHandler, req, res)
)
