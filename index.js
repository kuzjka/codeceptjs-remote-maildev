const MailDev = require('maildev');
const express = require('express');
const app = express();
const smtpPort = process.env.SMTP_PORT || 25;
const webPort = process.env.WEB_PORT || 8080;

var maildev = null;
var emails = [];
var read = 0;
var addresses = [];

app.use(express.json());

app.post('/haveMailbox', (req, res) => {
    if (!maildev) {
        _startMaildev();
    }
    console.log(req.body);
    // this.address.push(req.body);
    res.send("OK");
});

app.get('/grabNextUnreadEmail', (req, res) => {
    if (read >= emails.length) res.json({empty: true});
    else res.json({empty: false, email: emails[read++]});
});

app.post('/reset', () => {
    if (maildev) {
        maildev.close((err) => {
            if (err) {
                console.error('Can\'t stop MailDev ' + err);
            } else {
                console.debug('Maildev stopped');
            }
        });
        maildev = null;
        emails = [];
        read = 0;
        addresses = [];
    }
});

app.listen(webPort, () => {
    console.log("Maildev will listen for SMTP on port " + smtpPort + ", HTTP commands on " + webPort);
});

function _startMaildev() {
    maildev = new MailDev({
        smtp: smtpPort,
        ip: '127.0.0.1',
        disableWeb: true
    });

    maildev.listen((err) => {
        if (err) console.error("Maildev cannot listen on " + port + ": " + err);
        else console.debug("Maildev is listening on " + port);
    });

    this.maildev.on('new', (email) => {
        console.debug('Recipients: ' + email.to.map(t => t.address).join(', '));
        if (_checkAddress(email)) {
            console.log('Got new email: ' + email.subject);
            emails.push(email);
        }
    });
}

function _checkAddress(email) {
    for (var i = 0; i < addresses.length; i++) {
        for (var j = 0; j < email.to.length; j++) {
            if (addresses[i] === email.to[j].address) {
                return true;
            }
        }
    }
    return false;
}