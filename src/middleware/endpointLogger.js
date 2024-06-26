import logger from '../utils/logger.js';

const endpointLogger = (req, res, next) => {
    const { method, path, query } = req;
    const queryParams = Object.keys(query).length
        ? `?${Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')}`
        : '';
    const logMessage = `@ Endpoint (${method}) '${path}${queryParams}' accessed`;
    logger.info(logMessage);
    next();
}

export default endpointLogger;