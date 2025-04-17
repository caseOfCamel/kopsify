// Run this with: node fix-modules.js
const fs = require('fs');
const path = require('path');

const nodeModules = path.join(__dirname, 'node_modules');
const srcNodeModules = path.join(__dirname, 'src', 'node_modules');

// Create src/node_modules directory if it doesn't exist
if (!fs.existsSync(srcNodeModules)) {
  console.log('Creating src/node_modules directory...');
  fs.mkdirSync(srcNodeModules, { recursive: true });
}

// Create symlink for react-refresh
const reactRefreshPath = path.join(nodeModules, 'react-refresh');
const reactRefreshSymlink = path.join(srcNodeModules, 'react-refresh');

if (fs.existsSync(reactRefreshPath) && !fs.existsSync(reactRefreshSymlink)) {
  console.log('Creating symlink for react-refresh...');
  
  try {
    // Use relative path for the symlink to make it more portable
    const relativeTarget = path.relative(
      path.dirname(reactRefreshSymlink),
      reactRefreshPath
    );
    
    // Create symlink
    fs.symlinkSync(
      relativeTarget, 
      reactRefreshSymlink, 
      'junction'
    );
    
    console.log('Symlink created successfully!');
  } catch (err) {
    console.error('Error creating symlink:', err.message);
    console.log('\nAlternative solution:');
    console.log('1. Try running this script with administrator privileges');
    console.log('2. Or manually copy the react-refresh directory:');
    console.log(`   cp -r "${reactRefreshPath}" "${srcNodeModules}"`);
  }
} else {
  console.log('React-refresh directory not found or symlink already exists.');
}

console.log('\nNext steps:');
console.log('1. Delete your node_modules/.cache directory');
console.log('2. Restart your development server with npm start');