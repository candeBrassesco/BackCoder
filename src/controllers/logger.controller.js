import logger from "../winston.js";

export const loggerController = async ( req, res ) => {
    logger.fatal("Test log fatal")
    logger.error("Test log error")
    logger.warning("Test log warning")
    logger.info("Test log info")
    logger.http("Test log http")
    logger.debug("Test log debug")
}