<script setup>
import DocCard from "./components/DocCard.vue";
import UploadDocs from "./components/FormUploadDocs.vue";
import UploadPrices from "./components/FormUploadPrices.vue";
import ErrorModal from "./components/ErrorModal.vue";
import { useConvertDocsStore } from "@/stores/convertDocs";
import { useFieldsStore } from "@/stores/fields";
import { ref } from "vue";

const isLocalStoreFilled = ref(false);

// если localstorage пустое
const fieldStore = useFieldsStore();
if (!localStorage.getItem("upd-to-1c")) {
  localStorage.setItem("upd-to-1c", fieldStore.setDefaultFields());
  isLocalStoreFilled.value = true;
} else isLocalStoreFilled.value = true;

const convertDocs = useConvertDocsStore();
</script>

<template>
  <div v-show="isLocalStoreFilled" class="container">
    <UploadDocs />
    <hr class="border border-primary border-2 opacity-50" />
    <UploadPrices />
    <hr class="border border-primary border-2 opacity-50" />
    <div class="doc-container">
      <div
        class="doc-wrap"
        v-for="item of convertDocs.convertedData"
        :key="item.index"
      >
        <DocCard :docNum="convertDocs.convertedData.indexOf(item)" />
      </div>
    </div>
    <ErrorModal />
  </div>
</template>

<style scoped>
.doc-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 30px;
  gap: 15px;
}

.doc-wrap {
  display: flex;
  width: 182px;
  flex-direction: column;
  padding: 10px;
  outline: 1px solid gray;
}
</style>
