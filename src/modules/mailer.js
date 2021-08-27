const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

/* transport.use("compile", hbs({
  viewEngine: {
    extname: '.hbs', 
    layoutsDir: path.resolve("./src/resources/mail"), 
    defaultLayout: false,
  },
  viewPath: path.resolve("./src/resources/mail"),
  extName: '.hbs',
}))
 */
transport.use('compile', hbs({
  viewEngine: {
    defaultLayout: undefined,
    partialsDir: path.resolve('./src/resources/mail/')
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.hbs',
}));

module.exports = transport;