TAMS Clean Stable v1

1) Cerrar puertos:
lsof -ti :3000 | xargs kill -9
lsof -ti :8080 | xargs kill -9

2) Backend:
cd ~/Desktop/tams-clean-stable-v1-2-monthfix/backend-render
npm install
npx playwright install chromium
npm start

3) Frontend:
cd ~/Desktop/tams-clean-stable-v1-2-monthfix/pwa-netlify
python3 -m http.server 8080

4) Abrir:
http://localhost:8080/?clean=1

Tests:
http://localhost:3000/api/health
http://localhost:3000/api/flight?number=1135&deep=1
http://localhost:3000/api/flight?number=1608&origin=AEP&destination=MDQ


V1.2 monthfix: corrige mes de PDF cuando el roster cruza de MAY a JUN.
