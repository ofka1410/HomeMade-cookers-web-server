const express= require('express')
const report= require('../controlers/cookers_months/cookers_report')
const router = express.Router();
router.route("/").post(report.report);
module.exports = router;