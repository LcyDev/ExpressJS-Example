import winston, { format, transports } from 'winston';
import dtFormat from './dateTimeFormat.js';

/**
 * @description This module provides a custom logger configuration using the Winston library.
 * @module logger
 */

/**
 * @description Custom log format function that formats the log message with a timestamp and level.
 * @param {{ level: string, message: string, timestamp: number, ...metadata: any }} logData - The log data object containing the log level, message, timestamp, and additional metadata.
 * @returns {string} - The formatted log message.
 */
const logFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
    const date = new Date(timestamp);
    const formattedDate = `(${dtFormat.date.format(date)}) [${dtFormat.time.format(date)}]`;
    return `${formattedDate} [${level}] : ${message}`;
});

/**
 * @description Logger configuration object containing the log level and transport configurations.
 * @type {Object}
 * @property {string} level - The log level (e.g., 'info', 'debug', 'error').
 * @property {Array} transports - An array of transport configurations for logging to different destinations (e.g., console and file).
 */
const loggerConfig = {
    level: 'info',
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.splat(),
                format.timestamp(),
                logFormat
            ),
        }),
        new transports.File({
            filename: 'logs/debug.log',
            level: 'debug',
            format: format.combine(
                format.splat(),
                format.timestamp(),
                logFormat
            ),
        }),
    ],
};

/**
 * @description Creates a new instance of the logger using the provided configuration.
 * @type {Object}
 * @property {Function} catchExceptions - A function that catches exceptions and logs them.
 * @returns {Object} - The logger instance.
 */
const logger = winston.createLogger(loggerConfig);

/**
 * @description Enables catching exceptions and logging them.
 * @type {Boolean}
 */
logger.catchExceptions = true;

/**
 * @description Exports the logger instance for use in other parts of the application.
 * @returns {Object} - The logger instance.
 */
export default logger;