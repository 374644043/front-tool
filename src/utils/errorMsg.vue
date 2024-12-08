<script lang="ts" setup>
import { ref } from 'vue'

interface Props {
  msg?: string
  description?: string
}
defineProps<Props>()
const detailVisible = ref(false)
</script>
<template>
  <div>
    <span>{{ msg }}</span>
    <a class="view-detail" @click.prevent="detailVisible = !detailVisible">{{ detailVisible ? '收起' : '查看详情' }}</a>
    <p v-show="detailVisible">{{ description }}</p>
  </div>
</template>