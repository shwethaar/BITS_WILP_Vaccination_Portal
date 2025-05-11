// import * as React from 'react';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';

// function Copyright() {
//   return (
//     <Typography
//       variant="body2"
//       align="center"
//       sx={{
//         color: 'text.secondary',
//       }}
//     >
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}.
//     </Typography>
//   );
// }

// export default function App() {
//   return (
//     <Container maxWidth="sm">
//       <Box sx={{ my: 4 }}>
//         <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
//           Material UI Vite.js example in TypeScript
//         </Typography>
//         <Copyright />

//       </Box>
//     </Container>
//   );
// }


import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './App.css';
import Student from './views/Student';
import Dashboard from './views/Dashboard';
import VaccinationDrives from './views/VaccinationDrives';
import Vaccines from './views/Vaccines';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './views/Login';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools').then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const queryClient = new QueryClient();


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (

    // <Box sx={{ width: '100%' }}>
    //   <h3 className='headerCss'>School Vaccination Dashboard</h3>
    //   <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    //     <Tabs value={value} onChange={handleChange} centered>
    //       <Tab label="Dashboard" {...a11yProps(0)} />
    //       <Tab label="Students" {...a11yProps(1)} />
    //       <Tab label="Vaccination Drives" {...a11yProps(2)} />
    //       <Tab label="Vaccinations" {...a11yProps(2)} />
    //     </Tabs>
    //   </Box>
    //   <CustomTabPanel value={value} index={0}>
    //     <Dashboard />
    //   </CustomTabPanel>
    //   <CustomTabPanel value={value} index={1}>
    //       <Student />
    //   </CustomTabPanel>
    //   <CustomTabPanel value={value} index={2}>
    //   <QueryClientProvider client={queryClient}>
    //       <VaccinationDrives/>
    //       <Suspense fallback={null}>
    //         <ReactQueryDevtoolsProduction />
    //       </Suspense>
    //     </QueryClientProvider>
    //   </CustomTabPanel>
    //   <CustomTabPanel value={value} index={3}>
    //       <Vaccines/>
    //   </CustomTabPanel>
    // </Box>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} index />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Student />} />
        <Route path="/vaccination-drives" element={<VaccinationDrives />} />
        <Route path="/vaccines" element={<Vaccines />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );

}
