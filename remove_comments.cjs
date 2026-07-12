const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove { /* comments */ } JSX comments
    content = content.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');
    
    // Remove /* comments */
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove // comments, but be careful not to remove urls like http://
    content = content.replace(/(?<!:)\/\/.*$/gm, '');
    
    fs.writeFileSync(file, content);
});
console.log('Comments removed');
