import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment:'jsdom',
    globals:true,
    setupFiles:'./tests/setup.js'
  },
  server:{
    host:true,
    proxy:{
      "/api":{
        target:"http://localhost:5000",
        secure:(process.env.NODE_ENV === 'production') ? true : false,
        changeOrigin:true,
        configure:(proxy)=>{
          proxy.on('error', (err)=>{
            console.log(`Proxy Error Message: ${err}`);
          })
        }
      }
    }
  }
})
