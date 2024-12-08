<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const userInput = ref('')
const varType = ref('')
const result = ref('')
const handleExchange = () => {
  if (!userInput.value) {
    ElMessage.warning('请输入待格式化内容')
    return false
  }
  if (!varType.value) {
    ElMessage.warning('请选择输出格式')
    return false
  }
  // 选择对应的分割符
  let split = ''
  if (varType.value === 'snake-case' || varType.value === 'upper-case') {
    split = '_'
  } else if (varType.value === 'kebab-case') {
    split = '-'
  }
  result.value = userInput.value
    .split(/[ _\-.]/)
    .filter(Boolean)
    .map((word, index) => {
      switch (varType.value) {
        case 'low-camel-case':
          return index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        case 'upper-camel-case':
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        case 'snake-case':
        case 'kebab-case':
          return word.toLowerCase()
        case 'upper-case':
          return word.toUpperCase()
        default:
          return word
      }
    })
    .join(split)
}
</script>

<template>
  <div class="container">
    <el-card>
      <el-input v-model="userInput" :rows="10" type="textarea" class="input" @keyup.enter="handleExchange" />
      <div class="operators">
        <span>输出格式设置：</span>
        <el-radio-group v-model="varType">
          <el-radio value="low-camel-case">小驼峰</el-radio>
          <el-radio value="upper-camel-case">大驼峰</el-radio>
          <el-radio value="snake-case">下划线（Snake Case）</el-radio>
          <el-radio value="upper-case">全大写</el-radio>
          <el-radio value="kebab-case">Kebab-Case</el-radio>
        </el-radio-group>
        <el-button type="primary" class="exchange-btn" @click.prevent="handleExchange">转换</el-button>
      </div>
      <el-input :model-value="result" :rows="10" type="textarea" class="output" readonly></el-input>
    </el-card>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
  height: 100%;
}

.input {
  width: 100%;
}

.operators {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.exchange-btn {
  margin-left: 20px;
}
</style>
