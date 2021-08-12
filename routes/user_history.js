const express= require('express')
const user_history= require('../controlers/orders/orders_after_send/user_history')
const router = express.Router();
router.route("/").post(user_history.user_history);
module.exports = router;