const express= require('express')
const order= require('../controlers/orders/orders_action')
const get_order = require('../controlers/orders/get_previews_order')
const router = express.Router();
router.route("/").post(order.orders);
router.route("/:id").get(get_order.preview_orders);

module.exports = router;