import { connect } from './firebase.js';
import { element, articleView, dateText } from './view.js';
import { readingTime, safeImage } from './core.js';
const $=s=>document.querySelector(s);
const message=$('#message'); let posts=[], visible=6;
function render() {
  const q=$('#search').value.toLowerCase().trim(), category=$('#category').value;
  const filtered=posts.filter(p=>(!category || p.category===category) && `${p.title} ${p.excerpt} ${p.body}`.toLowerCase().includes(q));
  $('#posts').replaceChildren();
  for (const p of filtered.slice(0,visible)) {
    const card=element('article','','post-card'); const url=`/blog.html?post=${encodeURIComponent(p.id)}`;
    if(safeImage(p.coverUrl)){const image=element('img');image.src=safeImage(p.coverUrl);image.alt='';image.loading='lazy';card.append(image);}
    const copy=element('div','','post-copy');const h=element('h2'); const a=element('a',p.title);a.href=url;h.append(a);
    const link=element('a','Read article →','tag');link.href=url;
    copy.append(element('span',p.category,'tag'),h,element('p',p.excerpt,'muted'),element('p',`${dateText(p)} · ${readingTime(p.body)} min read`,'meta'),link);card.append(copy);$('#posts').append(card);
  }
  $('#more').hidden=filtered.length<=visible;
  message.hidden=filtered.length>0;message.textContent=posts.length?'No articles match your search.':'No published articles yet. Check back soon.';
}
$('#search').addEventListener('input',()=>{visible=6;render();});$('#category').addEventListener('change',()=>{visible=6;render();});$('#more').onclick=()=>{visible+=6;render();};
try {
  const {store:s,db}=await connect();const id=new URLSearchParams(location.search).get('post');
  if(id){
    $('#listing').hidden=true;
    const snap=await s.getDoc(s.doc(db,'posts',id));
    if(!snap.exists() || snap.data().status!=='published') throw Error('Article not found or not published.');
    const p=snap.data();document.title=`${p.title} | Hammad Shahzad`;document.querySelector('meta[name="description"]').content=p.excerpt;
    const root=$('#article');root.hidden=false;articleView(root,p);
    const actions=element('div','','actions');const back=element('a','← All articles','btn btn-secondary');back.href='/blog.html';const share=element('button','Copy article link','btn btn-primary');
    share.onclick=async()=>{try{await navigator.clipboard.writeText(location.href);share.textContent='Link copied!';}catch{message.hidden=false;message.textContent='Copy this address: '+location.href;}};actions.append(back,share);root.append(actions);message.hidden=true;
  }else{
    // Query matches the public-read security rule; drafts never enter the response.
    const snap=await s.getDocs(s.query(s.collection(db,'posts'),s.where('status','==','published')));
    posts=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
    for(const c of [...new Set(posts.map(p=>p.category))].sort()){const o=element('option',c);o.value=c;$('#category').append(o);}render();
  }
}catch(e){message.hidden=false;message.textContent=e.code==='permission-denied'?'Article unavailable. Check that Firestore rules have been deployed.':e.message;}
