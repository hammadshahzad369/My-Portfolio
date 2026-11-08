import { connect } from './firebase.js';
import { validatePost } from './core.js';
import { element, articleView } from './view.js';
const $=s=>document.querySelector(s), form=$('#editor'), message=$('#message');
let api, editing=null, active=false, generation=0;
function notify(text){message.textContent=text;message.hidden=false;}
function clear(){editing=null;form.reset();$('#editor-title').textContent='New article';$('#preview').hidden=true;}
function values(){return Object.fromEntries(new FormData(form));}
function error(e){return ({'auth/invalid-credential':'Email or password is incorrect.','auth/too-many-requests':'Too many attempts. Please try again later.','permission-denied':'Permission denied. Check your admin UID and Firestore rules.','auth/network-request-failed':'Network unavailable. Please try again.'})[e.code]||e.message;}
async function load(){
  const ticket=generation, {store:s,db}=api; const snap=await s.getDocs(s.collection(db,'posts'));
  if(!active || ticket!==generation)return;
  const root=$('#my-posts');root.replaceChildren();
  for(const d of snap.docs.sort((a,b)=>(b.data().createdAt?.seconds||0)-(a.data().createdAt?.seconds||0))){
    const p=d.data(), row=element('div','','dashboard-item');row.append(element('h3',p.title),element('p',`${p.status} · ${p.category}`,'muted'));
    const actions=element('div','','actions'),edit=element('button','Edit','btn btn-secondary'),del=element('button','Delete','btn btn-secondary danger');
    edit.onclick=()=>{editing=d.id;for(const [k,v] of Object.entries(p)){if(form.elements.namedItem(k))form.elements.namedItem(k).value=v;}$('#editor-title').textContent='Edit article';form.scrollIntoView({behavior:'smooth'});$('#preview').hidden=true;};
    del.onclick=async()=>{if(!confirm(`Permanently delete “${p.title}”?`))return;del.disabled=true;try{await s.deleteDoc(s.doc(db,'posts',d.id));if(editing===d.id)clear();notify('Article deleted.');await load();}catch(e){notify(error(e));}finally{del.disabled=false;}};
    actions.append(edit,del);row.append(actions);root.append(row);
  }
  if(!snap.size)root.append(element('p','No articles yet. Create your first draft below.','empty'));
}
try{
  api=await connect();const {auth:a,session,store:s,db}=api;
  a.onAuthStateChanged(session,async user=>{
    const ticket=++generation;active=false;$('#dashboard').hidden=true;$('#login').hidden=true;$('#my-posts').replaceChildren();clear();
    if(!user){$('#login').hidden=false;notify('Sign in with your admin account.');return;}
    try{
      const admin=await s.getDoc(s.doc(db,'admins',user.uid));
      if(ticket!==generation)return;
      if(!admin.exists()){await a.signOut(session);notify('This account is not an administrator.');return;}
      active=true;$('#dashboard').hidden=false;notify('Signed in. Drafts are private until published.');await load();
    }catch(e){if(ticket===generation){$('#login').hidden=false;notify(error(e));}}
  });
  $('#login').onsubmit=async e=>{e.preventDefault();const button=e.submitter;button.disabled=true;try{await a.signInWithEmailAndPassword(session,$('#login').elements.email.value,$('#login').elements.password.value);$('#login').elements.password.value='';}catch(e){notify(error(e));}finally{button.disabled=false;}};
  $('#reset').onclick=async()=>{const email=$('#login').elements.email;if(!email.reportValidity()||!email.value)return;try{await a.sendPasswordResetEmail(session,email.value);notify('If this email has an account, a reset link will be sent.');}catch(e){notify(error(e));}};
  $('#logout').onclick=()=>a.signOut(session).catch(e=>notify(error(e)));
  $('#new').onclick=()=>{clear();form.scrollIntoView({behavior:'smooth'});};
  $('#preview-button').onclick=()=>{try{const p=validatePost(values());articleView($('#preview'),p);$('#preview').hidden=false;}catch(e){notify(error(e));}};
  form.onsubmit=async e=>{
    e.preventDefault();if(!active)return;const button=$('#save');button.disabled=true;
    try{const p=validatePost(values());const data={...p,updatedAt:s.serverTimestamp()};
      if(editing)await s.updateDoc(s.doc(db,'posts',editing),data);else await s.addDoc(s.collection(db,'posts'),{...data,authorId:session.currentUser.uid,createdAt:s.serverTimestamp()});
      clear();notify(p.status==='published'?'Article published. Visitors can read it now.':'Draft saved. Only admins can read it.');await load();
    }catch(e){notify(error(e));}finally{button.disabled=false;}
  };
}catch(e){notify(error(e));}
