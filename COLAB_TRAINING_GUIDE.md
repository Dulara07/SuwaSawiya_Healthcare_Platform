# SuwaSawiya ML Model Training in Google Colab

## Overview
This guide explains how to train the SuwaSawiya recommendation ML model using **Google Colab** instead of your local machine.

## Files
- **SuwaSawiya_ML_Training_Colab.ipynb** - The Jupyter notebook for Colab training

## Prerequisites
1. **Google Account** - Required for Google Colab and Drive access
2. **PostgreSQL Database** - Must be accessible from the internet OR have data exported
3. **Colab Link** - Open the notebook in Google Colab

## Step-by-Step Setup

### 1. Upload Notebook to Google Colab
**Option A: Direct Upload**
```
1. Go to https://colab.research.google.com
2. Click "Upload" tab
3. Select "SuwaSawiya_ML_Training_Colab.ipynb"
```

**Option B: From GitHub**
```
1. Go to https://colab.research.google.com
2. Click "GitHub" tab
3. Paste your repo URL (if notebook is in GitHub)
```

### 2. Configure Database Connection
Edit **Cell 5** (Database Configuration):
```python
DB_USER = "your_postgres_user"
DB_PASSWORD = "your_postgres_password"
DB_HOST = "your_database_host"
DB_PORT = "5432"
DB_NAME = "suwasawiya_db"
```

**For remote database from Colab:**
- Your database must allow connections from Colab's IP (or be publicly accessible)
- PostgreSQL must have `psycopg2` driver installed
- Update the connection string in Cell 5

**For local database:**
- Use **ngrok** or **ssh tunnel** to expose your local database:
  ```bash
  ngrok tcp 5432
  ```
  Then use ngrok's public URL in the connection string

### 3. Run the Notebook
Click "Run All" or run cells sequentially:

1. **Cell 1** - Environment setup
2. **Cell 2** - Library installation
3. **Cell 3** - Database connection test
4. **Cell 4** - Data loading
5. **Cell 5** - Model architecture
6. **Cell 6-7** - Training (main computation)
7. **Cell 8** - Evaluation
8. **Cell 9** - Save artifact

### 4. Retrieve the Trained Model

**Option A: Download from Colab**
```
1. Training saves to `/tmp/suwasawiya_artifacts/recommendation_artifact.json`
2. In Colab: Files → Download
3. Copy to your local: `Server/app/services/artifacts/`
```

**Option B: Save to Google Drive**
In Cell 11, uncomment:
```python
drive.mount('/content/drive')  # Uncomment to enable
# Then save to: /content/drive/MyDrive/SuwaSawiya/recommendation_artifact.json
```

**Option C: Display & Copy**
```python
# View the JSON in Cell 10
with open(artifact_path) as f:
    print(json.dumps(json.load(f), indent=2))
```

## Model Architecture

The notebook trains:
- **Collaborative Filtering (ALS)** - Learns from user-campaign interactions
- **Content-Based Filtering** - Uses text embeddings and campaign features
- **Hybrid Ranking** - Combines signals via logistic regression

### Training Parameters
- **Latent Dimensions**: 6
- **ALS Iterations**: 8
- **Regularization Lambda**: 0.08
- **Content Tokens**: All unique words from campaign descriptions

## Output Artifact Structure
```json
{
  "version": "1.0.0",
  "generated_at": "2026-06-17T...",
  "model_config": {
    "latent_dimensions": 6,
    "als_iterations": 8,
    "als_lambda": 0.08,
    "als_alpha": 18.0
  },
  "training_stats": {
    "total_users": 15,
    "total_campaigns": 100,
    "total_interactions": 45,
    "unique_tokens": 523,
    "sparsity_percent": 96.8
  },
  "idf_vocabulary": { ... }
}
```

## Deployment

### 1. Replace Local Artifact
```bash
# Copy trained artifact to backend
cp recommendation_artifact.json Server/app/services/artifacts/
```

### 2. Restart Backend
```bash
cd Server
python -m uvicorn app.main:app --reload
```

### 3. Test
```bash
curl http://localhost:8000/feed
# Should return ranked campaigns
```

## Troubleshooting

### Database Connection Fails
- ✅ Check credentials in Cell 5
- ✅ Ensure database is accessible from Colab's network
- ✅ For local DB: Use ngrok/ssh tunnel

### Out of Memory
- Colab has ~12GB RAM for free tier
- Reduce dataset: Comment out loading all campaigns
- Or use Colab Pro for more memory

### Training is Slow
- Normal: 1-2 minutes for 100+ campaigns
- Colab runs on CPU by default (no GPU needed for this)
- Click "Runtime" → "Change runtime type" → GPU if available

### Artifact Not Saved
- Check `/tmp/` directory in Files panel
- Colab deletes `/tmp/` after session ends
- **Always** save to Google Drive for persistence

## Example Database Export (Alternative)

If your database isn't internet-accessible, export locally:

```bash
# Export to CSV
psql -U user -d suwasawiya_db -c "COPY campaigns TO campaigns.csv CSV HEADER"
psql -U user -d suwasawiya_db -c "COPY donations TO donations.csv CSV HEADER"

# Upload CSVs to Colab, then modify cells to read from CSV instead
```

## Support
For issues, check:
- [Colab Documentation](https://colab.research.google.com/notebooks/welcome.ipynb)
- PostgreSQL connection: [psycopg2 docs](https://www.psycopg.org/psycopg3/)
- Model code: `Server/app/services/recommendations.py`
