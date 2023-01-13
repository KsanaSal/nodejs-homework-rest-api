const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");
// console.log(handleMongooseError);

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

// const fs = require("fs/promises");
// const path = require("path");
// const { v4: uuidv4 } = require("uuid");

// const contactsPath = path.join(__dirname, "contacts.json");

// const listContacts = async () => {
//     const result = await fs.readFile(contactsPath, "utf-8");
//     return JSON.parse(result);
// };

// const getContactById = async (id) => {
//     const contactId = String(id);
//     const contacts = await listContacts();
//     return contacts.filter((el) => el.id === contactId)[0] || null;
// };

// const removeContact = async (id) => {
//     const contactId = String(id);
//     const contacts = await listContacts();
//     const index = contacts.findIndex((el) => el.id === contactId);
//     if (index === -1) {
//         return null;
//     }
//     const [result] = contacts.splice(index, 1);
//     await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//     return result;
// };

// const addContact = async (body) => {
//     console.log(body);
//     const contacts = await listContacts();
//     body.id = uuidv4();
//     contacts.push(body);
//     await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//     return body;
// };

// const updateContact = async (id, body) => {
//     const contacts = await listContacts();
//     const index = contacts.findIndex((item) => item.id === id);
//     if (index === -1) {
//         return null;
//     }
//     contacts[index] = { ...contacts[index], ...body };
//     await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//     return contacts[index];
// };

// module.exports = {
//     listContacts,
//     getContactById,
//     removeContact,
//     addContact,
//     updateContact,
// };
