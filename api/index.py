"""
Vercel serverless entry point.
Wraps the existing FastAPI app from Backend/main.py so Vercel's
@vercel/python runtime can serve it under /api.
"""
import sys
import os

# ── Path setup ──
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(ROOT_DIR, "Backend")

if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# ── Vercel uses a read-only filesystem; redirect uploads to /tmp ──
os.environ["UPLOAD_FOLDER"] = "/tmp/uploads"
os.makedirs("/tmp/uploads", exist_ok=True)

# ── Import the existing FastAPI app ──
import Backend.main as _main_module  # noqa: E402

# Override upload folder BEFORE any requests are handled
_main_module.UPLOAD_FOLDER = "/tmp/uploads"

_backend_app = _main_module.app


# ── ASGI middleware that strips the /api prefix ──
# Vercel routes /api/predict → this function, but the FastAPI app only
# knows routes at / and /predict.  This middleware normalises the path.
class _StripApiPrefix:
    def __init__(self, app, prefix: str = "/api"):
        self.app = app
        self.prefix = prefix

    async def __call__(self, scope, receive, send):
        if scope["type"] in ("http", "websocket"):
            path: str = scope.get("path", "")
            if path.startswith(self.prefix):
                scope = dict(scope)
                scope["path"] = path[len(self.prefix):] or "/"
        await self.app(scope, receive, send)


# Vercel looks for the `app` variable in this module.
app = _StripApiPrefix(_backend_app)
