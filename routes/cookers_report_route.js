const express= require('express')
const report= require('../controlers/cookers_months/cookers_report')
const every_month_report = require('../controlers/cookers_months/get_every_month_report')
const router = express.Router();
router.route("/").post(report.report);
router.route("/:id").get(every_month_report.every_month);
module.exports = router;