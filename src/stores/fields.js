import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFieldsStore = defineStore('fields', () => {

  const fields = ref(JSON.parse(localStorage.getItem("upd-to-1c")));

  const defaultFields = {
    upd: {
      code: 'Код товара/работ, услуг',
      quant: 'Коли-чество(объем)',
      summ: 'Стоимость товаров(работ, услуг), имущественных прав с налогом - всего',
    },
    edo: {
      code: 'КодТов',
      quant: 'КолТов',
      summ: 'СтТовУчНал',
    },
    custom1: { code: '', quant: '', summ: '' },
    custom2: { code: '', quant: '', summ: '' },
    custom3: { code: '', quant: '', summ: '' },
    active: 'upd',
    priceSumm: {
      komus: {
        summ: 5000,
        quant: 'Доступно для заказа',
        rowSumm: 'Ваша цена'
      },
      relef: {
        summ: 3000,
        quant: 'КоличествоОстаток',
        rowSumm: 'Цена'
      },
      samson: {
        summ: 3000,
        quant: 'Остаток на складе',
        rowSumm: 'Ваша цена'
      },
      profile4: {
        summ: 3000,
        quant: 'Доступно для заказа',
        rowSumm: 'Ваша цена'
      },
      profile5: {
        summ: 3000,
        quant: 'Доступно для заказа',
        rowSumm: 'Ваша цена'
      }
    },
  }

  function setDefaultFields() {
    localStorage.setItem("upd-to-1c", JSON.stringify(defaultFields))
    fields.value = JSON.parse(localStorage.getItem("upd-to-1c"))
  }

  function editLocalstorage(data) {
    localStorage.setItem("upd-to-1c", JSON.stringify(data))
  }

  if (!localStorage.getItem("upd-to-1c")) {
    setDefaultFields()
  }

  return { fields, setDefaultFields, editLocalstorage }
})
