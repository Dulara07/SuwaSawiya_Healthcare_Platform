import json
from sqlalchemy import create_engine, MetaData, select
from app.config import settings

engine = create_engine(settings.DATABASE_URL)
metadata = MetaData()
metadata.reflect(bind=engine)

result = {}
with engine.connect() as conn:
    for table_name, table in metadata.tables.items():
        try:
            sel = select(table)
            rows = conn.execute(sel).all()
            # convert rows to list of dicts
            cols = table.columns.keys()
            rows_list = [dict(zip(cols, row)) for row in rows]
            result[table_name] = rows_list
        except Exception as e:
            result[table_name] = {'error': str(e)}

print(json.dumps(result, default=str, indent=2))
