import Joi from 'joi';

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).max(1000).optional(),
  size: Joi.number().integer().min(1).max(100).optional()
});

export const objectIdSchema = Joi.string().hex().length(24).required()

export const credsSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi
    .string()
    .min(8)
    .max(128)
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?])/)
    .required()
})

export const userInfoSchema = Joi.object({
  firstName: Joi
    .string()
    .trim()
    .regex(/^[a-zA-Zàèìòù]+$/)
    .min(2)
    .max(30)
    .required(),
  lastName: Joi
    .string()
    .trim()
    .regex(/^[a-zA-Zàèìòù\s]+$/)
    .min(2)
    .max(30)
    .required()
}).concat(credsSchema)

export const refreshTokenSchema = Joi
  .string()
  .regex(/^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/) 
  .required()