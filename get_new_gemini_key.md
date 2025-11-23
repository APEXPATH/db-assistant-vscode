# Get New Gemini API Key

## Steps:
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Select your project (or create new one)
4. Copy the new API key
5. Replace in .env file

## Alternative (if above doesn't work):
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Create new API key
4. Copy and paste in .env

## Test with:
```bash
source venv/bin/activate
python test_gemini.py
```

The issue is likely:
- API key expired/invalid
- Wrong region/project settings
- Need to enable Gemini API in Google Cloud Console