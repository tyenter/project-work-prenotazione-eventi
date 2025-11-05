import { createFileRoute } from '@tanstack/react-router'
import { useUseQueries } from '../../hooks/useUseQueries'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
  Stack,
  CircularProgress,
  CardMedia,
} from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PlaceIcon from '@mui/icons-material/Place'
import CategoryIcon from '@mui/icons-material/Category'
import GroupIcon from '@mui/icons-material/Group'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import { useAuth } from '../../hooks/useAuth'
import { useUseMutations } from '../../hooks/useUseMutations'
import { formOptions, useForm } from '@tanstack/react-form'
import z from 'zod'

export const Route = createFileRoute('/eventi/$eventoId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { eventoId } = Route.useParams()
  const { useGetEventById, useCheckBooking } = useUseQueries()
  const { bookEventMutation } = useUseMutations()
  const { data: event, isLoading } = useGetEventById(eventoId)
  const { data: check, isLoading: isChecking, refetch } = useCheckBooking(eventoId)
  const { accessToken } = useAuth()

  interface IDefaultValues {
    people: number
  }

  const defaultPeople: IDefaultValues = { people: 1 }

  const formOpts = formOptions({
    defaultValues: defaultPeople,
    validators: {
      onSubmit: z.object({
        people: z.number().int().min(1).max(10),
      }),
    },
  })

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      await bookEventMutation.mutateAsync({
        eventId: eventoId,
        people: value.people,
      })
      await refetch()
    },
  })

  if (isLoading || isChecking)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    )

  if (!event) return <Typography color="error">Evento inesistente</Typography>

  // formattazione data e durata
  const formattedDate = new Date(event.date).toLocaleString('it-IT', {
    dateStyle: 'full',
    timeStyle: 'short',
  })

  const duration = event.duration
    ? `${event.duration.hours}h ${event.duration.minutes ? event.duration.minutes + 'm' : ''}`
    : 'N/D'

  return (
    <>
      {/* Banner in alto */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
          borderRadius: '0 0 24px 24px',
          mb: 5,
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: 'white',
            mb: 2,
            boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 30,
              backgroundColor: '#42a5f5',
              borderRadius: 2,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -6,
                left: -6,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: 'white',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -6,
                right: -6,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: 'white',
              }}
            />
            <Box
              sx={{
                width: '60%',
                height: 3,
                backgroundColor: 'white',
                borderRadius: 1,
              }}
            />
          </Box>
        </Box>

        <Typography variant="h3" fontWeight="bold">
          {event.title}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            maxWidth: 800,
            mx: 'auto',
            mt: 1,
            opacity: 0.9,
          }}
        >
          {event.short_description}
        </Typography>
      </Box>

      {/* Card con dettagli evento */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: '100vh',
          backgroundColor: '#f5f6fa',
          pb: 8,
        }}
      >
        <Card sx={{ maxWidth: 800, width: '100%', boxShadow: 5, borderRadius: 3 }}>
          <CardHeader
            avatar={<EventAvailableIcon color="primary" sx={{ fontSize: 40 }} />}
            title="Dettagli evento"
            titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
          />
          <Divider />

          <Box sx={{ px: 2, pt: 2 }}>
            <CardMedia
              component="img"
              height="450"
              image={event.image}
              alt={event.title}
              sx={{
                objectFit: 'cover',
                borderRadius: 3,
                width: '100%',
                boxShadow: 2,
              }}
            />
          </Box>

          <CardContent>
            <Stack spacing={2}>
              {/* Info */}
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeIcon color="primary" />
                <Typography variant="body1">
                  <strong>Data:</strong> {formattedDate}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <CategoryIcon color="primary" />
                <Typography variant="body1">
                  <strong>Categoria:</strong> {event.category}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceIcon color="primary" />
                <Typography variant="body1">
                  <strong>Luogo:</strong> {event.address}, {event.city}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeIcon color="primary" />
                <Typography variant="body1">
                  <strong>Durata:</strong> {duration}
                </Typography>
              </Stack>

              {event.people && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <GroupIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Partecipanti:</strong> {event.people}
                  </Typography>
                </Stack>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Descrizione evento */}
              <Typography
                variant="body1"
                sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
              >
                {event.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Prenotazione */}
              <Typography
                variant="h6"
                fontWeight="bold"
                textAlign="center"
                sx={{ mt: 2 }}
              >
                Prenota il tuo posto
              </Typography>

              <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
                <form.Field
                  name="people"
                  children={(field) => (
                    <FormControl sx={{ width: 120 }}>
                      <InputLabel id="peopleSelectLabel">Persone</InputLabel>
                      <Select
                        labelId="peopleSelectLabel"
                        id="peopleSelect"
                        value={field.state.value}
                        label="Persone"
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={form.handleSubmit}
                  disabled={!accessToken || check?.isBooked}
                  sx={{
                    py: 1.3,
                    px: 3,
                    fontWeight: 'bold',
                    borderRadius: '30px',
                    minWidth: 180,
                  }}
                >
                  {!accessToken
                    ? 'Esegui login per prenotare'
                    : check?.isBooked
                      ? 'Prenotato ✅'
                      : 'Prenota'}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
