import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildAllEmailPreviews } from '../src/notifications/email-templates';

const outDir = join(__dirname, '..', 'email-previews');
mkdirSync(outDir, { recursive: true });

const previews = buildAllEmailPreviews('Dalaal-App');
for (const [name, html] of Object.entries(previews)) {
  writeFileSync(join(outDir, name), html, 'utf8');
  console.log('Wrote email-previews/' + name);
}
