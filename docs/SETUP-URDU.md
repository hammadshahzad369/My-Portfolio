# Firebase blog — Roman Urdu setup

Aapki website simple HTML, CSS aur JavaScript mein hai. Firebase do kaam karega: Authentication admin ko login karwayega; Cloud Firestore articles save karega. Vercel website serve karega. Visitors ko login ki zaroorat nahi.

## 1. Firebase project banayein

1. https://console.firebase.google.com kholein aur apne Google account se login karein.
2. **Add project / Create a project** select karein. Naam `hammad-portfolio` rakh sakte hain. Analytics is assignment ke liye optional hai; off bhi rakh sakte hain.
3. Project overview mein **Web app (`</>`)** register karein. App nickname `Portfolio Blog` rakhein. Firebase Hosting enable karna zaroori nahi, kyunke site Vercel par hai.
4. SDK setup mein **Config** select karein. `firebaseConfig` object ki public values root ke `firebase-config.js` mein paste karein. Is file mein pehle se empty fields hain. `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId` fill karein.
5. Yeh web config browser mein visible hota hai aur public ho sakta hai. **Password, service-account JSON aur private key kabhi GitHub/chat mein upload nahi karni.** Real security neeche diye rules se milti hai.

## 2. Sirf admin ka account

1. Firebase Console → **Build → Authentication → Get started**.
2. **Sign-in method → Email/Password** enable karke save karein. Email-link login ki zaroorat nahi.
3. **Users → Add user** mein apna admin email aur strong password set karein. Website par signup option nahi hai.
4. User ki **UID** copy karein. Yeh email se alag identifier hai.
5. Authentication → Settings → Authorized domains mein `hammadshahzad.vercel.app` add karein. Agar naya domain use karein to woh bhi add karein. Local testing ke liye `localhost` bhi add karna par sakta hai. Random preview domains ko admin access dena zaroori nahi.

## 3. Firestore database aur admin permission

1. **Build → Firestore Database → Create database**. Standard database `(default)` choose karein, location apne qareeb rakhein. **Production mode** choose karein.
2. **Rules** tab mein repository ki `firestore.rules` file ka poora text paste karein, phir **Publish**.
3. **Data → Start collection**: collection ID `admins` likhein.
4. Document ID mein step 2 wali **exact UID** paste karein. Ek field `role` (string) = `admin` add kar dein. Save karein.
5. `admins` documents sirf Console se manage honge. Website se koi apne aap ko admin nahi bana sakta. Document existence permission deti hai; `role` field sirf samajhne ke liye hai. Kisi aur UID ka document na banayein jab tak usko admin banana na ho.
6. `posts` collection pehla article save karne par khud ban jayegi. Test mode ya `allow write: if true` use na karein.

## 4. Local website chalayein

Terminal mein repository folder kholein:

```sh
python3 -m http.server 8000
```

Apne computer ke browser mein localhost port 8000 kholein. Files double-click karke `file://` se na chalayein; JavaScript modules ko HTTP chahiye. `/admin.html` par admin email/password se login karein. Agar cloud command sandbox socket block kare to supported execution approval use karein.

## 5. Blog upload/publish karein

1. **New article** select karein.
2. Title, summary, category aur body likhein. Body mein `# Heading`, `## Subheading`, `### Smaller heading` aur `- bullet` supported hain. Raw HTML execute nahi hota; full rich-text Markdown editor nahi hai.
3. Cover image ke liye publicly accessible **HTTPS image URL** paste karein. Is version mein local photo/file upload aur Firebase Storage nahi hai; blog text Firestore mein upload hota hai. Is se Storage billing setup ki zaroorat nahi padti.
4. YouTube ka `watch?v=...`, `youtu.be/...` ya `/shorts/...` URL paste karein. Safe YouTube embed article ke neeche dikhega. Kuch videos owner ki embedding restriction ki wajah se nahi chalti.
5. **Preview** dekhein. **Draft** select karke save karein: visitors ko nahi dikhega.
6. Edit karke visibility **Published** karein aur save karein. `/blog.html` par visitor article read, search, category filter aur link copy kar sakta hai.
7. Edit/delete admin dashboard mein hain. Delete permanent hai aur confirmation mangta hai. Password bhool jayein to login screen se reset email bhej sakte hain.

## 6. GitHub aur Vercel deployment

Aapka existing repository: https://github.com/hammadshahzad369/My-Portfolio
Existing portfolio: https://hammadshahzad.vercel.app/

Jab config fill aur local testing ho jaye, changes review karke apne repo mein commit/push karein:

```sh
git add index.html admin.html blog.html blog.css blog firebase-config.js firestore.rules firebase.json vercel.json docs tests README.md
git commit -m "Add Firebase admin blog to portfolio"
git push origin main
```

Vercel dashboard mein existing portfolio project kholein. Settings → Git mein confirm karein ke isi repo ki `main` branch connected hai. Framework **Other**, root directory repository root, build command blank aur output directory default rakhein. Static project ko npm build ki zaroorat nahi. Push par deployment automatic ho sakti hai; warna Deployments se latest commit deploy karein. Deployment Ready hone ke baad:

- Public blog: https://hammadshahzad.vercel.app/blog.html
- Admin: https://hammadshahzad.vercel.app/admin.html

Yeh **target URLs** hain. Jab tak aap deployment complete nahi karte, in URLs par naya feature live samajhna sahi nahi hoga. Firebase rules ka publication Vercel deploy se alag hai: rules Console mein bhi publish karne hain.

## 7. Assignment ki final checking

- Incognito visitor: published posts visible; drafts visible nahi; admin dashboard locked.
- Admin: login, new draft, preview, publish, edit aur delete test karein.
- YouTube embed aur mobile layout check karein.
- Doosra non-admin Firebase user bana kar login try karein: admin access deny hona chahiye.
- Final submission mein GitHub repo link, **verified live** blog link aur apna demo video dein. Password sirf authorized teacher ko secure channel par dein agar required ho, public README mein nahi.

## Aam errors

- **Blog setup is pending**: `firebase-config.js` empty hai.
- **Permission denied**: Firestore rules publish karein; admin UID ka exact document check karein; sahi Firebase project confirm karein.
- **Invalid credential**: email/password aur enabled Email/Password provider check karein.
- **Network unavailable / SDK load fail**: Firebase SDK ke liye `www.gstatic.com`, Auth ke liye `identitytoolkit.googleapis.com` aur `securetoken.googleapis.com`, database ke liye `firestore.googleapis.com` allowed hone chahiye. Cloud allowlist ki changes environment settings se hoti hain.
- Images load nahi hoti: actual public image URL use karein, webpage ka URL nahi.

## Is version ki boundaries

Search/category filters published articles ko browser mein filter karte hain; chhote assignment blog ke liye munasib hai. Large production blog ke liye server pagination aur search service chahiye. Comments, likes, image file uploads aur server-rendered social previews is version mein shamil nahi. Firestore usage quotas aur costs Firebase Console mein monitor karein.
