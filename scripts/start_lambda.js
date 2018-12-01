process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const exec = require('child_process').exec;

exec('netlify-lambda serve src/lambda',
  function(err, stdout, stderr) {
    if (err) throw err;
    else console.log(stdout);
});
