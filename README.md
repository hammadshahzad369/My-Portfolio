# Hammad Shahzad — Portfolio & Firebase Blog

Static portfolio with a Firebase Authentication + Cloud Firestore blog. Visitors can read published posts, search, filter by category, load more cards, copy article links and view YouTube embeds. Admins can sign in, reset passwords, preview, create, edit, publish and delete articles. Drafts and write access are protected by Firestore rules, not only hidden controls.

**Start:** `python3 -m http.server 8000` from this directory. No npm install/build required.

**Setup:** [Roman Urdu instructions](docs/SETUP-URDU.md). Add public Firebase web configuration in `firebase-config.js`; create an Authentication user, add its UID under `admins`, and publish `firestore.rules`. No client-side service-account credentials.

**Tests:** `node --test tests/core.test.mjs`. Emulator security tests and browser checks are documented in [validation](docs/VALIDATION.md).

**Repository:** https://github.com/hammadshahzad369/My-Portfolio

**Existing site:** https://hammadshahzad.vercel.app/ — the new `/blog.html` and `/admin.html` routes require deployment of these changes and Firebase setup.

Articles use plain text with headings/bullets and HTTPS image URLs. There is no arbitrary HTML rendering, visitor signup, or image-file storage dependency.
