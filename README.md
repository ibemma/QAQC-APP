# Hallmark QAQC PWA

## Publish on GitHub Pages
1. Create a new GitHub repository (e.g. `hallmark-qaqc`).
2. Upload everything in this folder to the repository root (index.html, sw.js, manifest.webmanifest, icons/, vendor/, .nojekyll). Unzip first: GitHub's web uploader does not unpack zips.
3. Repository Settings > Pages > Source: "Deploy from a branch", Branch: `main`, folder `/ (root)` > Save.
4. After about a minute the app is live at `https://<your-username>.github.io/hallmark-qaqc/`.
5. Open that address on the phone (Chrome on Android: menu > Install app. Safari on iPhone: Share > Add to Home Screen).

## Updating later
Replace `index.html` in the repository, and change `CACHE_VERSION` in `sw.js` (e.g. `hallmark-qaqc-v2`) so installed phones fetch the new version.

## Notes
- Reports are saved in each device's browser storage; they are not shared between phones.
- The PDF and Word libraries are bundled in `vendor/`, so the app works with no internet.
