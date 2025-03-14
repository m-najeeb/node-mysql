const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

router.post("/sign-up", userController.signUp);
router.post("/sign-in", userController.signIn);
router.post("/profile-edit", userController.profileEdit);
router.post("/change-password", userController.changePassword);
router.post("/delete-user", userController.deleteUser);

module.exports = router;
