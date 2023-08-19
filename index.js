
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

const preferences=require('./routes/preferences.js')
const category=require('./routes/category.js')
const users=require('./routes/user.js')




const pool = require("./db")


app.use(fileUpload())
app.use(cors())
app.use(express.static('./media'))

app.use(bodyParser.json());

app.use('/api',aksiya)
app.use('/api',position)
app.use('/api',news)
app.use('/api',compony)

app.use('/api',preferences)
app.use('/api',category)
app.use('/auth',users)





app.listen(5000, () => {
    console.log("Localhost is Running");
})
