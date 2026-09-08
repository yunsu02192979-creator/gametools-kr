# GameTools KR V5

V5 adds four search-focused calculator pages while keeping the original integrated sensitivity converter.

## New pages
- `/edpi-calculator/`
- `/cm360-calculator/`
- `/valorant-to-cs2/`
- `/cs2-to-valorant/`

## Deploy
Upload/replace the V5 files in the existing GitHub repository and commit. Cloudflare Builds should deploy automatically.

### Important
If your repository already contains the Google Search Console verification HTML file (for example `googleXXXXXXXX.html`) inside `public/`, keep it there. V5 does not include or replace that account-specific file.


## V5 변경사항
- Cloudflare Web Analytics를 5개 주요 페이지에 설치했습니다.
- Analytics token: d150062c061a4cf4803c296831609061
