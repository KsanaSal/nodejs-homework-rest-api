const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { HttpError } = require("../helpers");

const { SECRET_KEY } = process.env;

const authUser = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    try {
        if (bearer !== "Bearer") {
            throw HttpError(401, "Not authorized");
        }
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if (!user) {
            throw HttpError(401, "Not authorized");
        }
        req.user = user;
        next();
    } catch (error) {
        if (error.message === "Invalid signature") {
            error.status = 401;
        }
        throw error;
    }
};

module.exports = authUser;
