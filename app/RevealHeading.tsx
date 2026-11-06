'use client';
import {useLayoutEffect,useRef,type HTMLAttributes} from 'react';
const letterDelay=(index:number,count:number,stagger:number)=>index*Math.min(stagger,count>1?600/(count-1):0);

type Tag='h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'p';
/** Keep React's text untouched; visual line copies are owned by this effect only. */
export default function Heading({as:Tag='h2',children,...props}:HTMLAttributes<HTMLHeadingElement>&{as?:Tag;"data-reveal"?:string|boolean}) {
 const letters=true,stagger=30;
 const source=useRef<HTMLSpanElement>(null),visual=useRef<HTMLSpanElement>(null);
 useLayoutEffect(()=>{
  const text=source.current,layer=visual.current,heading=text?.parentElement;
  if(!text||!layer||!heading)return;
  let active=true,frame=0,lastWidth=-1;
  const split=()=>{
   if(!active)return;
   layer.replaceChildren();
   const walker=document.createTreeWalker(text,NodeFilter.SHOW_TEXT);
   const chars:{node:Text;start:number;end:number;top:number}[]=[];
   let node:Node|null;
   const range=document.createRange();
   while((node=walker.nextNode())){
    const value=node.textContent??'';
    for(const part of new Intl.Segmenter('da',{granularity:'grapheme'}).segment(value)){
     const i=part.index,end=i+part.segment.length;
     range.setStart(node,i);range.setEnd(node,end);
     const rect=range.getBoundingClientRect();
     if(rect.height&&part.segment.trim())chars.push({node:node as Text,start:i,end,top:rect.top});
    }
   }
   const lines:typeof chars[]=[];
   for(const char of chars){
    const line=lines.at(-1);
    if(!line||Math.abs(line[0].top-char.top)>3)lines.push([char]);else line.push(char);
   }
   // Very long editable paragraphs keep the block reveal instead of creating thousands of masks.
   if(chars.length>1200&&!heading.matches('h1,h2,h3,h4,h5,h6')){heading.classList.remove('heading-lines-ready');return;}
   const origin=text.getBoundingClientRect();
   const units=letters?chars.map(char=>[char]):lines;
   units.forEach((line,index)=>{
    range.setStart(line[0].node,line[0].start);range.setEnd(line.at(-1)!.node,line.at(-1)!.end);
    const rect=range.getBoundingClientRect();
    const mask=document.createElement('span'),inner=document.createElement('span');
    mask.className=letters?'heading-char':'heading-line';inner.className=letters?'heading-char-inner':'heading-line-inner';
    if(letters&&line[0].node.parentElement){const style=getComputedStyle(line[0].node.parentElement);inner.style.font=style.font;inner.style.letterSpacing=style.letterSpacing;}
    if(letters){mask.style.width=`${rect.width}px`;inner.style.setProperty('--char-delay',`${letterDelay(index,units.length,stagger)}ms`);}
    mask.style.top=`${rect.top-origin.top}px`;mask.style.left=`${rect.left-origin.left}px`;
    mask.style.height=`${rect.height+origin.height*.001}px`;
    inner.style.setProperty('--line-delay',`calc(${index} * var(--motion-line-stagger,140ms))`);
    inner.style.animation="none";inner.style.transform="none";
    inner.append(range.cloneContents());mask.append(inner);layer.append(mask);
    const copy=document.createRange();copy.selectNodeContents(inner);
    inner.style.position="relative";inner.style.top=`${rect.top-copy.getBoundingClientRect().top}px`;
    inner.style.removeProperty("animation");inner.style.removeProperty("transform");
   });
   heading.classList.toggle('heading-lines-ready',lines.length>0);
  };
  const settle=(event:AnimationEvent)=>{if(event.animationName==='headingLetterArrival'&&event.target===layer.lastElementChild?.firstElementChild)heading.classList.add('reveal-settled');};
  heading.addEventListener('animationend',settle);
  const schedule=()=>{if(!active)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(split);};
  const resize=new ResizeObserver(entries=>{
   const width=entries[0].contentRect.width;
   if(Math.abs(width-lastWidth)<1)return;lastWidth=width;schedule();
  });resize.observe(text);
  const mutation=new MutationObserver(schedule);mutation.observe(text,{childList:true,subtree:true,characterData:true});
  document.fonts.ready.then(schedule);schedule();
  return()=>{active=false;cancelAnimationFrame(frame);resize.disconnect();mutation.disconnect();heading.removeEventListener('animationend',settle);layer.replaceChildren();heading.classList.remove('heading-lines-ready');};
 },[children,letters,stagger]);
 return <Tag {...props} data-reveal={typeof props['data-reveal']==='string'?props['data-reveal']:''} className={`line-heading ${props.className??''}`}><span className="heading-source" ref={source}>{children}</span><span className="heading-visual" ref={visual} aria-hidden="true"/></Tag>;
}
