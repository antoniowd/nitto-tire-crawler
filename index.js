const db = require('./helpers/db');
const scraper = require('./lib/scraper');


db.connect();

scraper.run().then(() => console.log('Done')).catch(err => console.log(err));