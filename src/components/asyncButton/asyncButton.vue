<!--
 * @Author: pangwei pw374644043@gmail.com
 * @Date: 2023-02-09 08:58:29
 * @LastEditors: pangwei pw374644043@gmail.com
 * @LastEditTime: 2023-02-24 15:46:47
-->
<script lang="ts" setup>
import { ref } from 'vue'

interface Props {
  func: () => void
}
const props = defineProps<Props>()
const loading = ref(false)
const handleClick = async () => {
  loading.value = true
  let loadingStartTime = new Date().getTime()
  await props.func()
  // 防止loading闪烁，至少loading一秒
  const loadingLeftTime = Math.max(1000 - (new Date().getTime() - loadingStartTime), 0)
  setTimeout(() => (loading.value = false), loadingLeftTime)
}
</script>
<template>
  <el-button v-bind="$attrs" :loading="loading" @click="handleClick">
    <slot></slot>
  </el-button>
</template>
