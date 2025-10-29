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
              .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?])/)
              .required()
})