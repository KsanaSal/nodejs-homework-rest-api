const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const jimp = require("jimp");
require("dotenv").config();

const { User } = require("../models/user");

const { HttpError, sendEmail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            throw HttpError(409, "Email in use");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const avatarURL = gravatar.url(email);
        const verificationToken = uuidv4();
        const newUser = await User.create({
            ...req.body,
            password: hashPassword,
            avatarURL,
            verificationToken,
        });
        const verifyEmail = {
            to: email,
            subject: "Verify email",
            html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
        };
        await sendEmail(verifyEmail);
        res.status(201).json({
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatarURL,
        });
    } catch (error) {
        next(error);
    }
};

const verify = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });
        if (!user) {
            throw HttpError(404, "User not found");
        }
        await User.findByIdAndUpdate(user._id, {
            verify: true,
            verificationToken: "",
        });
        res.json({
            status: "success",
            code: 200,
            message: "Verification successful",
        });
    } catch (error) {
        next(error);
    }
};

const resendVerifyEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw HttpError(
                400,
                "User not found or missing required field email"
            );
        }
        if (user.verify) {
            throw HttpError(400, "Verification has already been passed");
        }
        const verifyEmail = {
            to: email,
            subject: "Verify email",
            html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
        };
        await sendEmail(verifyEmail);
        res.json({
            status: "success",
            code: 200,
            message: "Verification email sent",
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
        if (!user.verify) {
            throw HttpError(
                401,
                "Your Email has not been verified. Please click on verify email."
            );
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

const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const updateAvatar = async (req, res, next) => {
    const { path: tempUpload, filename } = req.file;
    const newImage = await jimp.read(tempUpload);
    try {
        const { _id } = req.user;
        newImage.resize(250, 250).quality(50).write(tempUpload);
        const newFileName = `${_id}_${filename}`;
        const resultUpload = path.join(avatarsDir, newFileName);
        await fs.rename(tempUpload, resultUpload);

        const avatarURL = path.join("avatars", newFileName);
        await User.findByIdAndUpdate(_id, { avatarURL });

        res.json({ avatarURL });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getCurrent,
    logout,
    subscriptUser,
    updateAvatar,
    verify,
    resendVerifyEmail,
};
