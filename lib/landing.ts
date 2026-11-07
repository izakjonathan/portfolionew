export const landingTitle='Design and\nDevelopment';
export const landingServices='Websites\nGraphic design\nBranding\nConcept development\nWeb apps';
export function serviceWords(text:string){return [...new Set(text.split('\n').map(word=>word.trim()).filter(Boolean))];}
