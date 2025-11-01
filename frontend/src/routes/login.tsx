import { Button, TextField, Alert } from '@mui/material';
import { formOptions, useForm } from '@tanstack/react-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import z from 'zod';
import { useLogin } from '../hooks/useLogin';
import type { TLoginError } from '../models/models';
import { useState } from 'react';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login({from}:{from?: string}){
    const navigate = useNavigate();
    const [alert, setAlert] = useState<string>()
    const login = useLogin()

    interface User {
        email: string
        password: string
    }
    const defaultUser: User = { email: '', password: ''}

    const formOpts = formOptions({
        defaultValues: defaultUser,
        validators: {
            onSubmit: z.object({
                email: z.email("email non valida"),
                password: z.string()
            })
        }
    })

    const form = useForm({
        ...formOpts,
        onSubmit: async ({ value }) => {
            const error: TLoginError | undefined = 
                await login(value.email,value.password)

            if(error){
                if(error === "INVALID_CREDENTIALS")
                    setAlert("Login fallito: Credenziali errate")
                else if(error === "NETWORK_ERROR")
                    setAlert("Login fallito: Errore di rete")
                else
                    setAlert("Login fallito: Errore inaspettato. Riprova più tardi")

                return
            }
            
            navigate({ to: `/eventi` })
        },
    })


    return (<>

        <div className='loginContainer'>

            <h3>LOGIN</h3>

            {   alert &&   
                <Alert 
                    onClose={()=> setAlert(undefined)} 
                    severity="error"
                >
                    {alert}
                </Alert>
            }

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
                        label="password"
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
                            Login
                        </Button>
                    </>)
                }}
            />

        </div>
    </>)
}