# SuwaSawiya New Frontend

This repository contains two separate apps:

- `Client/` for the Vite frontend
- `Server/` for the FastAPI backend and database scripts

## Backend startup

Run these commands from the `Server` directory, not from the project root:

```bash
cd Server
python create_db.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

If you run `uvicorn app.main:app` from the project root, Python cannot find the `app` package and you get `ModuleNotFoundError: No module named 'app'`.
