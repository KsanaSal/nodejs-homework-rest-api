const { Contact } = require("../models/contact");

const { HttpError } = require("../helpers");

const getAll = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { page = 1, limit = 10, favorite } = req.query;
        const skip = (page - 1) * limit;
        const searchCriterion = favorite
            ? { owner: _id, favorite }
            : { owner: _id };
        const contacts = await Contact.find(searchCriterion, "", {
            skip,
            limit: Number(limit),
        }).populate("owner", "name email");
        res.json({ status: "success", code: 200, data: { result: contacts } });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await Contact.findById(contactId);
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
        const { _id: owner } = req.user;
        const result = await Contact.create({ ...req.body, owner });
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
