const express = require("express");

const router = express.Router();

const { schemas } = require("../../models/contact");
const { validation, isValidId } = require("../../middlewares");
const controller = require("../../controllers/contacts");

router.get("/", controller.getAll);

router.get("/:contactId", isValidId, controller.getById);

router.post("/", validation(schemas.joiAddSchema), controller.addContact);

router.delete("/:contactId", isValidId, controller.removeById);

router.put(
    "/:contactId",
    isValidId,
    validation(schemas.joiAddSchema),
    controller.updateContact
);

router.patch(
    "/:contactId/favorite",
    isValidId,
    validation(schemas.joiUpdateFavoriteSchema),
    controller.updateFavorite
);

module.exports = router;
