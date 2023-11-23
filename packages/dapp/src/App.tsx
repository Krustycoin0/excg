import { useEffect } from 'react';
import { AppProvider } from './AppProvider';
import { FeatureCards, WelcomeScreen } from './components';
import { Navbar } from './components/Navbar';
import { Menus } from './components/Navbar/Menu/Menus';
import { Widgets } from './components/Widgets';
import { useCookie3, useInitUserTracking } from './hooks';

export default function App() {
  const { initTracking } = useInitUserTracking();
  const cookie3 = useCookie3();

  useEffect(() => {
    initTracking({});
    cookie3?.trackPageView();
  }, [cookie3, initTracking]);
  console.log(`mode: ${import.meta.env.MODE}`);
  console.log(`url: ${import.meta.env.VITE_LIFI_API_URL}`);

  return (
    <AppProvider>
      <Navbar />
      <Menus />
      <Widgets />
      <WelcomeScreen />

      <FeatureCards />
    </AppProvider>
  );
}
