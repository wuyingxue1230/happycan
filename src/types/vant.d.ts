declare module '@vant/weapp/toast/index' {
  interface Toast {
    success(message: string): void;
    fail(message: string): void;
    clear(): void;
    loading(message: string): void;
    setDefaultOptions(options: any): void;
    resetDefaultOptions(): void;
  }
  
  const Toast: Toast;
  export default Toast;
}