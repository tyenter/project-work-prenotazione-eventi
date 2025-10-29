import Joi from 'joi';

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).max(1000).optional(),
  size: Joi.number().integer().min(1).max(100).optional()
});

export const objectIdSchema = Joi.string().hex().length(24).required()