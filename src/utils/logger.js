import winston, { format, transports } from 'winston';
import { dateFormat, timeFormat } from './dateTimeFormat.js';

const logFormat = format.printf( ({ level, message, timestamp, ...metadata }) => {
    const date = new Date(timestamp);
    const formattedDate = `(${dateFormat.format(date)}) [${timeFormat.format(date)}]`
    return `[${level}] ${formattedDate} : ${message}`
});

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

const logger = winston.createLogger(loggerConfig);

logger.catchExceptions = true;

export default logger;