import { AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';

const Navbar = () => {
  const navigate = useNavigate()
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
          Signup
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
