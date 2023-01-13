const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const phoneRegexp = /^\([0-9]{3}\)\s{1}[0-9]{3}-[0-9]{4}$/;

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Set name for contact"],
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            validate: {
                validator: function (v) {
                    return phoneRegexp.test(v);
                },
                message: (props) =>
                    `${props.value} is not a valid phone number! Phone number must be next format (123) 111-1111`,
            },
            required: [true, "User phone number required"],
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

const joiAddSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
        .pattern(phoneRegexp)
        .message("Phone number must be next format (123) 111-1111")
        .required(),
    favorite: Joi.boolean(),
});

const joiUpdateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const schemas = { joiAddSchema, joiUpdateFavoriteSchema };

module.exports = { Contact, schemas };
