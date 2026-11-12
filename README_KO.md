# Lazuel — Spine 2D 포트폴리오

참고 사이트의 넓은 여백, 차분한 색상, 영문 내비게이션과 서비스·경력·작업·프로세스·문의 흐름을 반영한 개인 포트폴리오입니다. 정적 HTML/CSS/JavaScript로 구성되어 GitHub Pages에 배포할 수 있습니다.

## 로컬 미리보기

Windows에서는 `START_PORTFOLIO.bat`을 실행하세요. 브라우저에서 `http://localhost:8001`이 열립니다. Python이 필요합니다. `index.html`을 직접 열면 브라우저 보안 정책으로 Spine 파일을 읽지 못할 수 있습니다.

## 포함된 Spine 작업

`assets/spine/Illust_Lazuel_PS/`의 JSON, ATLAS, PNG를 사용합니다. 데이터 버전은 Spine 4.1.08이며 `idle`, `point` 애니메이션이 카드와 첫 화면 미리보기에서 재생됩니다. CDN에서 Spine Web Player와 웹폰트를 불러오므로 미리보기에는 인터넷 연결이 필요합니다.

연락처와 별도 경력 정보는 ZIP에서 확인되지 않아 임의로 기재하지 않았습니다. 페이지 공개 전에 `index.html`의 문의 영역을 실제 이메일이나 SNS 링크로 연결하고, 추가할 경력이 있으면 Career 영역을 업데이트하세요.

## GitHub Pages 배포

1. 이 폴더의 파일 전체를 GitHub 저장소 최상위에 올립니다.
2. 저장소의 **Settings → Pages**에서 배포 소스로 `main` 브랜치와 `/ (root)`를 선택합니다.
3. 저장소의 Pages 주소가 준비되면 접속해 Spine 미리보기를 확인합니다.

공개 저장소에서는 Spine JSON, ATLAS, PNG 원본을 누구나 내려받을 수 있습니다. 공개해도 괜찮은 리소스만 배포하세요.
