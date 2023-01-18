const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { User } = require("../models/user");

const { HttpError } = require("../helpers");

const { SECRET_KEY } = process.env;

// const getAll = async (req, res, next) => {
//     console.log("123");
// };

const register = async (req, res, next) => {
    console.log("first");
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw HttpError(409, "Email in use");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            ...req.body,
            password: hashPassword,
        });
        res.status(201).json({
            name: newUser.name,
            email: newUser.email,
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!user || !passwordCompare) {
            throw HttpError(401, "Email or password is wrong");
        }
        // if (!user) {
        //     throw HttpError(401, "Email or password is wrong");
        // }
        // const passwordCompare = await bcrypt.compare(password, user.password);
        // if (!passwordCompare) {
        //     throw HttpError(401, "Email or password is wrong");
        // }
        const payload = {
            id: user._id,
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
        res.status(201).json({
            token,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        next(error);
    }
};

const getCurrent = async (req, res, next) => {
    try {
        const { name, email } = req.user;
        res.json({
            status: "success",
            code: 200,
            data: { user: { name, email } },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getCurrent };
