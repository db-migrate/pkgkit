var path = require('path');

module.exports = function(program) {

  program
    .command('test <cmd>')
    .alias('t')
    .option(
      '-m, --memory',
      'Use SQLite in Memory default config.'
    )
    .description('Run the specified command.')
    .action(test);
};

function test(cmd, options) {

  var cp = require('child_process');
  var exec = path.join(__dirname, '../exec');

  var args = [ exec, cmd ];
  if(options.memory)
    args.push('-m');

  cp.spawnSync('node', args, { stdio: 'inherit' });
}
