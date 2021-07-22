const express= require('express')
const all_review = require('../../controlers/reviewes/get_reviews')
const router = express.Router();
router.route("/:id").get(all_review.all_reviews);
module.exports = router;