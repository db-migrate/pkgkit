var resolve = require( 'resolve' );
var dbm;

try {
  try {

    dbm = require(
      resolve.sync('db-migrate', { basedir: process.cwd() })
    );
  }
  catch(e1) {

    try {

      dbm = require('db-migrate');
    }
    catch (e2) {

      dbm = require('../../db-migrate');
    }
  }
}
catch (e3) {
  console.error('db-migrate must be installed to use this kit!\n' +
    'npm install db-migrate\n' +
    'npm install -g db-migrate\n');
  process.exit(1);
}

module.exports = dbm;
