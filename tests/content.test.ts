import test from 'node:test';
import assert from 'node:assert/strict';
import {defaults,validateDocument,importOldPortfolio} from '../lib/content.ts';
import {requireSameOrigin,readJSON} from '../lib/editor-request.ts';
test('default document and project edits round-trip',()=>assert.deepEqual(validateDocument(structuredClone(defaults)),defaults));
test('reject active content and malformed data',()=>{for(const patch of [{heroImage:'javascript:alert(1)'},{instagram:'data:text/html,test'},{foreground:'red'},{heroX:NaN},{projects:[{...defaults.projects[0],url:'javascript:alert(1)'}]},{projects:[defaults.projects[0],defaults.projects[0]]}])assert.throws(()=>validateDocument({...defaults,...patch}));});
test('accept uploaded media paths and HTTPS links',()=>assert.doesNotThrow(()=>validateDocument({...defaults,heroImage:'/media/12345678-1234-1234-1234-123456789abc',email:'hello@example.com'})));
test('same-origin is required for mutations',()=>{assert.doesNotThrow(()=>requireSameOrigin(new Request('https://portfolio.example/api/editor/content',{headers:{Origin:'https://portfolio.example'}})));assert.throws(()=>requireSameOrigin(new Request('https://portfolio.example/api/editor/content',{headers:{Origin:'https://attacker.example'}})));assert.throws(()=>requireSameOrigin(new Request('https://portfolio.example/api/editor/content')));});
test('JSON input limits cover actual streamed bytes',async()=>{const request=new Request('https://portfolio.example/api',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'x'.repeat(200)})});await assert.rejects(()=>readJSON(request,80),/too large/);});

test('old portfolio import preserves styling and custom content and is idempotent',()=>{
 const current={...structuredClone(defaults),background:'#102030',foreground:'#efefef',about:'Custom biography',email:'custom@example.com',heroImage:'https://example.com/hero.webp',motion:false};
 const result=importOldPortfolio(current);assert.deepEqual(importOldPortfolio(result),result);for(const key of ['background','foreground','about','email','heroImage','motion'] as const)assert.equal(result[key],current[key]);assert.equal(result.projects.filter(p=>p.id==='bar-os').length,1);assert.ok(result.projects.find(p=>p.id==='bar-os')?.challenge);assert.equal(result.services.length,3);
});
test('documents from before services and case studies still load safely',()=>{
 const old={...structuredClone(defaults)} as Record<string,unknown>;delete old.services;delete old.profileImage;const result=validateDocument(old);assert.deepEqual(result.services,[]);assert.equal(result.profileImage,'');assert.throws(()=>validateDocument({...old,services:[{id:'oops'}]}));assert.throws(()=>validateDocument({...old,profileImage:'javascript:alert(1)'}));
});

test('landing content defaults keep existing published documents compatible',()=>{
 const old={...structuredClone(defaults)} as Record<string,unknown>;delete old.landingTitle;delete old.landingServices;
 const result=validateDocument(old);assert.equal(result.landingTitle,'Design and\nDevelopment');assert.match(result.landingServices,/Concept development/);assert.throws(()=>validateDocument({...old,landingServices:'x'.repeat(81)}));
});
