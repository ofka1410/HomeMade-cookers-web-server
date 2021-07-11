const express= require('express')
const add_meal= require('../../controlers/meals_edit/add_meal')
const delete_meal= require('../../controlers/meals_edit/delete_meal')
const edit_meal = require('../../controlers/meals_edit/edit_meal')
const router = express.Router();
router.route("/").post(add_meal.add_meal);
router.route("/").delete(delete_meal.delete_meal);
router.route("/").post(edit_meal.update_meal);
module.exports = router;