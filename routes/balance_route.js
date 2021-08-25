const express= require('express')
const create= require('../controlers/cookers_months/create_stripe_user')
const router = express.Router();
router.route("/").post(create.create_card);

module.exports = router;