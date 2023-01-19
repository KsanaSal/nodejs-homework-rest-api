const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { User } = require("../models/user");

const { HttpError } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
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
        const payload = {
            id: user._id,
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
        await User.findByIdAndUpdate(user._id, { token });
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
        const { name, email, subscription } = req.user;
        res.json({
            status: "success",
            code: 200,
            data: { user: { name, email, subscription } },
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { token: " " });
        res.status(204).json({
            message: "No Content",
        });
    } catch (error) {
        next(error);
    }
};

const subscriptUser = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { subscription } = req.body;
        const result = await User.findByIdAndUpdate(
            _id,
            { subscription },
            { new: true }
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

module.exports = { register, login, getCurrent, logout, subscriptUser };
