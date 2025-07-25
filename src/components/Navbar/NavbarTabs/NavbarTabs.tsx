import { useMediaQuery } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { Tabs } from 'src/components';
import { useActiveTabStore } from 'src/stores';
import { useNavbarTabs } from '.';

export const NavbarTabs = () => {
  const theme = useTheme();
  const { activeTab, setActiveTab } = useActiveTabStore();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md' as Breakpoint));
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const navbarTabs = useNavbarTabs();

  const containerStyles = {
    display: 'none',
    minWidth: 392,
    borderRadius: 28,
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
    },
    div: {
      height: '56px',
    },
    '.MuiTabs-indicator': {
      height: '48px',
      zIndex: '-1',
      borderRadius: '24px',
    },
  };
// Nel tuo componente di navigazione esistente, aggiungi questo link:
<Link href="/fees" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
  <span>💰</span>
  <span>Fee Dashboard</span>
</Link>
}

  const tabStyles = {
    height: '48px',
    width: '142px',
    borderRadius: '24px',
  };

  return (
    <Tabs
      data={navbarTabs}
      value={isDesktop ? activeTab : false}
      onChange={handleChange}
      ariaLabel="navbar-tabs"
      containerStyles={containerStyles}
      tabStyles={tabStyles}
    />
  );
};
