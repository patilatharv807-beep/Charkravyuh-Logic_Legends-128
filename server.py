"""
CHAKRAVYUH AI VIBE CODING CHALLENGE - SMART ENTC LEARNING PLATFORM
Python Web Server & API Handler
Author: ENTC Innovation Team
"""

import http.server
import socketserver
import json
import os
import sys

# Configure UTF-8 stdout if available
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class ENTCPlatformHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP handler serving the ENTC Learning Platform and REST API endpoints."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # API Health & Platform Metrics Endpoint
        if self.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            status_data = {
                "platform": "Smart ENTC Learning & Innovation Platform",
                "challenge": "CHAKRAVYUH AI VIBE CODING CHALLENGE 2026",
                "status": "online",
                "version": "1.0.0",
                "core_modules": [
                    "Digital Electronics",
                    "Logic Gates",
                    "Arduino",
                    "Sensors",
                    "IoT",
                    "Communication Systems",
                    "Microcontrollers",
                    "Signal Processing"
                ],
                "virtual_labs_count": 10,
                "progress_board": {
                    "status": "active",
                    "features": [
                        "Progress Details",
                        "Virtual Lab Report",
                        "Theory Notes Completed",
                        "Components Pricing (BOM)",
                        "Components Working",
                        "Components Output with Connection"
                    ]
                },
                "ai_assistant": "CircuitBot v1.0 (Active)"
            }
            self.wfile.write(json.dumps(status_data, indent=2).encode('utf-8'))
            return

        # Default static file serving
        return super().do_GET()

    def end_headers(self):
        # Add caching and security headers
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


def run_server():
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), ENTCPlatformHandler) as httpd:
        print("=" * 70)
        print("  SMART ENTC LEARNING & INNOVATION PLATFORM")
        print("  CHAKRAVYUH AI VIBE CODING CHALLENGE 2026")
        print("=" * 70)
        print(f"  [*] Local Server Running At: http://localhost:{PORT}")
        print(f"  [*] API Status Endpoint:    http://localhost:{PORT}/api/status")
        print("  Press Ctrl+C to stop the server.")
        print("=" * 70)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  Shutting down server gracefully...")
            httpd.server_close()
            sys.exit(0)


if __name__ == '__main__':
    run_server()
