const Joi = require("joi");

const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
        .pattern(/^\([0-9]{3}\)\s{1}[0-9]{3}-[0-9]{4}$/)
        .message("Phone number must be next format (123) 111-1111")
        .required(),
});

module.exports = { contactSchema };
