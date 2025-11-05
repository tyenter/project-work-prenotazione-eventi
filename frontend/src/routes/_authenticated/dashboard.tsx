import { Button } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { useAxios } from '../../hooks/useAxios'
import { useAuth } from '../../hooks/useAuth';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: AdminDashBoard,
})

function AdminDashBoard() {
  const axiosClient = useAxios();
  const {accessToken} = useAuth()


  return (<>
  <Button 
    onClick={async ()=>{
      try{
        await axiosClient.post("/admin", {}, { headers: { Authorization: `Bearer ${accessToken}` } });
      } catch (_){}
    }}
  >
    tmp
  </Button>
  </>)
}