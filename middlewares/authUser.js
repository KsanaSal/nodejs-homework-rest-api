const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { HttpError } = require("../helpers");

const { SECRET_KEY } = process.env;

const authUser = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    try {
        if (bearer !== "Bearer") {
            console.log("45698");
            throw HttpError(401, "Not authorized");
        }
        const { id } = jwt.verify(token, SECRET_KEY);
        console.log(id);
        const user = await User.findById(id);
        if (!user || !user.token || token !== String(user.token)) {
            console.log("first");
            throw HttpError(401, "Not authorized");
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("123");
        if (error.message === "Invalid signature") {
            error.status = 401;
        }
        next(error);
        // throw HttpError(401, "Not authorized");
    }
};

module.exports = authUser;
