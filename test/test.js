const path   = require('path'),
      config = require('..'),
      assert = require('assert');

const confDir = path.join(__dirname, 'config');


describe('UnCfg should', () => {

  describe('load config from', () => {

    it('general settings', () => {
      config.load(confDir);
      let store = config.store;

      assert.equal(store.port, 3000);
      assert.equal(store.hello.world, 'Hello world!');
    });

    it('env-specific settings', () => {
      let {PORT, NODE_ENV} = process.env;
      process.env.PORT = 8080;
      process.env.NODE_ENV = 'production';

      config.load(confDir);
      let store = config.store;

      assert.equal(store.port, 8080);
      assert.equal(store.hello.world, 'Hello world!');

      process.env.PORT = PORT;
      process.env.NODE_ENV = NODE_ENV;
    });

  });

});
