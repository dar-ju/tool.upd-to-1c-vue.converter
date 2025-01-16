import { defineStore } from 'pinia'

export const useConvertPricesStore = defineStore('price', () => {

  function convertPrice(data, summ, profile) {
    // читаем файл
    const reader = new FileReader();
    const fileExt = data.name.split('.').pop();
    reader.readAsArrayBuffer(data);

    // когда файл будет прочитан
    reader.onload = function (e) {
      let jsonData;
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      console.log(workbook);

      // конвертируем первый лист в JSON
      jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
      console.log(jsonData);
      const fields = {
        komus: {
          partNum: 'Артикул',
          name: 'Наименование товара',
          price: 'Ваша цена',
          quant: 'Доступно для заказа'
        },
        relef: {
          partNum: 'Код',
          name: 'Номенклатура',
          price: 'Цена',
          quant: 'КоличествоОстаток'
        },
        samson: {
          partNum: 'Код',
          name: 'Наименование',
          price: 'Ваша цена',
          quant: 'Остаток на складе'
        }
      }
      const avaliblePart = findColumn(fields[profile].partNum);
      const avalibleName = findColumn(fields[profile].name);
      const avaliblePrice = findColumn(fields[profile].price);
      const avalibleQuant = findColumn(fields[profile].quant);

      // функция нахождения названия ключа по его значению во всем файле
      function findColumn(colName) {
        try {
          // убираем пробелы и переносы, чтобы пользователь с этим не возился
          const cleanedName = colName.replace(/\s+/g, '');
          const indexOfCode = jsonData.findIndex(obj => {
            return Object.values(obj).some(value => {
              // также убираем в исходном объекте
              if (typeof value === 'string') {
                const cleanedValue = value.replace(/\s+/g, '');
                return cleanedValue.includes(cleanedName);
              }
            });
          });
          if (jsonData[indexOfCode] !== undefined) {
            return Object.keys(jsonData[indexOfCode]).find(key =>
              jsonData[indexOfCode][key].replace(/\s+/g, '') === cleanedName
            );
          }
        }
        catch (err) {
          console.error(err);
        };
      };

      // обрабатываем данные
      function dataNormalizePrice(data) {
        try {
          let newObj = {};
          for (let item in data) {
            const row = [jsonData[item][avaliblePart], jsonData[item][avalibleName], jsonData[item][avaliblePrice], jsonData[item][avalibleQuant]]
            // добавляем заголовок
            if (jsonData[item][avalibleQuant] == 'Доступно для заказа') newObj[item] = row
            // добавляем тело
            if (jsonData[item][avalibleQuant] * jsonData[item][avaliblePrice] > summ) {
              newObj[item] = row
            }
          }
          return newObj
        }
        catch (err) {
          console.error(err)
        }
        finally {
          loadingBtn.style.display = 'none';
        }
      }
      jsonData = dataNormalizePrice(jsonData);
      // Преобразуем объект в массив для записи
      const dataForExport = Object.keys(jsonData).map(key => {
        return { ...jsonData[key] };
      });

      // Создаем новую книгу и добавляем лист
      const workbookPrice = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(dataForExport);

      // Добавляем лист в книгу
      XLSX.utils.book_append_sheet(workbookPrice, worksheet, "Sheet1");

      // Записываем файл
      XLSX.writeFile(workbookPrice, `${profile}-обработанный.xlsx`);
    }
  }

  return { convertPrice }
})
