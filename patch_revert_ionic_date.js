const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/Todos.tsx', 'utf8');

const oldModal = `<IonDatetimeButton datetime="dueAt-add" />
          <IonModal keepContentsMounted={true}>
            <IonDatetime 
              id="dueAt-add"
              presentation="date"
              value={newDueAt}
              onIonChange={e => setNewDueAt(e.detail.value as string)}
              showClearButton={true}
            />
          </IonModal>`;

const newStyledInput = `<div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '10px', pointerEvents: 'none', fontSize: '1.1rem' }}>📅</span>
            <input 
              type="date"
              value={newDueAt}
              onChange={e => setNewDueAt(e.target.value)}
              style={{
                padding: '10px 12px 10px 38px',
                borderRadius: '8px',
                border: '1px solid color-mix(in srgb, var(--text) 20%, transparent)',
                background: 'color-mix(in srgb, var(--surface) 50%, var(--background))',
                color: 'var(--text)',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: '150px'
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'color-mix(in srgb, var(--text) 20%, transparent)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>`;

code = code.replace(oldModal, newStyledInput);
fs.writeFileSync('frontend/src/pages/Todos.tsx', code);
