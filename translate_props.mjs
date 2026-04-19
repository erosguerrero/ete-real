import fs from 'fs';
import path from 'path';

const translateMap = {
  "Status:": "Estado:",
  "Biography:": "Biografía:",
  "First Appearance:": "Primera Aparición:",
  "Relationships:": "Relaciones:",
  "Profession:": "Profesión:",
  "Gender:": "Género:",
  "Species:": "Especie:",
  "Faction:": "Facción:",
  "Residence:": "Residencia:"
};

const charactersDir = path.join(process.cwd(), 'content', 'Ete-real El último archipiélago', 'Personajes y NPCs', 'Personajes');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  const lines = content.split('\n');
  let inFrontmatter = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      inFrontmatter = !inFrontmatter;
      continue;
    }

    if (inFrontmatter) {
      for (const [eng, span] of Object.entries(translateMap)) {
        if (lines[i].startsWith(eng)) {
          lines[i] = lines[i].replace(eng, span);
          hasChanges = true;
        }
      }
    }
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`Translated properties in: ${path.basename(filePath)}`);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.md') || file.endsWith('.base')) {
      replaceInFile(fullPath);
    }
  }
}

processDirectory(charactersDir);
console.log('Done!');
