# GameTools KR V4

V4 adds four search-focused calculator pages while keeping the original integrated sensitivity converter.

## New pages
- `/edpi-calculator/`
- `/cm360-calculator/`
- `/valorant-to-cs2/`
- `/cs2-to-valorant/`

## Deploy
Upload/replace the V4 files in the existing GitHub repository and commit. Cloudflare Builds should deploy automatically.

### Important
If your repository already contains the Google Search Console verification HTML file (for example `googleXXXXXXXX.html`) inside `public/`, keep it there. V4 does not include or replace that account-specific file.
