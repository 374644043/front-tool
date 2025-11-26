<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const commitType = ref('')
const commitScope = ref('')
const commitSubject = ref('')
const commitBody = ref('')
const commitFooter = ref('')

const typeOptions = [
  { value: 'init', label: 'init: 初始化提交' },
  { value: 'feat', label: 'feat: 新功能' },
  { value: 'fix', label: 'fix: 修复 bug' },
  { value: 'docs', label: 'docs: 文档修改' },
  { value: 'style', label: 'style: 代码格式修改（不影响代码运行）' },
  { value: 'refactor', label: 'refactor: 代码重构' },
  { value: 'perf', label: 'perf: 性能优化' },
  { value: 'test', label: 'test: 测试用例修改' },
  { value: 'build', label: 'build: 构建系统或依赖修改' },
  { value: 'ci', label: 'ci: CI 配置修改' },
  { value: 'chore', label: 'chore: 其他修改（不修改 src 或 test 文件）' },
  { value: 'revert', label: 'revert: 回退提交' },
]

const generatedMessage = computed(() => {
  let message = ''
  if (commitType.value) {
    message += commitType.value
    if (commitScope.value) {
      message += `(${commitScope.value})`
    }
    message += ': '
  }
  if (commitSubject.value) {
    message += commitSubject.value
  }
  if (commitBody.value) {
    message += `\n\n${commitBody.value}`
  }
  if (commitFooter.value) {
    message += `\n\n${commitFooter.value}`
  }
  return message
})

const copyToClipboard = async () => {
  if (!generatedMessage.value) {
    ElMessage.warning('请先生成提交信息')
    return
  }
  try {
    await navigator.clipboard.writeText(generatedMessage.value)
    ElMessage.success('已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败')
    console.error('Failed to copy: ', err)
  }
}
</script>

<template>
  <div class="container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Git 提交信息生成器</span>
        </div>
      </template>
      <el-form label-width="120px">
        <el-form-item label="类型">
          <el-select v-model="commitType" placeholder="请选择提交类型" style="width: 100%">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="范围">
          <el-input v-model="commitScope" placeholder="修改范围（可选）" />
        </el-form-item>
        <el-form-item label="简述">
          <el-input v-model="commitSubject" placeholder="简短描述" />
        </el-form-item>
        <el-form-item label="详情">
          <el-input v-model="commitBody" type="textarea" :rows="4" placeholder="详细描述（可选）" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="commitFooter" type="textarea" :rows="2" placeholder="备注信息（可选）" />
        </el-form-item>
      </el-form>

      <div class="preview-section">
        <h3>预览</h3>
        <el-input v-model="generatedMessage" type="textarea" :rows="6" readonly resize="none" />
        <div class="actions">
          <el-button type="primary" @click="copyToClipboard">复制到剪贴板</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-section {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.actions {
  margin-top: 10px;
  text-align: right;
}
</style>
