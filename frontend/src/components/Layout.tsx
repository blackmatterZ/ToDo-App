import React, { useEffect, useState } from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonPage,
  IonSearchbar,
} from '@ionic/react';
import { listOutline, folderOutline, pieChartOutline, moonOutline, sunnyOutline } from 'ionicons/icons';
import { useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode; onSearch?: (text: string) => void }> = ({ children, onSearch }) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const pages = [
    { title: 'Todos', path: '/todos', icon: listOutline },
    { title: 'Categories', path: '/categories', icon: folderOutline },
    { title: 'Statistics', path: '/statistics', icon: pieChartOutline },
  ];

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Todo App</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {pages.map((page, index) => (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem routerLink={page.path} routerDirection="none" color={location.pathname === page.path ? 'light' : ''}>
                  <IonIcon slot="start" icon={page.icon} />
                  <IonLabel>{page.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            ))}
          </IonList>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>
              {pages.find((p) => p.path === location.pathname)?.title || 'App'}
            </IonTitle>
            
            {onSearch && (
              <IonSearchbar 
                slot="end" 
                style={{ width: '300px', '--box-shadow': 'none', '--background': 'var(--surface)' }} 
                onIonInput={(e) => onSearch(e.detail.value!)} 
                debounce={300} 
                placeholder="Search todos..." 
              />
            )}

            <IonButtons slot="end">
              <IonButton onClick={toggleTheme}>
                <IonIcon icon={isDark ? sunnyOutline : moonOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        
        <IonContent className="ion-padding" style={{ '--background': 'var(--bg)' }}>
          {children}
        </IonContent>
      </IonPage>
    </>
  );
};

export default Layout;
