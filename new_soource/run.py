"""
NagrikMitra AI - One-Click Launcher
Starts the FastAPI web server, initializes the database, and opens your browser.
"""

import sys
import os
import time
import socket
import webbrowser
import threading

def is_port_in_use(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def find_available_port(start_port: int = 8000) -> int:
    port = start_port
    while is_port_in_use(port):
        port += 1
    return port

def open_browser(url: str):
    time.sleep(1.2)
    print(f"Opening browser at: {url}")
    webbrowser.open(url)

def main():
    print("=" * 65)
    print("  🇮🇳 NagrikMitra AI — Government Citizen Services Assistant")
    print("  Initializing SQLite database and FastAPI backend server...")
    print("=" * 65)

    try:
        import uvicorn
        from backend.database import init_db
        init_db()
        print("✓ Database verified and seeded with 22+ official government schemes.")
    except ImportError as e:
        print(f"Error importing dependencies: {e}")
        print("Please run: pip install fastapi uvicorn")
        sys.exit(1)

    port = find_available_port(8000)
    server_url = f"http://127.0.0.1:{port}"

    print(f"✓ Starting web server at {server_url}")
    print("✓ Press Ctrl+C in this window to stop the server anytime.")

    # Auto-open browser in background thread
    threading.Thread(target=open_browser, args=(server_url,), daemon=True).start()

    from backend.app import app
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")

if __name__ == "__main__":
    main()
