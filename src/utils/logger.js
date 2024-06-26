import winston from 'winston';
import { dateFormat, timeFormat } from './dateTimeFormat.js';

const {format, transports} = winston;

const logFormat = format.printf( ({ level, message, timestamp, ...metadata }) => {
    const date = new Date(timestamp);
    let msg = `(${dateFormat.format(date)}) [${timeFormat.format(date)}] [${level}] : ${message} `
    return msg
});

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.splat(),
                format.timestamp(),
                logFormat
            )
        }),
        new transports.File({
            filename: 'logs/debug.log',
            level: 'debug',
            format: format.combine(
                format.splat(),
                format.timestamp(),
                logFormat
            )
        }),
    ]
});

logger.catchExceptions = true;

export default logger;