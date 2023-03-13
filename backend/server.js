require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const instructorRoutes = require('./routes/instructorRoutes')
const studentRoutes = require('./routes/studentRoutes')

// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/instructor', instructorRoutes)
app.use('/student', studentRoutes)

// listen for requests
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 