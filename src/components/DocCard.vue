<script setup>
import { ref, toRaw, onMounted } from "vue";
import { useFieldsStore } from "@/stores/fields";
import { useConvertDocsStore } from "@/stores/convertDocs";
import { Tooltip } from "bootstrap";

const store = useFieldsStore();
const convertDocs = useConvertDocsStore();
const docItem = defineProps({ docNum: Number });
const expanded = ref(false);
const tooltipButton = ref(null);

const indexes = (item, num) => {
  return convertDocs.convertedData[num].indexOf(item);
};

const docLength = (num) => {
  return convertDocs.convertedData[num].length;
};

const handleExpand = () => {
  expanded.value = !expanded.value;
};

onMounted(() => {
  if (tooltipButton.value) {
    new Tooltip(tooltipButton.value);
  }
});

const copiedBtn = ref("");
const handleCopy = (num) => {
  let textMass = [];
  const temp = JSON.parse(JSON.stringify(convertDocs.convertedData[num]));
  temp.forEach((item) => {
    textMass.push(
      `${item.code}\t\t\t${item.quant}\t\t${(item.summ = String(
        item["summ"]
      ).replace(".", ","))}`
    );
  });
  const textToCopy = textMass.join("\n");

  // создем временное поле для копируемого текста
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = textToCopy;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  copiedBtn.value = "pushed";
  setTimeout(() => {
    copiedBtn.value = "changed";
  }, 1500);
  document.body.removeChild(tempTextArea);
};
</script>

<template>
  <p class="doc-title">{{ convertDocs.docTitle[docNum] }}</p>
  <button
    @click.prevent="handleCopy(docNum)"
    class="btn btn-primary mb-2"
    :class="[
      copiedBtn === 'pushed'
        ? 'pushed-button'
        : copiedBtn === 'changed'
        ? 'changed-button'
        : '',
    ]"
  >
    {{ copiedBtn === "" ? "Скопировать" : "Скопировано" }}
  </button>
  <table class="mb-3">
    <tbody>
      <tr>
        <td class="item-row">код</td>
        <td class="item-row">кол-во</td>
        <td class="item-row">сумма</td>
      </tr>
      <tr
        v-for="item of convertDocs.convertedData[docNum]"
        :key="indexes(item, docNum)"
      >
        <td v-show="expanded || indexes(item, docNum) < 3" class="item-row">
          {{ item.code }}
        </td>
        <td v-show="expanded || indexes(item, docNum) < 3" class="item-row">
          {{ item.quant }}
        </td>
        <td v-show="expanded || indexes(item, docNum) < 3" class="item-row">
          {{ item.summ }}
        </td>
      </tr>
      <tr>
        <td v-show="docLength(docNum) > 3" class="item-row">............</td>
      </tr>
    </tbody>
  </table>
  <button
    @click.prevent="handleExpand(docNum)"
    v-show="docLength(docNum) > 3"
    class="btn btn-outline-secondary btn-sm mb-4"
  >
    {{ expanded ? "Свернуть" : "Развернуть" }}
  </button>
  <div class="doc-sum-wrap">
    <p class="doc-sum-title">Сумма документа:</p>
    <a
      ref="tooltipButton"
      class="doc-sum"
      :class="[
        convertDocs.comparedSumm(docNum) ? 'doc-sum-green' : 'doc-sum-red',
      ]"
      :title="[
        convertDocs.comparedSumm(docNum)
          ? 'Сумма строк совпадает с итоговой'
          : 'Сумма строк НЕ совпадает с итоговой. Проверьте документ.',
      ]"
      >{{ Number(convertDocs.allSummValues[docNum]).toLocaleString("ru") }}</a
    >
  </div>
</template>

<style scoped>
.doc-title {
  font-size: 12px;
}

.doc-sum-wrap {
  margin-top: auto;
}

.doc-sum-title {
  font-size: 12px;
  margin-bottom: 5px;
}

.doc-sum {
  text-decoration: none;
  color: black;
}

.doc-sum-green {
  color: green;
}

.doc-sum-red {
  color: red;
}

.item-row {
  font-size: 8px;
}

.pushed-button {
  background-color: #24870f;
}

.changed-button {
  background-color: #6db3ff;
}
</style>
