import os
import uvicorn

if __name__ == "__main__":
    # Zoho Catalyst passes the port as an environment variable
    # We must read it in Python rather than depending on bash expansion
    port_str = os.environ.get("X_ZOHO_CATALYST_LISTEN_PORT", "8000")
    try:
        port = int(port_str)
    except ValueError:
        port = 8000
    
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
