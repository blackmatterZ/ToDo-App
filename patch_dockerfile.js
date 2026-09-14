const fs = require('fs');
let code = fs.readFileSync('Dockerfile', 'utf8');

const oldRun = `RUN npm ci --omit=dev && npm cache clean --force`;
const newRun = `RUN apk add --no-cache python3 make g++ && \\
    npm ci --omit=dev && npm cache clean --force && \\
    apk del python3 make g++`;

code = code.replace(oldRun, newRun);

fs.writeFileSync('Dockerfile', code);
