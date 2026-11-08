# Validation record

Passed locally:

- `node --test tests/core.test.mjs`: 4 tests; YouTube host/ID restrictions, unsafe image URL rejection, required field/size/status checks, reading time.
- Chromium/Playwright: unconfigured Firebase displays actionable message; admin dashboard stays locked; stored HTML cannot create script/image elements; YouTube iframe uses youtube-nocookie.com; mobile page fits 390px width; no uncaught JavaScript errors.
- Static HTTP server serves the app. Existing portfolio remains intact except for a Blog navigation link.

Firebase public web configuration is connected to portfolio-4e45c. Chromium successfully queried the live public posts collection (empty result) and loaded the signed-out admin login form with no uncaught JavaScript errors. Real admin login and CRUD still require the owner to sign in; the password has not been requested or used.

Security test suite: `tests/firestore.test.mjs` covers admin CRUD, anonymous published reads, draft privacy, query constraints, non-admin write denial, self-promotion denial and ownership protection. Rerun after network configuration was applied: all 4 emulator security tests passed. Earlier download restriction is resolved. These tests validate repository rules in an isolated demo project, not the exact rules deployed in the production console.

To run security tests without adding app dependencies:

```sh
mkdir -p /tmp/portfolio-validation
npm install --prefix /tmp/portfolio-validation @firebase/rules-unit-testing firebase firebase-tools
FIREBASE_TEST_DEPS=/tmp/portfolio-validation/node_modules \
  /tmp/portfolio-validation/node_modules/.bin/firebase emulators:exec \
  --project demo-portfolio --only firestore \
  'node --test tests/firestore.test.mjs'
```

Requires Java 21+ and access to the official Firebase emulator download. `demo-portfolio` is an emulator-only project, not a production account. Optional test tool versions are not application runtime dependencies.

The instructional MP4 explains architecture, setup and deployment with English synthesized narration and Roman Urdu captions. It is not a recording of a verified live Firebase deployment.
