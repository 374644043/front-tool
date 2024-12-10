/*
 * @Author: pangwei pw374644043@gmail.com
 * @Date: 2023-02-08 09:52:58
 * @LastEditors: pangwei pw374644043@gmail.com
 * @LastEditTime: 2023-12-05 10:55:53
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: process.env.VITE_BASE,
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    esbuild: { drop: [] },
    clearScreen: false,
  }
})
