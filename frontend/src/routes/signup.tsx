import { Button, TextField, Alert } from '@mui/material';
import { formOptions, useForm } from '@tanstack/react-form';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import z from 'zod';
import { authenticateMe } from '../hooks/authenticateMe';
import type { TLoginError } from '../models/models';
import { useState } from 'react';
import { ALLOWED_TLDS } from '../config';

export const Route = createFileRoute('/signup')({
  beforeLoad: ({ context }) => {
    if (context.accessToken)
      throw redirect({to: '/eventi'})
  },
  component: Signup,
})

function Signup(){
    const navigate = useNavigate();
    const [alert, setAlert] = useState<string>()
    const signup = authenticateMe("signup")

    interface SignupInfo {
      email: string
      password: string
      firstName: string
      lastName: string
    }
    const defaultUser: SignupInfo = { email: '', password: '', firstName: '', lastName: ''}

    const formOpts = formOptions({
        defaultValues: defaultUser,
        validators: {
            onSubmit: z.object({
                email: z
                    .email("email non valida")
                    .refine(email => {
                      const tld = email.split('.').pop()?.toLowerCase()
                      return tld && ALLOWED_TLDS.includes(tld)
                    }, {
                      message: "email non valida"
                    }),
                password: z
                    .string()   
                    .min(8,"minimo 8 caratteri")
                    .max(128,"massimo 128 caratteri")
                    .regex(/(?=.*[a-z])/,"almeno 1 lettera minuscola")
                    .regex(/(?=.*[A-Z])/,"almeno 1 lettera maiuscola")
                    .regex(/(?=.*[0-9])/,"almeno 1 numero")
                    .regex(
                        /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?])/
                        ,"almeno 1 carattere speciale (!@#$%^&*()_+-=[]{};':\"\\|,.<>/?)"
                    ),
                firstName: z
                  .string()
                  .trim()
                  .min(2,"minimo 2 caratteri")
                  .max(30,"massimo 30 caratteri")
                  .regex(/^[a-zA-Zàèìòù\s]+$/,"caratteri non ammessi"),
                lastName: z
                  .string()
                  .trim()
                  .min(2,"minimo 2 caratteri")
                  .max(30,"massimo 30 caratteri")
                  .regex(/^[a-zA-Zàèìòù\s]+$/,"caratteri non ammessi"),
            })
        }
    })

    const form = useForm({
        ...formOpts,
        onSubmit: async ({ value }) => {

          const error: TLoginError | undefined = 
              await signup({
                email: value.email,
                password: value.password,
                firstName: value.firstName,
                lastName: value.lastName
              })

          if(error){
              if(error === "INVALID_CREDENTIALS")
                setAlert("Signup fallito: Credenziali invalide")
              else if(error === "NETWORK_ERROR")
                setAlert("Signup fallito: Errore di rete")
              else
                setAlert("Signup fallito: Errore inaspettato. Riprova più tardi")

              return
          }
          
          navigate({ to: `/eventi` })

        },
    })


    return (<>

        <div className='loginContainer'>

            <h3>Registrati</h3>

            {   alert &&   
                <Alert 
                    onClose={()=> setAlert(undefined)} 
                    severity="error"
                >
                    {alert}
                </Alert>
            }
            <form.Field
              name="firstName"
              children={(field) => (<>
                <TextField 
                  label="Nome"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={!field.state.meta.isValid}
                />
                <span style={{color: "red"}}>
                  {field.state.meta.errors[0]?.message} 
                </span>
              </>)}
            />
            
            <form.Field
              name="lastName"
              children={(field) => (<>
                <TextField 
                  label="Cognome"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={!field.state.meta.isValid}
                />
                <span style={{color: "red"}}>
                  {field.state.meta.errors[0]?.message}
                </span>
              </>)}
            />

            <form.Field
              name="email"
              children={(field) => (<>
                <TextField 
                  label="Email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={!field.state.meta.isValid}
                />
                <span style={{color: "red"}}>
                  {field.state.meta.errors[0]?.message} 
                </span>
              </>)}
            />

            <form.Field
              name="password"
              children={(field) => (<>
                <TextField 
                  label="Password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={!field.state.meta.isValid}
                  type="password"
                />
                <span style={{color: "red"}}>
                  {field.state.meta.errors[0]?.message}
                </span>
              </>)}
            />

            

            


            <form.Subscribe
              selector={(state) => state.canSubmit}
              children={(canSubmit)=>{
                return (<>
                  <Button 
                    variant="contained"
                    type="submit"
                    onClick={form.handleSubmit}
                    disabled={!canSubmit}
                  >
                    Registrati
                  </Button>
                </>)
              }}
            />

        </div>
    </>)
}