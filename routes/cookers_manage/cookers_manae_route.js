const express= require('express')
const add_cooker= require('../../controlers/cookers_edit/add_cooker')
const delete_cooker= require('../../controlers/cookers_edit/delete_cooker')
const edit_cooker = require('../../controlers/cookers_edit/update_cooker')
const router = express.Router();
router.route("/").post(add_cooker.add_cooker);
router.route("/").delete(delete_cooker.delete_cooker);
router.route("/").post(edit_cooker.update_cooker);
module.exports = router;