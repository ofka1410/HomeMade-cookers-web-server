const express= require('express')
const order= require('../controlers/orders/orders_action')
const get_order = require('../controlers/orders/get_previews_order')
const sent_cooker = require('../controlers/orders/sent_cooker')
const router = express.Router();
router.route("/").post(order.orders);
router.route("/:id").get(get_order.preview_orders);
router.route("/").put(sent_cooker.sent_cooker);
module.exports = router;