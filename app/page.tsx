import {published} from '../lib/db';
import Portfolio from './Portfolio';
export const dynamic='force-dynamic';
export default async function Home(){return <Portfolio initial={await published()}/>;}
