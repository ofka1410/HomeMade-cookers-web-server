const express= require('express')
const get_dishes= require('../../controlers/avialable_dish/get_dish')
const changed_avialable = require('../../controlers/avialable_dish/change_available')
const change_all = require('../../controlers/avialable_dish/change_all')
const router = express.Router();
router.route("/:id").get(get_dishes.get_dishes);
router.route("/").put(changed_avialable.change_dishes);
router.route("/").post(change_all.change_all);
module.exports = router;