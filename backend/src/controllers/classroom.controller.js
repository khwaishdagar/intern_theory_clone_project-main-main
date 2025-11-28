const express = require('express')

const router = express.Router()
const classroomSchema = require('../models/classroom.model')

router.get('/', async (req, res) => {
  try {
    const data = await classroomSchema.find({})

   return res.status(200).send(data)
  } catch (err) {
     return res.status(500).json(err)
  }
})

router.post("/", async(req, res) => {
    const newProduct = new classroomSchema(req.body)
    try {
        const savedproduct = await newProduct.save()
        return res.status(200).json(savedproduct)
    } catch (err) {
        return res.status(500).json(err)
    }
})

module.exports = router


