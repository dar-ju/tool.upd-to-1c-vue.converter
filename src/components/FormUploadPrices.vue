<script setup>
import { useFieldsStore } from "@/stores/fields";
import { useConvertPricesStore } from "@/stores/convertPrices";
import { ref, watch } from "vue";

const localData = JSON.parse(localStorage.getItem("upd-to-1c"));
const storeFields = useFieldsStore();
const сonvertPricesStore = useConvertPricesStore();
const fields = storeFields.fields;
const profilePriceSelect = ref("");
const profilePriceSumm = ref(0);
const showButton = ref(false);

// выбираем умолчания
profilePriceSelect.value = "komus";
profilePriceSumm.value = localData.priceSumm[profilePriceSelect.value].summ;

// обработка прйса
const filePriceUpload = (event) => {
  showButton.value = true;
  try {
    const file = event.target.files[0];
    сonvertPricesStore.convertPrice(
      file,
      profilePriceSumm.value,
      profilePriceSelect.value
    );
  } catch (err) {
    console.error(err);
  }
};

// меняем сумму в поле в зависимости от профиля
watch(profilePriceSelect, () => {
  profilePriceSumm.value = fields.priceSumm[profilePriceSelect.value].summ;
});

// меняем localstorage, если меняется сумма
watch(profilePriceSumm, () => {
  fields.priceSumm[profilePriceSelect.value].summ = profilePriceSumm.value;
  storeFields.editLocalstorage(fields);
});
</script>

<template>
  <div>
    <h4>Преобразование прайсов</h4>
    <div class="d-flex column-gap-3">
      <div class="price-load">
        <label for="formFile" class="form-label"
          >Загрузить прайс контрагента</label
        >
        <input
          v-on:change="filePriceUpload"
          class="form-control input-group input"
          type="file"
          id="formFilePrice"
          accept=".xls, .xlsx, .csv, .xml"
        />
      </div>
      <input
        v-model="profilePriceSumm"
        class="price-summ form-control input-group input align-self-end"
        type="text"
        id="formFilePriceSumm"
        placeholder="Мин.сумма строки руб."
        aria-label="default input example"
      />
      <div class="profile-block">
        <label for="profile" class="form-label">Выбор профиля</label>
        <select
          v-model="profilePriceSelect"
          class="form-select"
          id="profilePrice"
          aria-label="Default select example"
        >
          <option value="komus">Комус</option>
          <option value="relef">Рельеф</option>
          <option value="samson">Самсон</option>
          <option value="profile4">Профиль4</option>
          <option value="profile5">Профиль5</option>
        </select>
      </div>
      <button
        v-show="showButton"
        class="price-loading btn btn-primary btn-loding"
        type="button"
        id="loadingBtn"
        disabled
      >
        <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
        <span role="status">Обработка...</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.price-load {
  max-width: 250px;
}

.price-summ {
  max-width: 250px;
}

.price-loading {
  max-height: 38px;
  align-self: end;
}
</style>
