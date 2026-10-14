# Hallmark QAQC PWA

## Publish on GitHub Pages
1. Unzip this folder. Upload EVERYTHING inside it (index.html, sw.js, manifest.webmanifest, icons/, splash/, vendor/, .nojekyll) to the repository root. GitHub's web uploader does not unpack zips, and sw.js must not be empty (it must be about 3 KB).
2. Repository Settings > Pages > Source: "Deploy from a branch", Branch: `main`, folder `/ (root)` > Save.
3. The app is then live at `https://<your-username>.github.io/<repo>/`.

## Make it work offline (do this once per phone, while online)
1. Open the live address in Safari (iPhone) or Chrome (Android) and wait for "Ready to work offline".
2. If an old Home Screen icon exists, delete it, then Share > Add to Home Screen again.
3. From then on the app opens with no signal at all.

## Updating later
Replace `index.html` in the repository and change `CACHE_VERSION` in `sw.js` (e.g. `hallmark-qaqc-v11`). Phones update quietly the next time they are online.

## Notes
- Reports are stored on each device (offline first). OneDrive sync is planned as a later step.
