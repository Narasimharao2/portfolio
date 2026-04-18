# StyleAI Frontend

React + Vite frontend for the StyleAI virtual outfit try-on app.

## Features
- Image upload with local preview
- Style selector (casual, formal, party, celebrity-inspired)
- AI generation request trigger
- Loading state while processing
- Result panel with download/share/retry
- Affiliate "Buy This Outfit" link support
- Responsive UI for desktop/mobile

## Run locally

```bash
cd styleai/frontend
npm install
cp .env.example .env
npm run dev
```

Set API URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```
