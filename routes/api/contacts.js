const express = require("express");

const router = express.Router();

const { schemas } = require("../../models/contact");
const { validation, isValidId, authUser } = require("../../middlewares");
const controller = require("../../controllers/contacts");

router.get("/", authUser, controller.getAll);

router.get("/:contactId", authUser, isValidId, controller.getById);

router.post(
    "/",
    authUser,
    validation(schemas.joiAddSchema),
    controller.addContact
);

router.delete("/:contactId", authUser, isValidId, controller.removeById);

router.put(
    "/:contactId",
    authUser,
    isValidId,
    validation(schemas.joiAddSchema),
    controller.updateContact
);

router.patch(
    "/:contactId/favorite",
    authUser,
    isValidId,
    validation(schemas.joiUpdateFavoriteSchema),
    controller.updateFavorite
);

module.exports = router;
