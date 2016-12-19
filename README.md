# UnCfg

Just another configuration helper for Node.js.


## Features

* Very simple, no tweaking. Give it your `config` folder and start working!
* Supports env-specific settings. Make a folder with the env name, set your
  `NODE_ENV` variable and ready to go!
* Supports *calculated* config, each config it's a normal `.js` file. Read
  `process.env` or do Math, you just have to give a value.


## Usage

First, add the dependency to your `package.json`:

```sh
npm install --save uncfg
```

Then, `require()` it in your app, and make use of it:

```js
// Require the package
const path   = require('path'), // miscellaneous
      config = require('uncfg');

// Load configuration from `config` directory
config.load(path.join(__dirname, 'config'));

// Read value (both are valid)
let port = config('port');
let port = config.get('port');

// Read nested value (both are valid)
let host = config('database.host');
let host = config.get('database.host');

// Read value with default (only with `.get`)
let sample = config.get('a.b.c', 'its okay :D');

// Save value (both are valid)
config('hello', 'world');
config.set('hello', 'world');

// Get copy of store
let cfg = config();
console.log(cfg.hello); // world
console.log(cfg.port); // 3000
console.log(cfg.database.host); // localhost
```

The code above assumes your app is structured like this:

```text
my-awesome-app
+-- app.js
+-- package.json
+-- config
|   +-- port.js
|   +-- database.js
|   +-- production
|   |   +-- database.js
+-- node_modules
```

If you need more guidance, feel free to check the [tests](test), specifically in
the [config](test/config) test folder.

### Specific example

So you need even more examples? Ok, let's do it!

```js
// config/database.js
module.exports = {
  hostname: 'localhost',
  database: 'ohmydear',
  username: 'notroot',
  password: 123456789
};

// config/production/database.js
module.exports = {
  url: 'mongodb://me:pwd@server.org/test'
};

// app.js
const path   = require('path'),
      config = require('uncfg');

config.load(path.join(__dirname, 'config'));

let dbCfg = config('database');
console.log(dbCfg); // { hostname: 'localhost',
                    //   database: 'ohmydear',
                    //   username: 'notroot',
                    //   password: 123456789,
                    //   url: 'mongodb://me:pwd@server.org/test' }
                    // *NOTE*: `url` is available if `NODE_ENV=production`.

let host = config('database.hostname');
let user = config('database.username');
```


## License

This project is released under the [MIT license](LICENSE.txt).
