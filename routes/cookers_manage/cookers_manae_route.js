const express= require('express')
const edit_cooker = require('../../controlers/cookers_edit/update_cooker')
const get_cooker = require('../../controlers/cookers_edit/get_cooker_details')
const change_ringtone = require('../../controlers/cookers_edit/cookers__ringtone')
const router = express.Router();
router.route("/").put(edit_cooker.update_cooker);
router.route("/:id").get(get_cooker.get_cooker_details);
router.route("/").post(change_ringtone.ringtones);
module.exports = router;