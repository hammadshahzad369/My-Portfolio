# Apna assignment demo record karne ka script

Provided walkthrough: `/workspace/portfolio-deliverables/firebase-blog-walkthrough.mp4` (English narration, Roman Urdu slides).

Firebase setup complete hone ke baad apni screen record karein:

1. Portfolio kholein aur Blog link click karein. Batayein: “Yeh mera public blog hai, visitors ko login nahi chahiye.”
2. Admin page par login karein. Password record na karein.
3. New article mein title, summary, category aur body likhein. YouTube URL aur cover image URL paste karein.
4. Preview dikhayein aur Draft save karein. Incognito tab mein dikhayein ke draft public list mein nahi hai.
5. Admin se Published save karein. Incognito refresh karke article aur video embed dikhayein.
6. Search aur category filter test karein. Article link copy karein.
7. Firebase Console mein Authentication user, posts collection aur rules samjhayein. Password/private credentials record na karein.
8. Code mein `firebase.js` connection, `admin.js` CRUD, `public.js` published query aur `firestore.rules` authorization dikhayein.
9. End mein GitHub repo aur verified Vercel blog URL dikhayein.

Explanation: “Firebase Authentication identity verify karta hai. Admin UID ka document Firestore rules mein write permission deta hai. Published posts public read hain aur drafts admin-only hain. Isliye sirf login screen hide karne par security depend nahi karti.”
