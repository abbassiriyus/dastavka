
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



const users=require('./routes/user.js')
const homeiy=require('./routes/homeiy.js')
const skachat_pridlachenu=require('./routes/skachat_pridlachenu.js')
const preferences=require('./routes/preferences.js')
const category=require('./routes/category.js')

const marka=require('./routes/marka.js')
const sovuqlik=require('./routes/sovuqlik.js')
const product=require('./routes/product.js')
const tarif=require('./routes/tarif.js')
const mashina=require('./routes/mashina.js')
const shving=require('./routes/shving.js')
const sena=require('./routes/sena.js')
const filial=require('./routes/filial.js')










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

app.use('/auth',users)
app.use('/api',homeiy)
app.use('/api',skachat_pridlachenu)

app.use('/api',category)
app.use('/api',marka)
app.use('/api',sovuqlik)
app.use('/api',product)
app.use('/api',tarif)
app.use('/api',mashina)
app.use('/api',shving)
app.use('/api',sena)
app.use('/api',filial)










app.listen(5000, () => {
    console.log("Localhost is Running");
})
