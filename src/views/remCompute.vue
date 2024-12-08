<script lang="ts" setup>
import { InputNumberInstance, RadioGroupProps } from 'element-plus'
import { computed, onMounted, ref, shallowRef } from 'vue'

const inputRef = shallowRef<InputNumberInstance>()
const userInput = ref<number>()
const baseSize = ref(10)
const precision = ref(2)
const roundType = ref(0)
const result = computed(() => {
  if (!userInput.value) return undefined
  const value = userInput.value / baseSize.value
  const factor = Math.pow(10, precision.value)
  let roundedValue: number
  switch (roundType.value) {
    case 1:
      roundedValue = Math.ceil(value * factor) / factor
      break
    case 2:
      roundedValue = Math.floor(value * factor) / factor
      break
    default:
      roundedValue = Math.round(value * factor) / factor
  }
  return roundedValue
})
const handleBaseSizeChange = (val?: number) => val && localStorage.setItem('remBaseSize', `${val}`)
const handlePrecisionChange = (val?: number) => val && localStorage.setItem('remPrecision', `${val}`)
const handleRoundTypeChange = (val: RadioGroupProps['modelValue']) => localStorage.setItem('remRoundType', `${val}`)
const getSetFromStorage = () => {
  const baseSizeStr = localStorage.getItem('remBaseSize')
  if (baseSizeStr) {
    baseSize.value = parseFloat(baseSizeStr)
  }
  const precisionStr = localStorage.getItem('remPrecision')
  if (precisionStr) {
    precision.value = parseInt(precisionStr)
  }
  const roundTypeStr = localStorage.getItem('remRoundType')
  if (roundTypeStr) {
    roundType.value = parseInt(roundTypeStr)
  }
}

// 获取之前的配置
getSetFromStorage()

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <div class="container">
    <el-card>
      <el-input-number ref="inputRef" v-model="userInput" :min="0" :controls="false" class="input">
        <template #suffix>
          <span>px</span>
        </template>
      </el-input-number>
      <div class="operators">
        <el-input-number v-model="baseSize" :min="1" :controls="false" :value-on-clear="10" @change="handleBaseSizeChange">
          <template #prefix>
            <span>1rem = </span>
          </template>
          <template #suffix>
            <span>px</span>
          </template>
        </el-input-number>
        <span class="label">精度：</span>
        <el-input-number v-model="precision" :precision="0" :min="0" @change="handlePrecisionChange"></el-input-number>
        <span class="label">舍入：</span>
        <el-radio-group v-model="roundType" @change="handleRoundTypeChange">
          <el-radio :value="0">四舍五入</el-radio>
          <el-radio :value="1">向上取整</el-radio>
          <el-radio :value="2">向下取整</el-radio>
        </el-radio-group>
      </div>
      <el-input :model-value="result" class="output" readonly></el-input>
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

.label {
  margin: 0 10px;
}
</style>
