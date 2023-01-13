const { Contact } = require("../models/contact");

// const contactsOperations = require("../models/contact");
const { HttpError } = require("../helpers");

const getAll = async (req, res, next) => {
    try {
        const contacts = await Contact.find();
        res.json({ status: "success", code: 200, data: { result: contacts } });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        // const result = await contactsOperations.getContactById(contactId);
        // if (!result) {
        //     throw HttpError(404);
        // }
        // res.json({
        //     status: "success",
        //     code: 200,
        //     data: { result },
        // });
    } catch (error) {
        next(error);
    }
};

const addContact = async (req, res, next) => {
    try {
        // const result = await contactsOperations.addContact(req.body);
        // res.status(201).json({
        //     status: "success",
        //     code: 201,
        //     data: { result },
        // });
    } catch (error) {
        next(error);
    }
};

const removeById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        // const result = await contactsOperations.removeContact(contactId);
        // if (!result) {
        //     throw HttpError(404);
        // }
        // res.json({
        //     status: "success",
        //     code: 200,
        //     data: { message: "contact deleted" },
        // });
    } catch (error) {
        next(error);
    }
};

const updateContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        // const result = await contactsOperations.updateContact(
        //     contactId,
        //     req.body
        // );
        // if (!result) {
        //     throw HttpError(404);
        // }
        // res.json({
        //     status: "success",
        //     code: 200,
        //     data: { result },
        // });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, addContact, removeById, updateContact };
