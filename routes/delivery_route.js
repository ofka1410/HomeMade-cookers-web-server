const express= require('express')
const delivery= require('../controlers/orders/orders_after_send/deliveries_create')
const router = express.Router();
router.route("/").post(delivery.delivery);
module.exports = router;