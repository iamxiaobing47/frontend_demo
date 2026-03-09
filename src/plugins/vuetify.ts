import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// 自定义配色方案 - 现代清新风格
const customColors = {
  primary: '#4361ee', // 活力蓝
  secondary: '#3f37c9', // 深邃紫
  accent: '#4cc9f0', // 清新青
  error: '#e63946', // 警示红
  info: '#4895ef', // 信息蓝
  success: '#2a9d8f', // 成功绿
  warning: '#f4a261', // 警告橙
  background: '#f8f9fa', // 背景色
  surface: '#ffffff', // 表面色
  textPrimary: '#212529', // 主要文字
  textSecondary: '#6c757d', // 次要文字
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: customColors,
      },
    },
  },
})
