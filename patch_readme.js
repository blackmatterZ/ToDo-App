const fs = require('fs');
let code = fs.readFileSync('README.md', 'utf8');

// Replace Run Application section
const oldRun = `### Run Application
Clone the repository and launch the container with a single command:

\`\`\`bash
git clone <repo-url>
cd interviewTask
docker compose up --build
\`\`\`

Access the app in your browser at: **[http://localhost:3000](http://localhost:3000)**`;

const newRun = `### Run Application
Clone the repository and launch the container with a single command:

\`\`\`bash
git clone <repo-url>
cd interviewTask
docker compose up -d
\`\`\`

Access the app in your browser at: **[http://localhost:3000](http://localhost:3000)**

*(Optional) If pulling the image from Docker Hub fails, you can build it manually:*
\`\`\`bash
docker build -t your-dockerhub-username/todo-app:latest .
docker compose up -d
\`\`\``;

code = code.replace(oldRun, newRun);

// Replace cross-platform table
code = code.replace(/docker compose up --build/g, 'docker compose up -d');

fs.writeFileSync('README.md', code);
