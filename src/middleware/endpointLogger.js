import logger from '../utils/logger.js';

const endpointLogger = (req, res, next) => {
    const { method, path, query } = req;
    const queryParams = Object.keys(query).length? `${Object.keys(query).map((key) => `${key}=${query[key]}`).join('&')}` : '';
    const logMessage = `@ Endpoint (${method}) '${path}${queryParams}' accessed`;
    logger.info(logMessage);
    next();
}

export default endpointLogger;