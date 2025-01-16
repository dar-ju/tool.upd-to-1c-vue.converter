import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConvertDocsStore = defineStore('docs', () => {

  const convertedData = ref({})
  const docTitle = ref([])
  const allSummValues = ref([])
  const errorMessage = ref('')
  let localData

  // функция конвертирования
  function convert(data) {
    const documentSeparator = 'Счёт-фактура №';
    const totalSumm = 'Всего к оплате';
    const numOfDoc = 'Счёт-фактура №';
    const maxFileSize = 1000 * 1024;
    allSummValues.value = []
    docTitle.value = []
    convertedData.value = {}

    //загружаем localstorage
    localData = JSON.parse(localStorage.getItem('upd-to-1c'));
    let jsonData;

    // устанавливаем объект активного правила
    let localDataActive = localData[localData.active];

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

    // проверка на размер
    if (data.size > maxFileSize) {
      errorMessage.value = 'Размер файла не должен превышать 1 мег.'
      return;
    }

    // читаем файл
    let docType
    const reader = new FileReader();
    const fileExt = data.name.split('.').pop();
    if (fileExt === 'xml') {
      reader.readAsText(data, 'windows-1251');
      docType = 'xml';
    } else if (fileExt === 'xls' || fileExt === 'xlsx') {
      reader.readAsArrayBuffer(data);
      docType = 'xls';
    } else errorMessage.value = 'Неверный формат файла.';

    // когда файл будет прочитан
    reader.onload = function (e) {
      let count;
      let indexesIfSf = [];
      let finalData = [];

      const xmlString = e.target.result;
      // по расширению вызываем функцию конверта
      // если документ(ы) XML
      if (fileExt === 'xml') {
        jsonData = xml2js(xmlString, { compact: true, spaces: 4 });
        // ищем объект с товарами
        function findObjectWithKey(obj, keyToFind, item) {
          let temp = []
          let stack = [obj];
          while (stack.length > 0) {
            let currentObj = stack.pop();
            for (let key in currentObj) {
              if (key === keyToFind) temp.unshift(currentObj[key])
              if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
                stack.push(currentObj[key]);
              }
            }
          }
          return temp;
        }
        const code = findObjectWithKey(jsonData, localDataActive.code, 'code');
        const quant = findObjectWithKey(jsonData, localDataActive.quant, 'quant');
        const summ = findObjectWithKey(jsonData, localDataActive.summ, 'summ');
        finalData.push([])
        for (let i = 0; i < code.length; i++) {
          finalData[0].push({ code: code[i], quant: quant[i], summ: summ[i] })
        }
        convertedData.value = finalData

        if (!finalData[0].length) {
          errorMessage.value = 'Проверьте текущий профиль, либо контрольные поля не соответствуют документу';
          return;
        }
        else allSummValues.value.push(finalData[0].map(item => item.summ).reduce((acc, val) => Number(acc) + Number(val)).toFixed(2));
      }

      // если документ(ы) XLS
      else if (fileExt === 'xls' || fileExt === 'xlsx') {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // конвертируем первый лист в JSON
        jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        jsonData = dataNormalize(jsonData);

        // обрабатываем данные, удаляя лишние пробелы и переносы строк
        function dataNormalize(data) {
          const output = data.map(row => {
            const cleanedRow = {};
            for (const key in row) {
              if (typeof row[key] === 'string') {
                cleanedRow[key] = row[key].replace(/[\r\n]+/g, '').trim();
              } else cleanedRow[key] = row[key];
            }
            return cleanedRow;
          });
          return output;
        }

        // находим ключевые поля и выводим модалки, если проблемы
        let productQuantItem, productSummItem;
        const productCodeItem = findColumn(localDataActive.code);

        if (productCodeItem == undefined) {
          errorMessage.value = 'Загружен не файл с накладными. Иначе нужно проверить название колонки "Код товара" в документе и изменить ее в контрольном поле.';
          return;
        }
        else {
          productQuantItem = findColumn(localDataActive.quant);
          if (productQuantItem == undefined) {
            errorMessage.value = 'Не определяется колонка с количеством. Нужно проверить название колонки "Количество" в документе и изменить ее в контрольном поле.';
            return;
          }
          else {
            productSummItem = findColumn(localDataActive.summ);
            if (productSummItem == undefined) {
              errorMessage.value = 'Не определяется колонка с суммой номенклатуры. Нужно проверить название колонки "Стоимость товаров с налогом - всего" в документе и изменить ее в контрольном поле.';
              return
            }
          };
        };

        // считаем количество документов
        count = jsonData.filter(obj => {
          return Object.values(obj).some(value =>
            typeof value === 'string' && value.includes(documentSeparator)
          );
        }).length;

        // собираем индексы в кучу
        for (let i = 0; i < jsonData.length; i++) {
          if (Object.values(jsonData[i]).some(value => typeof value === 'string' && value.includes(documentSeparator))) {
            indexesIfSf.push(i);
          };
        };

        // получаем все суммы
        for (let i = 0; i < jsonData.length; i++) {
          if (Object.values(jsonData[i]).some(value => typeof value === 'string' && value.includes(totalSumm))) {
            allSummValues.value.push(jsonData[i][productSummItem]);
          };
        };

        // получаем номера документов
        docTitle.value = [];
        for (let i = 0; i < count; i++) {
          const findDocIndex = Object.values(jsonData[indexesIfSf[i]]).findIndex(item => item.includes(numOfDoc));
          const tempMass = Object.keys(jsonData[indexesIfSf[i]]);
          const docEl = tempMass[findDocIndex];

          if (jsonData[indexesIfSf[i]][docEl]) {
            docTitle.value.push(jsonData[indexesIfSf[i]][docEl].split(' ').slice(0, 3).join(' '));
          }
        }

        // формируем окончательный массив
        const slicedBySf = [];
        const regular = new RegExp('^\\d+$');
        for (let i = 0; i < count; i++) {
          slicedBySf.push(jsonData.slice(indexesIfSf[i], indexesIfSf[i + 1]));
          finalData.push([]);
          for (let item in slicedBySf[i]) {
            if (regular.test(slicedBySf[i][item][productCodeItem])) finalData[i].push({
              code: slicedBySf[i][item][productCodeItem],
              quant: slicedBySf[i][item][productQuantItem],
              summ: slicedBySf[i][item][productSummItem]
            });
          };
        };
        convertedData.value = finalData
      }
    }
  }

  // функция проверки сумм документов
  function comparedSumm(docIndex) {
    if (!convertedData.value[docIndex].map(item => item.summ).length) {
      return;
    }
    const summary = convertedData.value[docIndex].map(item => item.summ).reduce((acc, val) => Number(acc) + Number(val)).toFixed(2);
    const summInDoc = allSummValues.value[docIndex]
    if (localData.active === 'edo' || summary == summInDoc) return summary;
    else return false
  }

  return { convert, convertedData, docTitle, allSummValues, comparedSumm, errorMessage }
})
