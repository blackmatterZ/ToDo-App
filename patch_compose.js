const fs = require('fs');
let code = fs.readFileSync('docker-compose.yml', 'utf8');

code = code.replace("build: .", "image: your-dockerhub-username/todo-app:latest");

fs.writeFileSync('docker-compose.yml', code);
