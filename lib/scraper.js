const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const bot = require('./bot-actions');
const ntTemp = require('../models/nt-temp');

exports.run = () => {
  return new Promise((resolve, reject) => {

    (async () => {
      let result = [];
      let browser = undefined;

      try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setRequestInterception(true);
        page.on('request', interceptedRequest => {
          if (
            interceptedRequest.url().endsWith('.png') ||
            interceptedRequest.url().endsWith('.jpg') ||
            interceptedRequest.url().endsWith('.webp')
          )
            interceptedRequest.abort();
          else
            interceptedRequest.continue();
        });

        let flag = true;
        const cacheFile = path.join(__dirname, '../cache/seed.dat');
        let next = {
          year: '',
          make: '',
          model: '',
          trim: ''
        };
        if (fs.existsSync(cacheFile)) {
          next = JSON.parse(fs.readFileSync(cacheFile).toString());
        }

        while (flag) {

          await page.goto('https://www.nittotire.com/find-a-tire/', {
            waitUntil: 'networkidle2',
            timeout: 120000,
          });

          const vehicle = await bot.selectVehicle(page, next.year, next.make, next.model, next.trim);

          next = vehicle.nextFilter;

          await page.waitFor(3000);

          const result = await page.evaluate(() => document.querySelector('div.result-vehicle > p'));

          if (result) {
            // Guardo el resultado en el temp
            const body = await page.evaluate(() => document.body.innerHTML);
            const nt = new ntTemp({
              seed: vehicle.filterValues,
              result: body,
              status: 'Active',
            });

            await nt.save();

            console.log(`Saved ${vehicle.filterValues.year} ${vehicle.filterValues.make} ${vehicle.filterValues.model} ${vehicle.filterValues.trim}`);
          }

          if (next.year === '') {
            flag = false;
          } else {
            fs.writeFileSync(cacheFile, JSON.stringify(next), 'utf-8');
          }
        }

        await page.waitFor(5000);


      } catch (err) {
        return reject(err);
      } finally {
        if (browser) {
          await browser.close();
        }
      }


      return resolve(result);
    })();
  });
};