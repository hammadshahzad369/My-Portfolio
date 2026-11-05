import {test} from 'node:test';
import assert from 'node:assert/strict';
import {youtubeId,safeImage,readingTime,validatePost} from '../blog/core.js';
test('YouTube URLs are restricted to real HTTPS YouTube hosts and IDs',()=>{
 for(const url of ['https://youtu.be/dQw4w9WgXcQ','https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=5','https://youtube.com/shorts/dQw4w9WgXcQ'])assert.equal(youtubeId(url),'dQw4w9WgXcQ');
 for(const url of ['javascript:alert(1)','https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ','http://youtu.be/dQw4w9WgXcQ','https://youtu.be/invalid'])assert.equal(youtubeId(url),'');
});
test('unsafe cover URLs are rejected',()=>{assert.equal(safeImage('javascript:alert(1)'),'');assert.equal(safeImage('data:text/html,test'),'');assert.equal(safeImage('https://example.com/image.jpg'),'https://example.com/image.jpg');});
test('post validation catches invalid article data',()=>{
 const p={title:'Hello',excerpt:'Summary',body:'Article',category:'Code',coverUrl:'',youtubeUrl:'',status:'draft'};
 assert.equal(validatePost(p),p);
 for(const patch of [{title:''},{body:''},{status:'private'},{youtubeUrl:'https://evil.test/a'},{coverUrl:'http://example.com/x'},{excerpt:'a'.repeat(401)}])assert.throws(()=>validatePost({...p,...patch}));
});
test('reading time rounds up',()=>assert.equal(readingTime('word '.repeat(201)),2));
