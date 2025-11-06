import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { createFileRoute } from '@tanstack/react-router'
import SearchBar from '../../components/Searchbar';
import { useEffect, useState } from 'react';
import type { EventsQueryParams, IEvent } from '../../models/models';
import { useUseQueries } from "../../hooks/useUseQueries";
import { formOptions, useForm } from "@tanstack/react-form";
import z from "zod";
import { useUseMutations } from "../../hooks/useUseMutations";

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: AdminDashBoard,
})

function AdminDashBoard() {
  const eventsPerPage = 7
  const [params, setParams] = useState<EventsQueryParams>({page: 1, size: eventsPerPage});
  const [title, setTitle] = useState<string>();
  const { removeEventMutation } = useUseMutations()
  const { useGetEvents } = useUseQueries();
  const { data, isLoading, refetch } = useGetEvents(params);
  const eventi = data?.data;
  const pagination = data?.pagination;

  type TRemoveEvent = {
    eventId: string
  }

  const removeEvent: TRemoveEvent = {
    eventId: ""
  }

  const formOpts = formOptions({
    defaultValues: removeEvent,
    validators: {
      onSubmit: z.object({
        eventId: z.string()
      })
    }
  })

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      try{
        await removeEventMutation
          .mutateAsync(value.eventId)
          .then(()=>{
            // alert
          })
          .catch((_)=>{
            // alert
          })
        
        await refetch()

      } catch (_){
         // alert
      }
    },
  })


  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setParams((state) => ({
      ...state,
      page: value
    }));
  };
  
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setParams((state) => ({
        ...state,
        page: 1,
        title: title ? title : undefined, 
      }));
    }, 500); 

    return () => {
      clearTimeout(debounceTimeout); 
    };
  }, [title]); 

  if(isLoading) 
    return <>Caricamento...</>

  if(!eventi)
    return <></>

  return (<>
      <Box
        sx={{
          background: "linear-gradient(135deg, #8fa785ff 0%, #42a5f5 100%)",
          color: "white",
          py: 2,
          textAlign: "center",
          borderRadius: "0 0 24px 24px",
          mb: 5,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
          Dashboard Admin
        </Typography>

        <Box
          sx={{
            width: "100%",
            maxWidth: 600,
            mx: "auto",
            backgroundColor: "white",
            borderRadius: "10px",
            p: 1
          }}
        >
          <SearchBar onSearch={(term) => setTitle(term)} />
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          p: 3,
          backgroundColor: "#f5f6fa",
          borderRadius: 3,
        }}
      >
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Nome evento
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Data
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "white", fontWeight: "bold" }}
                ></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {eventi.map((evento: IEvent) => {
                const dataFormattata = new Date(evento.date).toLocaleDateString(
                  "it-IT",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                );
                return (
                  <TableRow key={evento._id}>
                    <TableCell>{evento.title}</TableCell>
                    <TableCell>{dataFormattata}</TableCell>
                    <TableCell align="right">

                        <form.Field
                            name="eventId"
                            children={(field) => (<>
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                type="submit"
                                onClick={() => {
                                  field.setValue(evento._id)
                                  form.handleSubmit()
                                }}
                                sx={{
                                  borderRadius: "30px",
                                  textTransform: "none",
                                  fontWeight: "bold",
                                }}
                              >
                                Elimina
                              </Button>
                            </>)}
                        />




                    </TableCell>
                  </TableRow>
                );
              })}

              {eventi.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Nessun evento trovato
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>


        <Stack
          spacing={2}
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 3 }}
        >
          <Pagination
            count={pagination?.totPages || 1}
            page={params.page}
            onChange={handleChange}
            color="primary"
          />
        </Stack>
      </Box>
  </>)
}