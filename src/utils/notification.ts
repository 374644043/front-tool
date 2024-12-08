/*
 * @Author: pangwei pw374644043@gmail.com
 * @Date: 2023-02-09 16:34:14
 * @LastEditors: pangwei pw374644043@gmail.com
 * @LastEditTime: 2023-03-13 14:46:04
 */
import { ElMessage } from 'element-plus'
import { h } from 'vue'
import { ERRORINFO } from '../consts'
import ErrorMsg from './errorMsg.vue'

export const error = (code: keyof typeof ERRORINFO, description: string) =>
  ElMessage({
    type: 'error',
    message: h(ErrorMsg, { props: { msg: ERRORINFO[code], description } }),
  })
export const success = (msg: string) =>
  ElMessage({
    type: 'success',
    message: msg,
  })
