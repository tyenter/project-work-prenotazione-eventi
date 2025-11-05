import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useUseQueries } from "../../hooks/useUseQueries";
import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Pagination,
  Stack,
  Button,
  Box,
  withTheme,
  CardMedia,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import { useState } from "react";
import SearchBar from "../../components/Searchbar";
import type { EventsQueryParams } from "../../models/models";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import type { IEvent } from "../../models/models";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CelebrationIcon from "@mui/icons-material/Celebration"




export const Route = createFileRoute("/eventi/")({
  component: RouteComponent,
});

function RouteComponent() {
  const eventsPerPage = 6
  const [params, setParams] = useState<EventsQueryParams>({page: 1, size: eventsPerPage});
  const [title, setTitle] = useState<string>();

  const { useGetEvents } = useUseQueries();
  const { data, isLoading } = useGetEvents(params);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setParams((state) => ({
      ...state,
      page: value
    }));
  };

  React.useEffect(() => {
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


  if (isLoading) return <>Caricamento...</>;

  const eventi = data?.data || [];
  const pagination = data?.pagination;

  return (<>
   <Box
  sx={{
    background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
    color: "white",
    py: 8,
    textAlign: "center",
    borderRadius: "0 0 24px 24px",
    mb: 5,
  }}
>
  <Box
  sx={{
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    color: "#1976d2",
    fontSize: 100,
    width: 130,
    height: 130,
    borderRadius: "50%",
    mb: 3,
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  }}
>
  <CelebrationIcon sx={{ fontSize: 80 }} />
</Box>

  <Typography
    variant="h3"
    sx={{
      fontWeight: "bold",
      mb: 1,
    }}
  >
    Cerca il tuo evento
  </Typography>

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
    Trova concerti, spettacoli e attività vicino a te. Scopri tutti gli eventi e
    scegli quello perfetto!
  </Typography>

  {/*SearchBar*/}
  <Box sx={{
    width: "100%",
    maxWidth: 700,
    mx: "auto",
    backgroundColor: "white",
    borderRadius: "10px",       
    boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
    p: 1,
  }}>
    <SearchBar onSearch={(searchTerm) => setTitle(searchTerm)} />
  </Box>
</Box>
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f5f6fa",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "2rem",
          padding: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          minHeight: "calc(100vh - 100px)",
        }}
      >
        {eventi.map((evento: IEvent) => (
          <ActionAreaCard key={evento._id} evento={evento} />
        ))}
      </div>

      <Stack
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ paddingBottom: "2rem" }}
      >
        <Pagination
          count={pagination?.totPages || 1}
          page={params.page}
          onChange={handleChange}
          color="primary"
        />
      </Stack>
    </div>
  </>);
}


export function ActionAreaCard({ evento }: { evento: IEvent }) {

  const navigate = useNavigate()
  const dataEvento = new Date(evento.date);
  const oggi = new Date();
  const eventoPassato = dataEvento < oggi;

  const dataFormattata = new Date(evento.date).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Card
      sx={{
        maxWidth: 320,
        boxShadow: 4,
        borderRadius: 3,
        transition: "transform 0.2s ease-in-out",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": { transform: "scale(1.03)" },
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={evento.image}
        alt={evento.title}
        sx={{
          objectFit: "cover",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Titolo */}
        <Typography gutterBottom variant="h5" textAlign="center">
          {evento.title}
        </Typography>

        {/* Data */}
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 1 }}
          textAlign="center"
        >
          📅 {dataFormattata}
        </Typography>

        {/* Descrizione breve */}
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 2 }}
          textAlign="center"
        >
          {evento.short_description}
        </Typography>

        {/* 🔹 Blocco informativo unico */}
        <Box
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          textAlign="center"
          mb={2}
        >
          {/* Categoria */}
          <Box>
            <LocalActivityIcon sx={{ color: "#d4b000", fontSize: 26, mb: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {evento.category || "Categoria"}
            </Typography>
          </Box>
    {/* Durata */}
    <Box>
      <AccessTimeIcon sx={{ color: "#d4b000", fontSize: 26, mb: 0.5 }} />
      <Typography variant="body2" color="text.secondary">
        { (evento.duration?.hours + "h" + (evento.duration?.minutes ? `${evento.duration.minutes}m`:"")) || "N/D"}
      </Typography>
    </Box>

          

          {/* Luogo */}
          <Box>
            <PlaceIcon sx={{ color: "#d4b000", fontSize: 26, mb: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {evento.city || "Città"}
            </Typography>
          </Box>
        </Box>

        {/*Bottone informazioni */}
        {eventoPassato ? (
  <Button
    variant="contained"
    color="error"
    fullWidth
    sx={{
      borderRadius: "50px",
      textTransform: "none",
      fontWeight: "bold",
      padding: "0.75rem",
      fontSize: "1rem",
    }}
  >
    Evento finito
  </Button>
) : (
  <Button
    variant="outlined"
    color="primary"
    fullWidth
    sx={{
      borderRadius: "50px",
      textTransform: "none",
      fontWeight: "bold",
      padding: "0.75rem",
      fontSize: "1rem",
    }}
    onClick={() => navigate({ to: `/eventi/${evento._id}` })}
  >
    Ulteriori informazioni
  </Button>
)}
      </CardContent>
    </Card>
  );
}
