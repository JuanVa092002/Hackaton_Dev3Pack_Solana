import uvicorn
import os
import sys

if __name__ == "__main__":

    uvicorn.run(
        "apps.backend.api:app",
        host="0.0.0.0",
          port=8000, 
          reload=False,
          proxy_headers=True
          )