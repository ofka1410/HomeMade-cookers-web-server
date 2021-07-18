const express= require('express')
const add_cooker= require('../../controlers/cookers_edit/add_cooker')
const delete_cooker= require('../../controlers/cookers_edit/delete_cooker')
const edit_cooker = require('../../controlers/cookers_edit/update_cooker')
const get_cooker = require('../../controlers/cookers_edit/get_cooker_details')
const router = express.Router();
router.route("/").post(add_cooker.add_cooker);
router.route("/").delete(delete_cooker.delete_cooker);
router.route("/").put(edit_cooker.update_cooker);
router.route("/:id").get(get_cooker.get_cooker_details);
module.exports = router;