import { AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { useLogout } from '../hooks/useLogout';

const Navbar = () => {
  const navigate = useNavigate()
  const {accessToken} = useAuth()
  const {logout} = useLogout()
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Button color="inherit" onClick={()=>navigate({to: "/eventi"})}>
          Home
        </Button>
        <Button color="inherit" onClick={()=>navigate({to: "/login"})}>
          Login
        </Button>
        <Button color="inherit" onClick={()=>navigate({to: "/signup"})}>
          Registrati
        </Button>
        {   accessToken ?
            <Button color="inherit" onClick={async () => {
                await logout()
                navigate({to: "/eventi"})
            }}>
                Logout
            </Button>
            :<></>
        }
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
