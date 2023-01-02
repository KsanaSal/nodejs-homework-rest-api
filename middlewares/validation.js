const validation = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const err = new Error(
                error.message || "missing required name field"
            );
            err.status = 400;
            throw err;
        }
        next();
    };
};

module.exports = validation;
