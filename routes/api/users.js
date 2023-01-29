const express = require("express");

const controller = require("../../controllers/users");
const { validation, authUser, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();

router.post(
    "/register",
    validation(schemas.joiRegisterSchema),
    controller.register
);

router.post("/login", validation(schemas.joiLoginSchema), controller.login);

router.get("/current", authUser, controller.getCurrent);

router.get("/logout", authUser, controller.logout);

router.patch(
    "/subscription",
    authUser,
    validation(schemas.joiSubscriptionSchema),
    controller.subscriptUser
);

router.patch(
    "/avatars",
    authUser,
    upload.single("avatar"),
    controller.updateAvatar
);

module.exports = router;
