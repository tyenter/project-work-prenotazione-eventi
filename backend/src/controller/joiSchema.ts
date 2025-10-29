import Joi from 'joi';

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(0).max(1000).optional(),
  size: Joi.number().integer().min(0).max(100).optional()
});