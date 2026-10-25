import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Windows에서 localhost가 IPv6(::1)로만 열려 접속이 안 되는 문제 방지
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    open: true,
  },
});
