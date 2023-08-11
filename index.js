
const express = require("express")
const app = express()
const cors = require("cors")
const fileUpload = require("express-fileupload")
const bodyParser = require('body-parser');





const pool = require("./db")





app.use(fileUpload())
app.use(cors())
app.use(express.static('./lesson/Images'))
app.use(express.static('./routes/Images'))

app.use(bodyParser.json());


server.listen(5000, () => {
    console.log("Localhost is Running");
})
