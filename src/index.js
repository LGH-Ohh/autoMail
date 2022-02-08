const getMailContent = require("./getMailContent");
const sendMail = require("./sendMail");
async function main() {
  const mailContent = await getMailContent();
  sendMail(mailContent);
}
main();
