const express = require("express");

const router = express.Router();

// const contactsOperations = require("../../models/contact");
const { schemas } = require("../../models/contact");
// const { HttpError } = require("../../helpers");
const { validation } = require("../../middlewares");
const controller = require("../../controllers/contacts");

router.get("/", controller.getAll);

router.get("/:contactId", controller.getById);

router.post("/", validation(schemas.joiAddSchema), controller.addContact);

router.delete("/:contactId", controller.removeById);

router.put(
    "/:contactId",
    validation(schemas.joiAddSchema),
    controller.updateContact
);

router.patch(
    "/:contactId/favorite",
    validation(schemas.joiUpdateFavoriteSchema),
    controller.updateFavorite
);

module.exports = router;
