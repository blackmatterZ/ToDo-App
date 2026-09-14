const fs = require('fs');

let testCode = fs.readFileSync('frontend/src/pages/Todos.test.tsx', 'utf8');
testCode = testCode.replace("global.IntersectionObserver =", "(global as any).IntersectionObserver =");
fs.writeFileSync('frontend/src/pages/Todos.test.tsx', testCode);

let pageCode = fs.readFileSync('frontend/src/pages/Todos.tsx', 'utf8');
pageCode = pageCode.replace("import { IonSpinner, IonDatetime, IonDatetimeButton, IonModal } from '@ionic/react';", "import { IonSpinner } from '@ionic/react';");
fs.writeFileSync('frontend/src/pages/Todos.tsx', pageCode);
