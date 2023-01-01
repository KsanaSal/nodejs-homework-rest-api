const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

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

const addContact = async (body) => {
    console.log(body);
    const contacts = await listContacts();
    body.id = uuidv4();
    // const newContact = {
    //     id: uuidv4(),
    //     name,
    //     email,
    //     phone,
    // };
    contacts.push(body);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return body;
};

const updateContact = async (contactId, body) => {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === contactId);
    if (index === -1) {
        return null;
    }
    contacts[index] = { contactId, ...body };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
};

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};
