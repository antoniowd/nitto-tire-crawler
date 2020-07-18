const mongoose = require('mongoose');

exports.connect = params => new Promise((resolve, reject) => {
  const opts = {
    debug: false,
  };

  if (params) {
    opts.debug = params.debug !== undefined ? params.debug : opts.debug;
  }

  const options = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  };
  const uri = 'mongodb://127.0.0.1:27017/nitto-tire';

  mongoose.set('debug', opts.debug);
  mongoose.connect(uri, options).then(
    () => resolve(),

    err => reject(err),
  );
});