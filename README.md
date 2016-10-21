rm-assessment
===

Microservice to minify and send HTML emails.

#### Objectives
* Implement at least 3 HTML/CSS strategies "by hand"
* Simple HTTP server to handle post requests
* Save processed emails with the input and output HTML to a database

#### API Methods

* /

  **GET**

  Request
  ```http
GET  HTTP/1.1
Host: localhost:3434
Accept: application/json
```
  Response
  ```json
{
  "status": "success",
  "message": "Hello World!"
}
```

  **POST**

  Request
  ```http
  POST  HTTP/1.1
  Host: localhost:3434
  Content-Type: application/json

  {
  	"to": "teacher@some.domain",
  	"from": "pink@some.domain",
  	"subject": "HEY, teacher!",
  	"html": "<!doctype html><html><head><title>HEY, teacher!</title><style>.words {font-weight: 900;}</style></head><body><p class=\"words\">Leave them kids alone!</p></body></html>"
  }
```
  Response
  ```json
{
  "status": "success",
  "message": "Mail sent successfully."
}
```

Setup and Running
---

#### Global Dependencies

```
npm i -g gulp-cli # Build tool
npm i -g jshint # Javascript linting
npm i -g mocha # Testing framework
npm i -g knex # Database migration tool
# You also need a database adaptor for Bookshelf.js
npm i -g sqlite3 # Test database
```

#### Getting Started

1. Configuration

  Modify `./config.js` to export a config object to your liking. Customize by environment, utilize environment variables, etc.

  The default configuration uses sqlite3 and a mock nodemailer transport.

2. Setup your database

  If your database is properly configured running `knex migrate:latest` should bring your database up to a usable state. You can read more about knex migrations [here](http://knexjs.org/#Migrations).

3. Start the server or start gulp for development

  * Start the server: `npm start` or `node app.js`

    ```bash
$ npm start
Listening on port 3434
```

  * Start gulp: `npm run dev` or `gulp`.

```bash
$ npm dev
[12:54 PM] selby@cecilia:> gulp
[12:54:41] Using gulpfile ~/projects/rebelmail/gulpfile.js
[12:54:41] Starting 'lint'...
[12:54:41] Starting 'watch'...
[12:54:41] Finished 'watch' after 13 ms
[12:54:42] Finished 'lint' after 214 ms
[12:54:42] Starting 'test'...
Knex:warning - sqlite does not support inserting default values. Set the `useNullAsDefault` flag to hide this warning. (see docs http://knexjs.org/#Builder-insert).


  db
    ✓ can create mail (64ms)

  mailer
    ✓ can send mail

  minifier
    ✓ works
    ✓ combines style tags and places them in <head>
    ✓ combines style tags and places them in <head>
    ✓ optimize ids and class names
    ✓ remove unused classes
    ✓ strategy useShortHex that replaces HEX with its shorthand (#FFFFFF => #FFF)

  server
    GET /
      ✓ says hello
    POST /
      ✓ sends email with optimized HTML to recipient (54ms)


  10 passing (167ms)

[12:54:42] Finished 'test' after 484 ms
[12:54:42] Starting 'default'...
[12:54:42] Finished 'default' after 4.67 μs
```
