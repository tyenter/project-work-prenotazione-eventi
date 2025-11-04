import { createFileRoute } from "@tanstack/react-router";
import { useUseQueries } from "../../hooks/useUseQueries";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Button, Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";

export const Route = createFileRoute("/eventi/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [page, setPage] = React.useState(1);
  const eventiPerPagina = 6; 

  const { useGetEvents } = useUseQueries();
  const { data, isLoading } = useGetEvents({ page, size: eventiPerPagina });

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (isLoading) return <>Caricamento...</>;

  const eventi = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f5f6fa",
      }}
    >
      <Navbar />

      {/* 🔹 Contenitore centrato delle card */}
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

      {/* 🔽 Paginazione  */}
      <Stack
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ paddingBottom: "2rem" }}
      >
        <Pagination
          count={pagination?.totPages || 1}
          page={page}
          onChange={handleChange}
          color="primary"
        />
      </Stack>
    </div>
  );
}

type Evento = {
  _id: string;
  title: string;
  description: string;
  date: string;
  address?: string;
  duration?: string;
  city?: string;
  //image?: string;
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
              {evento.duration || "N/D"}
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

        {/* 🔘 Bottone informazioni */}
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

const Navbar = () => (
  <nav
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#2f3640",
      color: "white",
    }}
  >
    <div>
      <h1 style={{ margin: 0 }}>EventiApp</h1>
    </div>
    <button
      style={{
        backgroundColor: "#00a8ff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        padding: "0.5rem 1rem",
        cursor: "pointer",
      }}
    >
      Login
    </button>
  </nav>
);
