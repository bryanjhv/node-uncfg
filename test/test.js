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
      const store = config();

      assert.equal(store.port, 3000);
      assert.equal(store.hello.world, 'Hello world!');
    });

    it('env-specific settings', () => {
      const {PORT, NODE_ENV} = process.env;
      process.env.PORT = 8080;
      process.env.NODE_ENV = 'production';

      config.load(confDir);
      const store = config();

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

  describe('have a helper to', () => {

    it('get a single key', () => {
      assert.strictEqual(config('port'), 3000);
    });

    it('set a single key', () => {
      config('nothing', 'special');
      assert.equal(config('nothing'), 'special');
    });

    it('get a dotted key', () => {
      assert.equal(config('hello.world'), 'Hello world!');
    });

    it('set a dotted key', () => {
      config('max.count', 100);
      assert.strictEqual(config('max.count'), 100);
    });

    it('get copy of store', () => {
      const copy = config();
      assert.equal(typeof copy, 'object');

      copy.port = 5000;
      assert.notStrictEqual(config('port'), 5000);

      copy.hello.nothing = true;
      assert.strictEqual(config('hello.nothing'), null);
    });

  });

});
