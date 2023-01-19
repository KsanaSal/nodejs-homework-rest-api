const express = require("express");

const controller = require("../../controllers/users");
const { validation, authUser } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();

router.post(
    "/register",
    validation(schemas.joiRegisterSchema),
    controller.register
);

router.post("/login", validation(schemas.joiLoginSchema), controller.login);

router.get("/current", authUser, controller.getCurrent);

module.exports = router;
