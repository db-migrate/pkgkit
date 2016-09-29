var path = require('path');

module.exports = function(program, pkg) {

  program
    .command('watch <cmd>')
    .alias('w')
    .option(
      '-d, --folder <folder>', 'Specifies a folder to be watched.',
      process.cwd()
    )
    .option(
      '-w, --watcher <watcher>', 'Specifies the watcher to be used',
      'events'
    )
    .option(
      '-m, --memory',
      'Use SQLite in Memory default config.'
    )
    .description('Run the specified command on every change.')
    .action(watch.bind(this, pkg));
};

function watch(pkg, cmd, options) {

  var sane = require('sane');
  var cp = require('child_process');
  var running = false;
  var opt = {

    watchman: options.watcher === 'events' || options.watcher === 'watchman',
    poll: options.watcher === 'poll',
    glob: ['**/*.js']
  };
  var watcher = sane(options.folder, opt);
  var exec = path.join(__dirname, '../exec');

  watcher.on('ready', function () {
    console.log('ready');
  });
  watcher.on('change', function (filepath) {
    console.log('file changed', filepath);
    spawn();
  });
  watcher.on('add', function (filepath) {
    console.log('file added', filepath);
    spawn();
  });
  watcher.on('delete', function (filepath) {
    console.log('file deleted', filepath);
    spawn();
  });

  function spawn() {

    if(running) return;
    var args = [ exec, cmd ];
    if(options.memory)
      args.push('-m');

    running = true;
    var sleep = cp.spawn('node', args, { stdio: 'inherit' });
    sleep.on('close', function() {

      running = false;
    });
  }
}
