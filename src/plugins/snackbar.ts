import { useSnackbar } from 'vuetify'

// 全局 snackbar 服务
export const snackbar = {
  show: (
    message: string,
    color: 'success' | 'error' | 'info' | 'warning' = 'error',
    timeout: number = 3000
  ) => {
    const { snackbar } = useSnackbar()
    snackbar({
      text: message,
      color,
      timeout,
      position: 'top-right',
    })
  },
}
