const express= require('express')
const get_dishes= require('../../controlers/get_dishes/get_dishes')
const router = express.Router();
router.route("/:id").get(get_dishes.get_dishes);

module.exports = router;