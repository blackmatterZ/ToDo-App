const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/Todos.tsx', 'utf8');

const oldDisplay = `{todo.dueAt && (
                    <span style={{ 
                      fontSize: '0.85rem', 
                      marginTop: '4px',
                      color: isOverdue ? 'var(--accent-warning)' : 'color-mix(in srgb, var(--text) 60%, transparent)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      📅 {formatDate(todo.dueAt)} {isOverdue && <span style={{fontWeight: 600}}>(Overdue)</span>}
                    </span>
                  )}`;

const newDisplay = `<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: 'color-mix(in srgb, var(--text) 50%, transparent)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      📝 Created: {formatDate(todo.createdAt)}
                    </span>
                    {todo.dueAt && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: isOverdue ? 'var(--accent-warning)' : 'color-mix(in srgb, var(--text) 50%, transparent)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        📅 Due: {formatDate(todo.dueAt)} {isOverdue && <span style={{fontWeight: 600}}>(Overdue)</span>}
                      </span>
                    )}
                  </div>`;

code = code.replace(oldDisplay, newDisplay);
fs.writeFileSync('frontend/src/pages/Todos.tsx', code);
