<template>
  <div class="api-test-container">
    <el-input v-model="apiUrl" placeholder="输入API地址" class="api-input" />
    <div v-for="(param, index) in queryParams" :key="index" class="param-input">
      <el-input v-model="param.key" placeholder="参数名" class="param-key" />
      <el-input v-model="param.value" placeholder="参数值" class="param-value" />
      <el-button type="danger" @click="removeParam(index)">删除</el-button>
    </div>
    <el-button type="primary" @click="addParam">添加参数</el-button>
    <el-button type="primary" @click="testApi">测试接口</el-button>
    <el-card v-if="responseData" class="response-data">
      <h2>响应数据</h2>
      <pre>{{ responseData }}</pre>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const apiUrl = ref<string>('')
const responseData = ref<unknown>(null)
const queryParams = ref<{ key: string; value: string }[]>([{ key: '', value: '' }])

const addParam = () => {
  queryParams.value.push({ key: '', value: '' })
}

const removeParam = (index: number) => {
  queryParams.value.splice(index, 1)
}

const testApi = async () => {
  try {
    const params = new URLSearchParams()
    queryParams.value.forEach((param) => {
      if (param.key && param.value) {
        params.append(param.key, param.value)
      }
    })
    const response = await fetch(`${apiUrl.value}?${params.toString()}`, {
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    responseData.value = await response.json()
  } catch (error) {
    responseData.value = (error as Error).message
  }
}
</script>

<style scoped>
.api-test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.api-input {
  width: 100%;
  margin-bottom: 20px;
}

.param-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.param-key,
.param-value {
  flex: 1;
  margin-right: 10px;
}

.response-data {
  margin-top: 20px;
}
</style>
