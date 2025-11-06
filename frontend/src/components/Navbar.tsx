import { AppBar, Toolbar, Button, Box, Avatar, Typography } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'
import { useLogout } from '../hooks/useLogout'



const Navbar = () => {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const { logout } = useLogout()

  

  
  // const user = {
  //   firstName: 'Mario',
  //   lastName: 'Rossi',
  // }

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>

        
  <Box display="flex" alignItems="center">
    {/* {accessToken && user && (
      <Box display="flex" flexDirection="column" alignItems="center" mr={2}>
        <Avatar
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
            width: 40,
            height: 40,
            fontWeight: 'bold',
            mb: 0.5,
          }}
        >
          {user.firstName?.[0]}
          {user.lastName?.[0]}
        </Avatar>
        <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1 }}>
          {user.firstName} {user.lastName}
        </Typography>
      </Box>
    )} */}

    <Button color="inherit" onClick={() => navigate({ to: '/eventi' })}>
      Home
    </Button>

    {!accessToken && (
      <>
        <Button
          color="inherit"
          onClick={() =>
            navigate({
              to: '/login',
              search: { redirect: location.pathname + location.search },
            })
          }
        >
          Login
        </Button>

        <Button color="inherit" onClick={() => navigate({ to: '/signup' })}>
          Registrati
        </Button>
      </>
    )}

    {accessToken && (
      <Button
        color="inherit"
        onClick={async () => {
          await logout()
          navigate({ to: '/eventi' })
        }}
      >
        Logout
      </Button>
    )}
  </Box>
</Toolbar>
    </AppBar>
  )
}

export default Navbar
