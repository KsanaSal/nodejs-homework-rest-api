const sendGridMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;

sendGridMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const email = { ...data, from: "ksanasal@ukr.net" };
        await sendGridMail.send(email);
        return true;
    } catch (error) {
        throw error;
    }
};

module.exports = sendEmail;
