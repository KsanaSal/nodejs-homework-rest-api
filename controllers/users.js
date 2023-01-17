const { User } = require("../models/user");

const { HttpError } = require("../helpers");

const getAll = async (req, res, next) => {
    console.log("123");
};

const register = async (req, res, next) => {
    console.log("first");
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw HttpError(409, "Email in use");
        }
        const newUser = await User.create(req.body);
        res.status(201).json({
            name: newUser.name,
            email: newUser.email,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, getAll };
