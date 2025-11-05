import { createFileRoute } from "@tanstack/react-router";
import { useUseQueries } from "../../hooks/useUseQueries";
import * as React from "react";
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
import CelebrationIcon from "@mui/icons-material/Celebration";
import SearchBar from "../../components/Searchbar";
import type { EventsQueryParams, IEvent } from "../../models/models";

export const Route = createFileRoute("/eventi/gestione")({
  component: RouteComponent,
});

function RouteComponent() {
  const eventsPerPage = 10;
  const [params, setParams] = React.useState<EventsQueryParams>({
    page: 1,
    size: eventsPerPage,
  });
  const [title, setTitle] = React.useState<string>();

  const { useGetEvents } = useUseQueries();
  const { data, isLoading } = useGetEvents(params);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setParams((state) => ({
      ...state,
      page: value,
    }));
  };

 
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setParams((state) => ({
        ...state,
        page: 1,
        title: title ? title : undefined,
      }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [title]);

  if (isLoading) return <>Caricamento...</>;

  const eventi = data?.data || [];
  const pagination = data?.pagination;

  

  return (
    <>
     
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          py: 2,
          textAlign: "center",
          borderRadius: "0 0 24px 24px",
          mb: 5,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
          Dashbord Admin
        </Typography>
        <Box
          sx={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            color: "#1976d2",
            fontSize: 100,
            width: 50,
            height: 50,
            borderRadius: "50%",
            mb: 3,
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          <CelebrationIcon sx={{ fontSize: 30 }} />
        </Box>

        <Typography
          variant="h6"
          sx={{
            mb: 3,
            maxWidth: 600,
            mx: "auto",
            fontWeight: 400,
            opacity: 0.9,
          }}
        >
          Visualizza e gestisci tutti gli eventi. Puoi cercare o eliminarli qui.
        </Typography>

        <Box
          sx={{
            width: "100%",
            maxWidth: 600,
            mx: "auto",
            backgroundColor: "white",
            borderRadius: "10px",
            p: 1,
            mt: 2,
            boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
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
                >
                  
                </TableCell>
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
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => (evento._id)}
                        sx={{
                          borderRadius: "30px",
                          textTransform: "none",
                          fontWeight: "bold",
                        }}
                      >
                        Elimina
                      </Button>
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
    </>
  );
}
