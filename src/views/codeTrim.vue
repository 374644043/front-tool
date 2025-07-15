<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { Upload, Download, DocumentCopy } from '@element-plus/icons-vue'

const userInput = ref('')
const result = ref('')
const loading = ref(false)
const removeEmptyLines = ref(true)
const removeComments = ref(true)
const preserveIndentation = ref(true)
const codeLanguage = ref('auto')

// 支持的编程语言
const languages = [
  { label: '自动检测', value: 'auto' },
  { label: 'JavaScript/TypeScript', value: 'javascript' },
  { label: 'Java', value: 'java' },
  { label: 'C/C++', value: 'c' },
  { label: 'Python', value: 'python' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'LESS', value: 'less' },
  { label: '微信小程序 WXML', value: 'wxml' },
  { label: 'SQL', value: 'sql' },
  { label: '其他', value: 'other' },
]

// 检测代码语言
const detectLanguage = (code: string): string => {
  const lowerCode = code.toLowerCase()

  // 检测微信小程序 WXML
  if (lowerCode.includes('<view') || lowerCode.includes('<text') || lowerCode.includes('wx:for') ||
    lowerCode.includes('wx:if') || lowerCode.includes('<button') && lowerCode.includes('{{')) {
    return 'wxml'
  }

  // 检测 LESS
  if ((lowerCode.includes('@') && lowerCode.includes(':')) ||
    lowerCode.includes('lighten(') || lowerCode.includes('darken(') ||
    lowerCode.includes('mix(') || (lowerCode.includes('{') && lowerCode.includes('&'))) {
    return 'less'
  }

  if (lowerCode.includes('function') || lowerCode.includes('const ') || lowerCode.includes('let ') || lowerCode.includes('=>')) {
    return 'javascript'
  }
  if (lowerCode.includes('public class') || lowerCode.includes('import java')) {
    return 'java'
  }
  if (lowerCode.includes('#include') || lowerCode.includes('int main')) {
    return 'c'
  }
  if (lowerCode.includes('def ') || lowerCode.includes('import ') || lowerCode.includes('print(')) {
    return 'python'
  }
  if (lowerCode.includes('<html') || lowerCode.includes('<!doctype')) {
    return 'html'
  }
  if (lowerCode.includes('{') && (lowerCode.includes('color:') || lowerCode.includes('margin:'))) {
    return 'css'
  }
  if (lowerCode.includes('select ') || lowerCode.includes('from ') || lowerCode.includes('where ')) {
    return 'sql'
  }

  return 'other'
}

// 移除注释的正则表达式
const getCommentRegexes = (lang: string) => {
  const regexes = []

  switch (lang) {
    case 'javascript':
      // 单行注释 //
      regexes.push(/\/\/.*$/gm)
      // 多行注释 /* */
      regexes.push(/\/\*[\s\S]*?\*\//g)
      break
    case 'java':
    case 'c':
      // 单行注释 //
      regexes.push(/\/\/.*$/gm)
      // 多行注释 /* */
      regexes.push(/\/\*[\s\S]*?\*\//g)
      break
    case 'python':
      // 单行注释 #
      regexes.push(/#.*$/gm)
      // 多行注释 """ """ 或 ''' '''
      regexes.push(/"""[\s\S]*?"""/g)
      regexes.push(/'''[\s\S]*?'''/g)
      break
    case 'html':
      // HTML 注释 <!-- -->
      regexes.push(/<!--[\s\S]*?-->/g)
      break
    case 'css':
      // CSS 注释 /* */
      regexes.push(/\/\*[\s\S]*?\*\//g)
      break
    case 'less':
      // LESS 注释：支持 CSS 风格的多行注释和单行注释
      regexes.push(/\/\*[\s\S]*?\*\//g)  // 多行注释 /* */
      regexes.push(/\/\/.*$/gm)          // 单行注释 //
      break
    case 'wxml':
      // WXML 注释：HTML 风格注释
      regexes.push(/<!--[\s\S]*?-->/g)
      break
    case 'sql':
      // 单行注释 --
      regexes.push(/--.*$/gm)
      // 多行注释 /* */
      regexes.push(/\/\*[\s\S]*?\*\//g)
      break
    default:
      // 通用注释格式
      regexes.push(/\/\/.*$/gm)
      regexes.push(/\/\*[\s\S]*?\*\//g)
      regexes.push(/#.*$/gm)
      regexes.push(/<!--[\s\S]*?-->/g)
      regexes.push(/--.*$/gm)
      break
  }

  return regexes
}

// 处理代码
const processCode = () => {
  if (!userInput.value.trim()) {
    ElMessage.warning('请输入或上传代码')
    return
  }

  loading.value = true

  try {
    let processedCode = userInput.value

    // 检测语言
    const detectedLang = codeLanguage.value === 'auto' ? detectLanguage(processedCode) : codeLanguage.value

    // 移除注释
    if (removeComments.value) {
      const commentRegexes = getCommentRegexes(detectedLang)
      commentRegexes.forEach(regex => {
        processedCode = processedCode.replace(regex, '')
      })
    }

    // 移除空行
    if (removeEmptyLines.value) {
      if (preserveIndentation.value) {
        // 保留缩进，只移除完全空白的行
        processedCode = processedCode.replace(/^\s*\n/gm, '')
      } else {
        // 移除所有空行
        processedCode = processedCode.replace(/^\s*[\r\n]/gm, '')
      }
    }

    // 清理多余的连续空行
    processedCode = processedCode.replace(/\n\s*\n\s*\n/g, '\n\n')

    // 去除首尾空白
    processedCode = processedCode.trim()

    result.value = processedCode

    ElMessage.success(`代码处理完成！检测到语言: ${languages.find(l => l.value === detectedLang)?.label || '未知'}`)
  } catch (error) {
    ElMessage.error('代码处理失败，请检查输入内容')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 文件上传处理
const handleFileUpload = (file: File) => {
  if (file.size > 5 * 1024 * 1024) { // 5MB 限制
    ElMessage.error('文件大小不能超过 5MB')
    return false
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    userInput.value = e.target?.result as string
    ElMessage.success('文件上传成功')
  }
  reader.onerror = () => {
    ElMessage.error('文件读取失败')
  }
  reader.readAsText(file, 'utf-8')

  return false // 阻止默认上传行为
}

// 复制结果
const copyResult = async () => {
  if (!result.value) {
    ElMessage.warning('没有可复制的内容')
    return
  }

  try {
    await navigator.clipboard.writeText(result.value)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动选择复制')
  }
}

// 下载结果
const downloadResult = () => {
  if (!result.value) {
    ElMessage.warning('没有可下载的内容')
    return
  }

  const blob = new Blob([result.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'cleaned_code.txt'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  ElMessage.success('文件下载中...')
}

// 清空内容
const clearAll = () => {
  ElMessageBox.confirm('确定要清空所有内容吗？', '确认清空', {
    type: 'warning',
  }).then(() => {
    userInput.value = ''
    result.value = ''
    ElMessage.success('已清空')
  }).catch(() => {
    // 用户取消清空操作
  })
}
</script>

<template>
  <div class="container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>代码清理工具</span>
          <el-button type="danger" plain size="small" @click="clearAll">清空</el-button>
        </div>
      </template>

      <!-- 输入区域 -->
      <div class="input-section">
        <div class="section-title">
          <span>代码输入</span>
          <el-upload :before-upload="handleFileUpload" :show-file-list="false"
            accept=".txt,.js,.ts,.java,.cpp,.c,.h,.py,.html,.css,.less,.wxml,.sql,.vue,.jsx,.tsx">
            <el-button type="primary" size="small" :icon="Upload">上传文件</el-button>
          </el-upload>
        </div>
        <el-input v-model="userInput" :rows="12" type="textarea" class="input" placeholder="请输入代码或点击上传文件按钮上传代码文件..."
          @keyup.ctrl.enter="processCode" />
      </div>

      <!-- 处理选项 -->
      <div class="options-section">
        <div class="options-row">
          <div class="option-group">
            <span class="option-label">编程语言：</span>
            <el-select v-model="codeLanguage" size="small" style="width: 180px">
              <el-option v-for="lang in languages" :key="lang.value" :label="lang.label" :value="lang.value" />
            </el-select>
          </div>

          <div class="option-group">
            <el-checkbox v-model="removeEmptyLines">移除空行</el-checkbox>
            <el-checkbox v-model="removeComments">移除注释</el-checkbox>
            <el-checkbox v-model="preserveIndentation" :disabled="!removeEmptyLines">保留缩进</el-checkbox>
          </div>

          <el-button type="primary" :loading="loading" @click="processCode">
            {{ loading ? '处理中...' : '开始处理' }}
          </el-button>
        </div>
      </div>

      <!-- 输出区域 -->
      <div class="output-section">
        <div class="section-title">
          <span>处理结果</span>
          <div class="action-buttons">
            <el-button type="success" size="small" :icon="DocumentCopy" :disabled="!result" @click="copyResult">
              复制
            </el-button>
            <el-button type="primary" size="small" :icon="Download" :disabled="!result" @click="downloadResult">
              下载
            </el-button>
          </div>
        </div>
        <el-input :model-value="result" :rows="12" type="textarea" class="output" placeholder="处理后的代码将在这里显示..."
          readonly />
      </div>

      <div class="tips">
        <el-text type="info" size="small">
          💡 提示：支持多种编程语言的注释格式，可以上传最大 5MB 的代码文件，按 Ctrl+Enter 快速处理
        </el-text>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-section,
.output-section {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 600;
  color: #303133;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.input,
.output {
  width: 100%;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
}

.options-section {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.options-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.option-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-label {
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
}

.tips {
  margin-top: 15px;
  text-align: center;
}

@media (max-width: 768px) {
  .options-row {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .option-group {
    justify-content: center;
  }

  .section-title {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
