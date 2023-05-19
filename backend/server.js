require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const instructorRoutes = require('./routes/instructorRoutes')
const studentRoutes = require('./routes/studentRoutes')
const path = require('path');
const bodyParser = require('body-parser');
// express app
const app = express()

// middleware
app.use(express.json())
// app.use(express.static(path.join(__dirname, 'screenshots')));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/instructor', instructorRoutes)
app.use('/student', studentRoutes)

// listen for requests
mongoose.connect(mongodb+srv://abanob11:Online_Simulator@cluster0.4kouk9k.mongodb.net/?retryWrites=true&w=majority)
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(4000, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 
