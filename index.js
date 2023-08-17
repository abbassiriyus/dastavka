
const express = require("express")
const app = express()
const cors = require("cors")
const fileUpload = require("express-fileupload")
const bodyParser = require('body-parser');


// import
const aksiya=require('./routes/aksiya.js')
const position=require('./routes/position.js')
const compony=require('./routes/compony.js')
const news=require('./routes/news.js')
<<<<<<< HEAD
const preferences=require('./routes/preferences.js')
=======
const users=require('./routes/user.js')


>>>>>>> d74f385d74ff8ade46c633e2270b0d0f929a63bc
const pool = require("./db")


app.use(fileUpload())
app.use(cors())
app.use(express.static('./media'))

app.use(bodyParser.json());

app.use('/api',aksiya)
app.use('/api',position)
app.use('/api',news)
app.use('/api',compony)
<<<<<<< HEAD
app.use('/api',preferences)
=======
app.use('/auth',users)


>>>>>>> d74f385d74ff8ade46c633e2270b0d0f929a63bc


app.listen(5000, () => {
    console.log("Localhost is Running");
})
