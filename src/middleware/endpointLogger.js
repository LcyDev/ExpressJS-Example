import logger from '../utils/logger.js';


/**
 * @description This middleware logs the endpoint access details.
 * @param {Express.Request} req - Express request object.
 * @param {Express.Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} - No return value.
 */
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