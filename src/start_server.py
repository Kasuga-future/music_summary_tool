#!/usr/bin/env python3
"""
音乐总结工具 - 本地服务器启动脚本
Music Summary Tool - Local Server Starter

使用方法 / Usage:
    python start_server.py

服务器启动后，在浏览器中打开 http://localhost:7999
After the server starts, open http://localhost:7999 in your browser
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# 配置
PORT = 7999
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # 添加 CORS 头以支持字体和资源加载
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()

    def log_message(self, format, *args):
        # 美化日志输出
        print(f"[Server] {args[0]}")


def main():
    os.chdir(DIRECTORY)

    print("=" * 50)
    print("🎵 音乐总结工具 - Music Summary Tool")
    print("=" * 50)
    print(f"📁 工作目录: {DIRECTORY}")
    print(f"🌐 服务器地址: http://localhost:{PORT}")
    print("=" * 50)
    print("按 Ctrl+C 停止服务器")
    print("=" * 50)

    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            # 自动打开浏览器
            webbrowser.open(f"http://localhost:{PORT}/index.html")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n服务器已停止。")
        sys.exit(0)
    except OSError as e:
        if e.errno == 10048:  # Windows: Address already in use
            print(f"\n❌ 错误: 端口 {PORT} 已被占用")
            print(f"请尝试关闭占用该端口的程序，或修改脚本中的 PORT 变量")
        else:
            raise


if __name__ == "__main__":
    main()
