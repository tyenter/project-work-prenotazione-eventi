import { createFileRoute } from "@tanstack/react-router";
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
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import type { IEvent } from "../../models/models";


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
          page={page}
          onChange={handleChange}
          color="primary"
        />
      </Stack>
    </div>
  );
}


export function ActionAreaCard({ evento }: { evento: IEvent }) {
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
              {evento.duration || "N/D"}
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
