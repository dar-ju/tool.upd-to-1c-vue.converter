<script setup>
import { ref, onMounted, watch } from "vue";
import { useConvertDocsStore } from "@/stores/convertDocs";
import { Modal } from "bootstrap";

const convertDocs = useConvertDocsStore();
const modalText = ref("");

const state = ref({
  modal_demo: null,
});

onMounted(() => {
  state.modal_demo = new Modal("#modal_demo", {});
});

function openModal(message) {
  state.modal_demo.show();
  modalText.value = message;
}

function closeModal() {
  state.modal_demo.hide();
  convertDocs.errorMessage = "";
}

watch(
  () => convertDocs.errorMessage,
  () => {
    openModal(convertDocs.errorMessage);
  }
);
</script>

<template>
  <div
    class="modal fade"
    id="modal_demo"
    tabindex="-1"
    aria-labelledby="modal_demo_label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">{{ modalText }}</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="closeModal">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
