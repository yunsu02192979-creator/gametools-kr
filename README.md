# GameTools KR V2 — Deploy package

## 로컬 실행
`public/index.html`을 더블클릭합니다.

## GitHub
저장소 루트에 이 패키지의 `public` 폴더와 `README.md`를 업로드합니다.
GitHub 웹에서는 Add file > Upload files에서 폴더 드래그앤드롭이 가능합니다.

## Cloudflare Pages
- Production branch: main
- Framework preset: None
- Build command: 비워두기
- Build output directory: public

배포 후 발급된 `*.pages.dev` 주소를 기준으로 canonical과 sitemap.xml을 추가합니다.
