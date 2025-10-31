import { Button, TextField } from '@mui/material';
import { formOptions, useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import { ALLOWED_TLDS } from '../config';
import { login } from '../api/authApi';


export const Route = createFileRoute('/login')({
  component: Login,
});

function Login(){

    interface User {
        email: string
        password: string
    }
    const defaultUser: User = { email: '', password: ''}

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
                    )
            })
        }
    })

    const form = useForm({
        ...formOpts,
        onSubmit: async ({ value }) => {
            await login(value.email,value.password)
            
        },
    })


    return (<>

        <div className='loginContainer'>

            <h3>LOGIN</h3>

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

            <Button 
                variant="contained"
                type="submit"
                onClick={form.handleSubmit}
            >
                Login
            </Button>

        </div>
    </>)
}