const express = require("express");

const router = express.Router();

const contactsOperations = require("../../models/contacts");
const { contactSchema } = require("../../schemas/contact");
const { HttpError } = require("../../helpers");
const { validation } = require("../../middlewares");

router.get("/", async (req, res, next) => {
    try {
        const contacts = await contactsOperations.listContacts();
        res.json({ status: "success", code: 200, data: { result: contacts } });
    } catch (error) {
        next(error);
    }
});

router.get("/:contactId", async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await contactsOperations.getContactById(contactId);
        if (!result) {
            throw HttpError(404);
        }
        res.json({
            status: "success",
            code: 200,
            data: { result },
        });
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        validation(contactSchema, req);
        const result = await contactsOperations.addContact(req.body);
        res.status(201).json({
            status: "success",
            code: 201,
            data: { result },
        });
    } catch (error) {
        next(error);
    }
});

router.delete("/:contactId", async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await contactsOperations.removeContact(contactId);
        if (!result) {
            throw HttpError(404);
        }
        res.json({
            status: "success",
            code: 200,
            data: { message: "contact deleted" },
        });
    } catch (error) {
        next(error);
    }
});

router.put("/:contactId", async (req, res, next) => {
    try {
        validation(contactSchema, req);
        const { contactId } = req.params;
        const result = await contactsOperations.updateContact(
            contactId,
            req.body
        );
        if (!result) {
            throw HttpError(404);
        }
        res.json({
            status: "success",
            code: 200,
            data: { result },
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
