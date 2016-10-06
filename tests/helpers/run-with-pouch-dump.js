/* jshint ignore:start */
import createPouchViews from 'hospitalrun/utils/pouch-views';
import Ember from 'ember';
import PouchDB from 'pouchdb';
import DatabaseService from 'hospitalrun/services/database';
import ConfigService from 'hospitalrun/services/config';

function cleanupDatabases(dbs) {
  return wait().then(function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (dbs.main.changesListener) {
        dbs.main.changesListener.cancel();
        dbs.main.changesListener.on('complete', function() {
          destroyDatabases(dbs).then(resolve, reject);
        });
      } else {
        destroyDatabases(dbs).then(resolve, reject);
      }
    });
  });
}

function destroyDatabases(dbs) {
  let destroyQueue = [];
  destroyQueue.push(dbs.config.info().then(function() {
    return dbs.config.destroy();
  }));
  destroyQueue.push(dbs.main.info().then(function() {
    return dbs.main.destroy();
  }));
  return Ember.RSVP.all(destroyQueue);
}

function runWithPouchDumpAsyncHelper(app, dumpName, functionToRun) {

  const db = new PouchDB('hospitalrun-test-database', {
    adapter: 'memory'
  });
  const configDB = new PouchDB('hospitalrun-test-config-database', {
    adapter: 'memory'
  });
  const dump = require(`hospitalrun/tests/fixtures/${dumpName}`).default;
  const promise = db.load(dump);

  const InMemoryDatabaseService = DatabaseService.extend({
    createDB() {
      return promise.then(function() {
        return db;
      });
    }
  });

  const InMemoryConfigService = ConfigService.extend({
    createDB() {
      return Ember.RSVP.resolve(configDB);
    },
    replicateConfigDB() {
      return configDB.get('config_disable_offline_sync').then(function(doc) {
        if (doc.value !== true) {
          doc.value = true;
          return configDB.put(doc);
        }
      }).catch(function() {
        return configDB.put({
          _id: 'config_disable_offline_sync',
          value: true
        });
      });
    }
  });

  app.__deprecatedInstance__.register('service:config', InMemoryConfigService);
  app.__deprecatedInstance__.register('service:database', InMemoryDatabaseService);

  return new Ember.RSVP.Promise(function(resolve) {
    promise.then(function() {
      createPouchViews(db, true, dumpName).then(function() {
        functionToRun();
        andThen(function() {
          cleanupDatabases({
            config: configDB,
            main: db
          }).then(resolve, function(err) {
            console.log('error cleaning up dbs:', JSON.stringify(err, null, 2));
          });
        });
      });
    }, function(err) {
      console.log('error loading db', JSON.stringify(err, null, 2));
    });
  });
}

Ember.Test.registerAsyncHelper('runWithPouchDump', runWithPouchDumpAsyncHelper);
/* jshint ignore:end */
