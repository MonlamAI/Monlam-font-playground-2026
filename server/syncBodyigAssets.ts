/**
 * One-shot: replace CMS DB font/keyboard rows with Bodyig 4.0.1 local assets.
 * Usage: npx tsx server/syncBodyigAssets.ts
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { openDatabase } from './db';
import { reseedBodyigAssets } from './seed';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const db = openDatabase();
reseedBodyigAssets(db);
db.close();
console.log('Done.');
