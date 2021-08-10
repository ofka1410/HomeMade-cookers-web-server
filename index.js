const PORT = process.env.PORT || 7000
const express= require('express')
const app=express()
var cors = require('cors')
const db = require('./db/conection')

app.use(cors())
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static('public/build'))
app.get('/',(req,res)=>{
res.sendFile(path.join(__dirname,"public/build","index.html"))
})

//all routes requiers
const orders_route = require('./routes/orders_route')

const manage_cooker_route = require ('./routes/cookers_manage/cookers_manae_route')
const cooker_report = require('./routes/cookers_report_route')

const pamynet_route = require('./routes/payment_route')
const review = require('./routes/reviews/reviewRoute')
const deliveries = require('./routes/delivery_route')
const changes_delete = require('./routes/develop_changes')
const balance = require('./routes/balance_route')
const dishes= require('./routes/meals_manage/meals_route')
//middlewares
app.use('/orders',orders_route)
app.use('/cookers-admin',manage_cooker_route)
app.use('/report',cooker_report)
app.use('/payments',pamynet_route)
app.use('/reviews',review)
app.use('/orders/ready',changes_delete)
app.use('/orders/delivery',deliveries)
app.use('/balance',balance)

app.use('/dishes',dishes)


const sms= require('./sms')
db.collection("orders").where("cooker_sent", "==", false)
    .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.data())
            if(doc.data()){
             data={...doc.data(),id:doc.id}
             sms.sms(data)
            console.log('new order, check with rom that message has been recived')
            }
        });
    });

app.listen(PORT,()=>{
    console.log('listening on port: ' + PORT);
  })