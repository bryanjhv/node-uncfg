const path   = require('path'),
      config = require('..'),
      assert = require('assert');

const confDir = path.join(__dirname, 'config');


describe('UnCfg should', () => {

  // Make sure things are "reloaded"
  beforeEach(() => config.load(confDir));

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

  describe('allow to get config', () => {

    it('with single key', () => {
      assert.strictEqual(config.get('port'), 3000);
      assert.deepEqual(config.get('hello'), {world: 'Hello world!'});
    });

    it('with dotted key', () => {
      assert.equal(config.get('hello.world'), 'Hello world!');
    });

    it('always with a key', () => {
      assert.throws(() => config.get());
    });

    it('only if exists', () => {
      assert.strictEqual(config.get('nothing'), null);
      assert.strictEqual(config.get('hello.dear.world'), null);
    });

    it('only with own keys', () => {
      assert.strictEqual(config.get('port.toString'), null);
    });

    it('with a default value', () => {
      assert.strictEqual(config.get('count', 100), 100);
      assert.equal(config.get('db.host', 'localhost'), 'localhost');
    });

  });

  describe('allow to set config', () => {

    it('with single key', () => {
      config.set('count', 1);
      assert.strictEqual(config.get('count'), 1);
    });

    it('with dotted key', () => {
      config.set('db.host', 'localhost');
      assert.equal(config.get('db.host'), 'localhost');
    });

    it('always with a key', () => {
      config.set('nothing');
      assert.strictEqual(config.get('nothing'), null);
    });

  });

});
