import { createFileRoute } from '@tanstack/react-router'
import { useUseQueries } from '../../hooks/useUseQueries'
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { useUseMutations } from '../../hooks/useUseMutations'
import { formOptions, useForm } from '@tanstack/react-form'
import z from 'zod'

export const Route = createFileRoute('/eventi/$eventoId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { eventoId } = Route.useParams()
  const {useGetEventById,useCheckBooking} = useUseQueries()
  const {bookEventMutation} = useUseMutations()
  const {data: event, isLoading} = useGetEventById(eventoId)
  const {data: check, isLoading: isChecking, refetch} = useCheckBooking(eventoId)
  const {accessToken} = useAuth()

  interface IDefaultValues {
    people: number
  }

  const defaultPeople: IDefaultValues  = {people: 1}

  const formOpts = formOptions({
      defaultValues: defaultPeople,
      validators: {
          onSubmit: z.object({
            people: z.number().int().min(1).max(3)
          })
      }
  })

  const form = useForm({
      ...formOpts,
      onSubmit: async ({ value }) => {

        bookEventMutation
          .mutateAsync({
            eventId: eventoId,
            people: value.people
          })
          .then(async ()=>{
            await refetch()
          })
      },
  })


  if(isLoading || isChecking) 
    return <>Caricamento...</>
  if(!event) 
    return <p>Evento inesistente</p>


  return (<>
    <div>{JSON.stringify(event)}</div>
    <b/>

    <form.Field
      name="people"
      children={(field) => (<>
      <div style={{width: 110}}>
        <FormControl fullWidth>
          <InputLabel id="peopleSelectLabel">Persone</InputLabel>
          <Select
            labelId="peopleSelectLabel"
            id="peopleSelect"
            value={field.state.value}
            label="Persone"
            onChange={(e) => field.handleChange(e.target.value)}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
          </Select>
        </FormControl>
      </div>
      </>)}
    />
  
    <Button 
      disabled={!accessToken || check?.isBooked}
      onClick={form.handleSubmit}
      type='submit'
    >
      { !accessToken ?
        "Esegui login per prenotare" :
        <>{ check?.isBooked ?
            "Prenotato" : "Prenota"
        }</>
      }
    </Button>
  </>)
}



