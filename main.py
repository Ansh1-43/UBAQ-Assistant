"""
AuraGuard - Winter Smog & Urban Air Intelligence Assistant
Main application launcher
"""

import sys
import os
import uvicorn

def main():
    port = 8000
    host = "127.0.0.1"
    
    print("=" * 65)
    print("  🛡️  AURAGUARD AI: Winter Smog & Urban Air Intelligence Assistant")
    print("=" * 65)
    print(f"  Starting local server at: http://{host}:{port}")
    print("  Press Ctrl+C to stop the server.")
    print("=" * 65)
    
    # Run uvicorn server
    uvicorn.run("server:app", host=host, port=port, log_level="info", reload=False)

if __name__ == "__main__":
    main()
