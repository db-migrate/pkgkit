var path = require('path');
var fs = require('fs');
var pkg = require(path.join(process.cwd(), 'package.json'));
var program = require('commander');
var pkginfo = require('pkginfo')(module, 'version'); // jshint ignore:line
var cmdPath = path.join(__dirname, 'lib/commands');
var files = fs.readdirSync(cmdPath);

files.forEach(function(file) {

  require(path.join(cmdPath, file))(program, pkg);
});

program
  .version(module.exports.version)
  .option('-v, --verbose', 'Enable verbose mode.')
  .action(function() {
    global.verbose = true;
  });

program.parse(process.argv);
if(!program.args.length)
  program.help();
