import test from 'node:test';
import assert from 'node:assert/strict';
import {defaults,validateDocument} from '../lib/content.ts';
import {requireSameOrigin,readJSON} from '../lib/editor-request.ts';
test('default document and project edits round-trip',()=>assert.deepEqual(validateDocument(structuredClone(defaults)),defaults));
test('reject active content and malformed data',()=>{for(const patch of [{heroImage:'javascript:alert(1)'},{instagram:'data:text/html,test'},{foreground:'red'},{heroX:NaN},{projects:[{...defaults.projects[0],url:'javascript:alert(1)'}]},{projects:[defaults.projects[0],defaults.projects[0]]}])assert.throws(()=>validateDocument({...defaults,...patch}));});
test('accept uploaded media paths and HTTPS links',()=>assert.doesNotThrow(()=>validateDocument({...defaults,heroImage:'/media/12345678-1234-1234-1234-123456789abc',email:'hello@example.com'})));
test('same-origin is required for mutations',()=>{assert.doesNotThrow(()=>requireSameOrigin(new Request('https://portfolio.example/api/editor/content',{headers:{Origin:'https://portfolio.example'}})));assert.throws(()=>requireSameOrigin(new Request('https://portfolio.example/api/editor/content',{headers:{Origin:'https://attacker.example'}})));assert.throws(()=>requireSameOrigin(new Request('https://portfolio.example/api/editor/content')));});
test('JSON input limits cover actual streamed bytes',async()=>{const request=new Request('https://portfolio.example/api',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'x'.repeat(200)})});await assert.rejects(()=>readJSON(request,80),/too large/);});
