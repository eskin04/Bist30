const express = require('express')
const router=require('./routers')
const path=require("path")
const db=require('./db/mysqlconnect')
require('dotenv/config')
const app = express()

//Static files
app.use(express.static(path.join(__dirname,"/public")))

app.get('/hisseler',(req,res)=>{
    res.sendFile(path.join(__dirname,"/public/pages/tables/basic-table.html"))
})

// canliveri.js dosyasını çalıştır
const {hisseler}=require('./canliveri')
hisseler();



//Midllewares
app.use(express.json({limit:'50mb',extended:true,parameterLimit:50000}))
app.use('/api',router)
app.listen(process.env.PORT)