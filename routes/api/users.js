const express = require("express");

const router = express.Router();

const controller = require("../../controllers/users");
const { validation, isValidId } = require("../../middlewares");

module.exports = router;
