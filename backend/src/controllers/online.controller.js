const express = require('express')

const router = express.Router()
const Product = require('../models/online.model')

router.get('/', async (req, res) => {
  try {
    const data = await  Product.find({})
    res.status(200).json(data)
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.post("/", async (req, res) => {
    const newProduct = new  Product(req.body)
    try {
        const savedproduct = await newProduct.save()
        return res.status(200).json(savedproduct)
    } catch (err) {
        return res.status(500).json(err)
    }
})


module.exports = router
