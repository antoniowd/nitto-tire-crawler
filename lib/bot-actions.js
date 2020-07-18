
exports.selectVehicle = (page, year, make, model, trim) => {
  return new Promise((resolve, reject) => {

    (async () => {
      let nextFilter = {};
      let filterValues = {};
      const filter = {
        year,
        make,
        model,
        trim,
      };
      try {

        // Si year es vacio cargo el primer elemento
        if (year === '') {
          filter.year = await page.evaluate(() => document.querySelector('#year option:nth-child(2)').id);
        }
        // Selecciono el year
        filterValues.year = await page.evaluate((y) => {
          const value = document.querySelector(`#year option[id="${y}"]`).value;
          document.querySelector(`#year option[id="${y}"]`).selected = true;
          document.querySelector('#year').dispatchEvent(new Event('change'));
          return value;
        }, filter.year);
        await page.waitForSelector('#make');
        await page.waitFor(() => (document.querySelectorAll('#make option') || []).length > 1);


        // Si make es vacio cargo el primer elemento
        if (make === '') {
          filter.make = await page.evaluate(() => document.querySelector('#make option:nth-child(2)').id);
        }
        // Selecciono el make
        filterValues.make = await page.evaluate((m) => {
          const value = document.querySelector(`#make option[id="${m}"]`).value;
          document.querySelector(`#make option[id="${m}"]`).selected = true;
          document.querySelector('#make').dispatchEvent(new Event('change'));
          return value;
        }, filter.make);
        await page.waitForSelector('#model');
        await page.waitFor(() => (document.querySelectorAll('#model option') || []).length > 1);


        // Si model es vacio cargo el primer elemento
        if (model === '') {
          filter.model = await page.evaluate(() => document.querySelector('#model option:nth-child(2)').id);
        }
        // Selecciono el model
        filterValues.model = await page.evaluate((m) => {
          const value = document.querySelector(`#model option[id="${m}"]`).value;;
          document.querySelector(`#model option[id="${m}"]`).selected = true;
          document.querySelector('#model').dispatchEvent(new Event('change'));
          return value;
        }, filter.model);
        await page.waitForSelector('#trim');
        await page.waitFor(() => (document.querySelectorAll('#trim option') || []).length > 1);


        // Si trim es vacio cargo el primer elemento
        if (trim === '') {
          filter.trim = await page.evaluate(() => document.querySelector('#trim option:nth-child(2)').id);
        }
        // Selecciono el trim
        filterValues.trim = await page.evaluate((t) => {
          const value = document.querySelector(`#trim option[id="${t}"]`).value;
          document.querySelector(`#trim option[id="${t}"]`).selected = true;
          document.querySelector('#trim').dispatchEvent(new Event('change'));
          return value;
        }, filter.trim);


        // Caclulo el next filter
        nextFilter = filter;

        nextFilter.trim = await page.evaluate((t) => {
          const item = document.querySelector(`#trim option[id="${t}"]`);
          if (item.nextSibling) {
            return item.nextSibling.id;
          }
          return '';
        }, filter.trim);


        if (nextFilter.trim === '') {

          nextFilter.model = await page.evaluate((m) => {
            const item = document.querySelector(`#model option[id="${m}"]`);
            if (item.nextSibling) {
              return item.nextSibling.id;
            }
            return '';
          }, filter.model);
        }

        if (nextFilter.model === '') {

          nextFilter.make = await page.evaluate((m) => {
            const item = document.querySelector(`#make option[id="${m}"]`);
            if (item.nextSibling) {
              return item.nextSibling.id;
            }
            return '';
          }, filter.make);
        }

        if (nextFilter.make === '') {

          nextFilter.year = await page.evaluate((y) => {
            const item = document.querySelector(`#year option[id="${y}"]`);
            if (item.nextSibling) {
              return item.nextSibling.id;
            }
            return '';
          }, filter.year);
        }

        // click en el submit para mostrar los resultados
        await page.waitFor(
          () => !document.querySelector('#vehicleTab > form > ul > div.five.columns.last.right > li').classList.contains('disabled')
        );
        await page.click('#submitVehicle');
      } catch (err) {
        return reject(err);
      }

      return resolve({ nextFilter, filterValues, currentFilter: filter });

    })();

  });
}