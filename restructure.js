const fs = require('fs');
const path = require('path');

// Create new directory structure
const directories = [
    'backend/controllers',
    'backend/middleware',
    'backend/models',
    'backend/routes',
    'backend/utils',
    'backend/config',
    'database/migrations'
];

// Create directories
directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

// Move files
const moves = [
    {
        from: 'app.js',
        to: 'backend/index.js'
    },
    {
        from: 'setup_tables.sql',
        to: 'database/setup.sql'
    },
    {
        from: '.env',
        to: 'backend/.env'
    }
];

moves.forEach(move => {
    const fromPath = path.join(__dirname, move.from);
    const toPath = path.join(__dirname, move.to);
    
    if (fs.existsSync(fromPath)) {
        fs.renameSync(fromPath, toPath);
    }
});

console.log('Project restructuring completed!'); 