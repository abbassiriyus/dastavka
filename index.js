
const express = require("express")
const app = express()
const cors = require("cors")
const fileUpload = require("express-fileupload")
const bodyParser = require('body-parser');


// import
const aksiya=require('./routes/aksiya.js')





const pool = require("./db")


app.use(fileUpload())
app.use(cors())
app.use(express.static('./media'))

app.use(bodyParser.json());

app.use('/api',aksiya)



app.listen(5000, () => {
    console.log("Localhost is Running");
})
