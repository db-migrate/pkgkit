#!/usr/bin/env node

var program = require('commander');
var path = require('path');

program
  .arguments('<cmd>')
  .description('Command to be passed.')
  .option(
    '-m, --memory',
    'Use SQLite in Memory default config.'
  )
  .action(exec);

program.parse(process.argv);

function loadThisAsPlugin() {

  var hooks = {};

  var plugin = require(process.cwd());

  if(typeof(plugin.name) !== 'string' || !plugin.hooks || !plugin.loadPlugin)
    return false;

  plugin.hooks.map(function(hook) {

    hooks[hook] = hooks[hook] || [];
    hooks[hook].push(plugin);
  });

  return hooks;
}

function exec(cmd, options) {

  var DBMigrate = require('./dbmigrate.js');
  var pkg = require(path.join(process.cwd(), 'package.json'));
  var isPlugin = false;
  var opts = {};

  if(pkg.name.startsWith('db-migrate-plugin-')) {

    isPlugin = true;
    opts.plugins = loadThisAsPlugin();
    if(!opts.plugins)
    throw new Error('Could not load current project as plugin!');
  }

  if((options.memory && !options.config) || (!options.config && isPlugin)) {

    opts.config = {
      dev: {
        driver: 'sqlite3',
        filename: ':memory:'
      }
    };
  }

  process.argv = [ process.argv[0], process.argv[1] ].concat(cmd.split(' '));
  opts.cwd = process.cwd();

  var dbmigrate = DBMigrate.getInstance(true, opts);
  dbmigrate.run();
}
