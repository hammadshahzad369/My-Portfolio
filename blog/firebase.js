import { firebaseConfig } from '../firebase-config.js';
export async function connect() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) throw Error('Blog setup is pending. Follow docs/SETUP-URDU.md to connect Firebase.');
  const base = 'https://www.gstatic.com/firebasejs/11.10.0/';
  const [app, auth, store] = await Promise.all([import(base+'firebase-app.js'), import(base+'firebase-auth.js'), import(base+'firebase-firestore.js')]);
  const instance = app.initializeApp(firebaseConfig);
  return { auth, store, session: auth.getAuth(instance), db: store.getFirestore(instance) };
}
