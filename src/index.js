const express= require("express");
const connect = require("./configs/db.js");
const app = express();
const Imap = require("imap");
const {simpleParser} = require("mailparser");

app.use(express.json());

app.listen(2356, async function (){
    await connect();
    console.log("listening on port 2356");
});

const imapConfigs = {
    user: "d@d.com",
    password: "passw123",
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
  };

  const fetchEmails = () => {
      const imap = new Imap(imapConfigs);
      imap.once('ready', () => {
      imap.openBox('INBOX', false, () => {
      imap.search(['UNSEEN', ['SINCE', new Date()]], (err, results) => {
      const f = imap.fetch(results, {bodies: ''});
      f.on('message', msg => {
      msg.on('body', stream => {
      simpleParser(stream, async (err, parsed) => {
                console.log(parsed);
              });
             });
      msg.once('attributes', attrs => {
      const {uid} = attrs;
      imap.addFlags(uid, ['\\Seen'], () => {
      console.log('Marked as read!');
      });
      });
      });
      f.once('error', ex => {
      return Promise.reject(ex);
      });
      f.once('end', () => {
      console.log('Done fetching all messages!');
      imap.end();
      });
      });
      });
      });
  }

  fetchEmails();
