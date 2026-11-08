import { readFileSync } from 'node:fs';
import { test } from 'node:test';
const prefix=process.env.FIREBASE_TEST_DEPS;
const rules=await import(prefix ? `${prefix}/@firebase/rules-unit-testing/dist/esm/index.esm.js` : '@firebase/rules-unit-testing');
const fs=await import(prefix ? `${prefix}/firebase/firestore/dist/esm/index.esm.js` : 'firebase/firestore');
const {initializeTestEnvironment,assertFails,assertSucceeds}=rules;
const {doc,setDoc,getDoc,getDocs,collection,query,where,updateDoc,deleteDoc,serverTimestamp}=fs;
const env=await initializeTestEnvironment({projectId:'demo-portfolio',firestore:{rules:readFileSync(new URL('../firestore.rules',import.meta.url),'utf8')}});
const post=(status='draft')=>({title:'A lesson',excerpt:'Summary',body:'Hello world',category:'Code',coverUrl:'',youtubeUrl:'',status,authorId:'admin',createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
try{
 await env.withSecurityRulesDisabled(async ctx=>{await setDoc(doc(ctx.firestore(),'admins/admin'),{role:'admin'});});
 const admin=env.authenticatedContext('admin').firestore(),visitor=env.unauthenticatedContext().firestore(),user=env.authenticatedContext('ordinary').firestore();
 await test('admin creates draft and published posts',async()=>{await assertSucceeds(setDoc(doc(admin,'posts/draft'),post()));await assertSucceeds(setDoc(doc(admin,'posts/live'),post('published')));});
 await test('visitors read only published posts and matching queries',async()=>{await assertSucceeds(getDoc(doc(visitor,'posts/live')));await assertFails(getDoc(doc(visitor,'posts/draft')));await assertFails(getDocs(collection(visitor,'posts')));await assertSucceeds(getDocs(query(collection(visitor,'posts'),where('status','==','published'))));});
 await test('visitors and non-admin users cannot write or self-promote',async()=>{for(const db of [visitor,user]){await assertFails(setDoc(doc(db,'posts/attack'),post('published')));await assertFails(updateDoc(doc(db,'posts/live'),{title:'Hacked'}));await assertFails(deleteDoc(doc(db,'posts/live')));await assertFails(setDoc(doc(db,'admins/ordinary'),{role:'admin'}));}await assertFails(getDoc(doc(user,'posts/draft')));});
 await test('admin updates publish state but cannot mutate ownership or invalid data',async()=>{await assertSucceeds(updateDoc(doc(admin,'posts/draft'),{status:'published',updatedAt:serverTimestamp()}));await assertSucceeds(getDoc(doc(visitor,'posts/draft')));await assertFails(updateDoc(doc(admin,'posts/live'),{authorId:'ordinary',updatedAt:serverTimestamp()}));await assertFails(updateDoc(doc(admin,'posts/live'),{title:'',updatedAt:serverTimestamp()}));await assertSucceeds(deleteDoc(doc(admin,'posts/draft')));});
}finally{await env.cleanup();}
