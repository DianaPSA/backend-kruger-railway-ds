import logger from "../utils/logger.js";

const testLogs = (req, res) => {
  try {
    // logger.error("Hello World this is an error");
    // logger.warn("Hello World this is a warning");
    // logger.info("Hello World with logger");
    // logger.http("Hello World this is an http log");
    // logger.verbose("Hello World this is a verbose");
    // logger.debug("Hello World this is a debug");
    // logger.silly("Hello World this is a silly");
    logger.error("Hello World this is an error");
    logger.warning("Hello World this is a warning");
    logger.info("Hello World with logger");
    logger.debug("Hello World this is a debug");

    res.send({ message: "Logs test" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { testLogs };
