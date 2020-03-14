# codeceptjs-remote-maildev
Maildev instance for [CodeceptJS remote Maildev helper](https://github.com/kuzjka/codeceptjs-remote-maildev-helper)
Runs a [MailDev](https://maildev.github.io/maildev/) instance and exposes simple REST API for E2E testing applications with email functions.
See [Helper documentation](https://github.com/kuzjka/codeceptjs-remote-maildev-helper/blob/master/README.md) for details.

The server is designed for testing with single client only. 

## Usage
Install dependiencies:
```shell script
npm install
```

then

```shell script
npm run serve
```

or

```shell script
node index.js
```

Default REST API and SMTP ports are 8080 and 25 and can be overriden with environment variables:
`WEB_PORT` and `SMTP_PORT`. 

## Docker

You can use [kuzjka/codeceptjs-remote-maildev](https://hub.docker.com/r/kuzjka/codeceptjs-remote-maildev) docker image.
It exposes REST interface on 8080 port and listens for SMTP on 25 by default.

## REST API

The API is designed solely for helper purposes

#### POST /haveMailbox  
**request:**
```json
{ "address": "abc@example.com" }
```
**response:** 200 `OK`

#### GET /grabNextUnreadMail
**response:**
```json
{ "empty": "true" }
```
```json
{ "empty": "false", "mail": [MailObject] }
```

#### POST /reset
**request:** empty

**response:**
200 `OK` or 200 `Maildev not running`

## References
Powered by [MailDev](https://maildev.github.io/maildev/)

## License
[MIT](LICENSE)
