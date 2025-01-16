<script setup>
import { useFieldsStore } from "@/stores/fields";
import { useConvertDocsStore } from "@/stores/convertDocs";
import { ref, watch } from "vue";

const localData = JSON.parse(localStorage.getItem("upd-to-1c"));
const storeFields = useFieldsStore();
const convertDocs = useConvertDocsStore();
const fields = storeFields.fields;
const profileDocSelect = ref("");
profileDocSelect.value = localData.active;

const filesUpload = (event) => {
  const file = event.target.files[0];
  convertDocs.convert(file);
};

watch(fields, () => {
  storeFields.editLocalstorage(fields);
});

watch(profileDocSelect, () => {
  fields.active = profileDocSelect.value;
  storeFields.editLocalstorage(fields);
});
</script>

<template>
  <div>
    <h4>Преобразование документов</h4>
    <label for="formFileLg" class="form-label"
      >Загрузить файл с накладными</label
    >
    <input
      v-on:change="filesUpload"
      class="form-control form-control-lg mb-3"
      type="file"
      id="formFileLg"
      multiple="multiple"
      accept=".xls, .xlsx, .csv, .xml"
    />
    <div class="d-flex gap-3 mb-1">
      <p class="about">
        Как пользоваться: проверить названия колонок, загрузить файл с
        накладными, скопировать полученные данные. Если значения были изменены
        случайно можно
        <a href="" @click.prevent="storeFields.setDefaultFields"
          >сбросить поля</a
        >
      </p>

      <div class="profile-block">
        <label for="profile" class="form-label">Выбор профиля</label>
        <select
          v-model="profileDocSelect"
          class="form-select form-select-sm"
          id="profile"
          aria-label="Default select example"
        >
          <option value="upd">УПД (xls, xlsx)</option>
          <option value="edo">ЭДО (xml)</option>
          <option value="custom1">-</option>
          <option value="custom2">-</option>
          <option value="custom3">-</option>
        </select>
      </div>
    </div>

    <p class="mb-2">Контрольные поля (названия колонок):</p>
    <form id="columns">
      <div class="text-center">
        <div class="row justify-content-between">
          <div class="input-group col mb-2">
            <span class="input-group-text">Код</span>
            <textarea
              v-model="storeFields.fields[profileDocSelect].code"
              class="form-control"
              id="code"
              aria-label="Код товара"
            ></textarea>
          </div>
          <div class="input-group col mb-2">
            <span class="input-group-text">Кол-во</span>
            <textarea
              v-model="storeFields.fields[profileDocSelect].quant"
              class="form-control"
              id="quant"
              aria-label="Количество"
            ></textarea>
          </div>
          <div class="input-group col mb-2">
            <span class="input-group-text">Сумма</span>
            <textarea
              v-model="storeFields.fields[profileDocSelect].summ"
              class="form-control"
              id="summ"
              aria-label="Сумма"
            ></textarea>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.profile-block {
  min-width: 170px;
}
</style>
