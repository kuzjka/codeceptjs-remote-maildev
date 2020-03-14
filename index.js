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
    console.log("Requested mailbox: " + req.body.address);
    addresses.push(req.body.address);
    res.send("OK");
});

app.get('/grabNextUnreadEmail', (req, res) => {
    if (read >= emails.length) res.json({empty: true});
    else res.json({empty: false, email: emails[read++]});
    console.debug('Email grabbed');
});

app.post('/reset', (req, res) => {
    if (maildev) {
        maildev.close((err) => {
            if (err) {
                console.error('Can\'t stop MailDev ' + err);
                res.status(500);
                res.send('Can\'t stop maildev');
            } else {
                console.debug('Maildev stopped');
                res.send("OK");
            }
        });
        maildev = null;
    } else {
        res.send("Maildev not running");
    }
    emails = [];
    read = 0;
    addresses = [];
    console.log("State reset");
});

app.listen(webPort, () => {
    console.log("Maildev will listen for SMTP on port " + smtpPort + ", HTTP commands on " + webPort);
});

function _startMaildev() {
    maildev = new MailDev({
        smtp: smtpPort,
        ip: '0.0.0.0',
        disableWeb: true
    });

    maildev.listen((err) => {
        if (err) console.error("Maildev cannot listen on " + smtpPort + ": " + err);
        else console.debug("Maildev is listening on " + smtpPort);
    });

    maildev.on('new', (email) => {
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
