<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="container">
    <div class="menu-item" @click="router.push('/toggle-case')">大小写转换</div>
    <div class="menu-item" @click="router.push('/rem-compute')">rem计算</div>
    <div class="menu-item" @click="router.push('/api-test')">接口在线调用</div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
.menu-item {
  height: 100px;
  line-height: 100px;
  text-align: center;
  background-color: #ffffff;
  color: #000000;
  font-weight: bolder;
  font-size: 20px;
  cursor: pointer;
}
</style>
