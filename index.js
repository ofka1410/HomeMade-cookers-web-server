const PORT = process.env.PORT || 7000
const express= require('express')
const app=express()
var cors = require('cors')
app.use(cors())
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//all routes requiers
const orders_route = require('./routes/orders_route')
const manage_meal_route = require('./routes/meals_manage/meals_edit_route')
const manage_cooker_route = require ('./routes/cookers_manage/cookers_manae_route')
const cooker_report = require('./routes/cookers_report_route')
const dishes_route = require('./routes/cookers_manage/Meals_route')
const pamynet_route = require('./routes/payment_route')
//middlewares
app.use('/orders',orders_route)
app.use('/meals-admin',manage_meal_route)
app.use('/cookers-admin',manage_cooker_route)
app.use('/report',cooker_report)
app.use('/dishes',dishes_route)
app.use('/payments',pamynet_route)

app.listen(PORT,()=>{
    console.log('listening on port: ' + PORT);
  })