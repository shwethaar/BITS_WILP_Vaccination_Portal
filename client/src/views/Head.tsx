import { Button, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import VaccinesIcon from '@mui/icons-material/Vaccines';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Head() {

    const navigate = useNavigate();

    return (<div style={{ display: 'flex', padding: '1.5rem', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <VaccinesIcon fontSize="large" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" alignItems='center' gutterBottom>Paatshala High School </Typography>
                <Typography variant="subtitle2" alignItems='center' gutterBottom> Health Portal</Typography>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <Link color="primary" underline="hover" variant="button" style={{ marginLeft: '0.5rem', marginRight: '0.5rem', padding: '0.25rem', border: '2px solid ', borderRadius: '10px' }} onClick={() => navigate('/dashboard')}>
                Dashboard
            </Link>
            <Link color="primary" underline="hover" variant="button" style={{ marginLeft: '0.5rem', marginRight: '0.5rem', padding: '0.25rem', border: '2px solid ', borderRadius: '10px' }} onClick={() => navigate('/students')}>
                Students
            </Link>
            <Link color="primary" underline="hover" variant="button" style={{ marginLeft: '0.5rem', marginRight: '0.5rem', padding: '0.25rem', border: '2px solid ', borderRadius: '10px' }} onClick={() => navigate('/vaccines')}>
                Vaccines
            </Link>
            <Link color="primary" underline="hover" variant="button" style={{ marginLeft: '0.5rem', marginRight: '0.5rem', padding: '0.25rem', border: '2px solid ', borderRadius: '10px' }} onClick={() => navigate('/vaccination-drives')}>
                Vaccination Drives
            </Link>

        </div>
        <hr style={{ width: '100%' }} />
    </div>
    );
}