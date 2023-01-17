const express = require("express");

const controller = require("../../controllers/users");
const { validation } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();

router.get("/", controller.getAll);
router.post(
    "/register",
    validation(schemas.joiRegisterSchema),
    controller.register
);

module.exports = router;
