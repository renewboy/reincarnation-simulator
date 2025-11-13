import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-identifier'

const isProd = process.env.BUILD_MODE === 'prod'
export default defineConfig({
  plugins: [
    react(), 
    sourceIdentifierPlugin({
      enabled: !isProd,
      attributePrefix: 'data-matrix',
      includeProps: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

import WebSocket from 'ws';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 5173 });

function rawDataToString(msg: WebSocket.RawData): string {
  if (typeof msg === 'string') return msg;
  if (msg instanceof Buffer) return msg.toString('utf8');
  if (Array.isArray(msg)) {
    // Buffer[]
    return Buffer.concat(msg).toString('utf8');
  }
  // ArrayBuffer 或其他（把它转成 Buffer 再解码）
  return Buffer.from(msg as ArrayBuffer).toString('utf8');
}

// 使用示例
wss.on('connection', (ws) => {
  ws.on('message', (msg: WebSocket.RawData) => {
    const text = rawDataToString(msg);
    console.log('[browser]', text);
    
  });
});
