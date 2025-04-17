import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import {AntDesignVueResolver,ElementPlusResolver} from "unplugin-vue-components/resolvers"
import ElementPlus from 'unplugin-element-plus/vite'
import { fileURLToPath, URL } from "url";
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
      },
    },
  },
  esbuild: {
    loader: "jsx",
    include: [
      "./src/**/*.jsx",
      "./src/**/*.tsx",
      "./node_modules/**/*.jsx",
      "./node_modules/**/*.tsx",
      // Add these lines to allow all .js files to contain JSX
      "./src/**/*.js",
      "./node_modules/**/*.js",

      // Add these lines to allow all .ts files to contain JSX
      "./src/**/*.ts",
      "./node_modules/**/*.ts"
    ]
  },
  plugins: [vue(),
    ElementPlus(),
    AutoImport({
      resolvers: [AntDesignVueResolver(), ElementPlusResolver()]
    }),
    Components({
      resolvers: [AntDesignVueResolver(),ElementPlusResolver()]
    }),
      ],
  resolve: {

    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '@assets', replacement: fileURLToPath(new URL('./src/assets', import.meta.url)) },
      { find: '@static', replacement: fileURLToPath(new URL('./src/static', import.meta.url)) },
      { find: '@router', replacement: fileURLToPath(new URL('./src/routes', import.meta.url)) },

      // "@": fileURLToPath(new URL("./src", import.meta.url)),

      // '@': path.resolve(__dirname, './src'),
    ],
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  }
})