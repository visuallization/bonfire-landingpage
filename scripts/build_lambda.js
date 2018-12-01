process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const exec = require('child_process').exec;

exec('netlify-lambda build src/lambda',
  function(err, stdout, stderr) {
    if (err) throw err;
    else console.log(stdout);
});
