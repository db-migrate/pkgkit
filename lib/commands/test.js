
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

}
