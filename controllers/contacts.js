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
        console.log("first");
        const { contactId } = req.params;
        console.log(contactId);
        const result = await Contact.findById(contactId);
        console.log(result);
        if (!result) {
            console.log("123");
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
};

const addContact = async (req, res, next) => {
    try {
        const result = await Contact.create(req.body);
        res.status(201).json({
            status: "success",
            code: 201,
            data: { result },
        });
    } catch (error) {
        next(error);
    }
};

const removeById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await Contact.findByIdAndRemove(contactId);
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
};

const updateContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await Contact.findByIdAndUpdate(contactId, req.body, {
            new: true,
        });
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
};

const updateFavorite = async (req, res, next) => {
    console.log("first");
    try {
        const { contactId } = req.params;
        const { favorite } = req.body;
        const result = await Contact.findByIdAndUpdate(
            contactId,
            { favorite },
            {
                new: true,
            }
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
};

module.exports = {
    getAll,
    getById,
    addContact,
    removeById,
    updateContact,
    updateFavorite,
};
