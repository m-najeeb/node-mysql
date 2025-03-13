const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

router.post("/sign-up", userController.signUp);
router.post("/sign-in", userController.signIn);

module.exports = router;
