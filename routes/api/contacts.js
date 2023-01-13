const express = require("express");

const router = express.Router();

// const contactsOperations = require("../../models/contact");
const { joiSchema } = require("../../models/contact");
// const { HttpError } = require("../../helpers");
const { validation } = require("../../middlewares");
const controller = require("../../controllers/contacts");

router.get("/", controller.getAll);

router.get("/:contactId", controller.getById);

router.post("/", validation(joiSchema), controller.addContact);

router.delete("/:contactId", controller.removeById);

router.put("/:contactId", validation(joiSchema), controller.updateContact);

module.exports = router;
