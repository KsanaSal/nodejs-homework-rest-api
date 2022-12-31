const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
    const result = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(result);
};

const getContactById = async (id) => {
    const contactId = String(id);
    const contacts = await listContacts();
    return contacts.filter((el) => el.id === contactId)[0] || null;
};

const removeContact = async (contactId) => {};

const addContact = async (body) => {};

const updateContact = async (contactId, body) => {};

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};
