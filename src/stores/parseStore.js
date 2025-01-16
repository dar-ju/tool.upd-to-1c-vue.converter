import { defineStore } from 'pinia'
import { getDomData } from '@/api/parse'
import { ref } from 'vue'

export const useParseStore = defineStore('parse', () => {

  const data = ref({})
  const getData = async () => {
    await getDomData()
  }

  return { data, getData }
})
