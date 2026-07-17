// validation.js - Updated
const Joi = require('joi');

const inquirySchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name cannot exceed 100 characters',
            'any.required': 'Name is required'
        }),
    
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
    
    phone: Joi.string()
        .pattern(/^\+?[0-9\s\-()]{7,20}$/)
        .allow('', null)
        .messages({
            'string.pattern.base': 'Please provide a valid phone number'
        }),
    
    subject: Joi.string()
        .max(200)
        .allow('', null)
        .default('General Inquiry')
        .messages({
            'string.max': 'Subject cannot exceed 200 characters'
        }),
    
    message: Joi.string()
        .min(10)
        .max(5000)
        .required()
        .messages({
            'string.min': 'Message must be at least 10 characters',
            'string.max': 'Message cannot exceed 5000 characters',
            'any.required': 'Message is required'
        })
});

const loginSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.min': 'Username must be at least 3 characters',
            'string.max': 'Username cannot exceed 50 characters',
            'any.required': 'Username is required'
        }),

    password: Joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        })
});

const newsletterSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        })
});

module.exports = { inquirySchema, loginSchema, newsletterSchema };