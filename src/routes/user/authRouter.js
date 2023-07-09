const express = require("express");
const router = express.Router();
const authController = require("./authController");
const { MiddleWare } = require("../../lib/middleware");
const Role = require("../../lib/roles_list")


router.post(
  "/register" , 
[MiddleWare.emptyCheck,MiddleWare.mailCheck,MiddleWare.passwordCheck,MiddleWare.confirmPassCheck],
  authController.registerUser
);

router.get(
  "/verify", 
  authController.verifyUser
);

router.post(
  "/auth",
  [MiddleWare.emptyCheck, MiddleWare.mailCheck],
  authController.loginUser
);


router.post(
  "/forget-password",
  [MiddleWare.emptyCheck, MiddleWare.mailCheck],
  authController.forgetPassword
);


router.get(
  "/reset-password",
  authController.resetPassPage
); 

router.post(
  "/reset-password",
  [ MiddleWare.emptyCheck, MiddleWare.passwordCheck,MiddleWare.confirmPassCheck],
  authController.resetPass
); 



router.put(
  "/edit-profile",
  [MiddleWare.checkToken , MiddleWare.verifyRoles(Role.ADMIN,Role.SUPERADMIN)],
  authController.editProfile
);

router.get(
  "/change-role" ,
  [ MiddleWare.checkToken ] ,
  authController.changeRoles
);

router.post(
  "/getInfo",
  [MiddleWare.checkToken],
  authController.recognizeRole
);

router.post(
  "/emailList",
  authController.getEmails
)

router.post("/google-signup",authController.googleVerify)  ;


module.exports = router;
