const express= require('express')
const login= require('../../controlers/login')

const router = express.Router();
router.route("/").post( login.login);

module.exports = router;