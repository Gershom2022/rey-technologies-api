// src/logger.js
const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Create logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Write error logs to file (production only)
        ...(process.env.NODE_ENV === 'production' ? [
            new winston.transports.File({
                filename: path.join(__dirname, '../logs/error.log'),
                level: 'error',
                maxsize: 10485760, // 10MB
                maxFiles: 5
            }),
            new winston.transports.File({
                filename: path.join(__dirname, '../logs/combined.log'),
                maxsize: 10485760, // 10MB
                maxFiles: 5
            })
        ] : [])
    ]
});

// Create a stream for Morgan integration (optional)
logger.stream = {
    write: (message) => logger.info(message.trim())
};

module.exports = logger;