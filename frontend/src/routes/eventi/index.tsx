import { createFileRoute } from "@tanstack/react-router";
import { useUseQueries } from "../../hooks/useUseQueries";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Button, Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import { useState } from "react";
import SearchBar from "../../components/Searchbar";
import type { EventsQueryParams } from "../../models/models";

export const Route = createFileRoute("/eventi/")({
  component: RouteComponent,
});

function RouteComponent() {
  const eventsPerPage = 6
  const [params, setParams] = useState<EventsQueryParams>({page: 1, size: eventsPerPage});
  const [title, setTitle] = useState<string>('');

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
        title: title, 
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
    <SearchBar
      onSearch={(searchTerm) => setTitle(searchTerm)}
    />

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
        {eventi.map((evento: any) => (
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

type Evento = {
  _id: string;
  title: string;
  description: string;
  date: string;
  address?: string;
  duration?: {
    hours: number,
    minutes: number
  };
  city?: string;
};

export function ActionAreaCard({ evento }: { evento: Evento }) {
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
     

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5">
          {evento.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
          📅 {dataFormattata}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          {evento.description}
        </Typography>

        <Box display="flex" justifyContent="space-around" alignItems="center" my={2}>
          <Box textAlign="center">
            <AccessTimeIcon sx={{ color: "#d4b000", fontSize: 30 }} />
            <Typography variant="body2" color="text.secondary">
              { (evento.duration?.hours + "h" + (evento.duration?.minutes ? "":"m")) || "N/D"}
            </Typography>
          </Box>

          <Box textAlign="center">
            <PlaceIcon sx={{ color: "#d4b000", fontSize: 30 }} />
            <Typography variant="body2" color="text.secondary">
              {evento.address || "Indirizzo non disponibile"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {evento.city}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" mt={2}>
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
            onClick={() => alert(`Ulteriori informazioni su: ${evento.title}`)}
          >
            Ulteriori informazioni
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
