/* eslint-disable */
import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize } = winston.format;

const logDir = "logs";

const logFormat = printf(
  (info) => `${info.timestamp} ${info.level}: ${info.message}`,
);

/**
 * log Level
 * error 0
 * warn 1
 * info 2
 * http 3
 * verbose 4
 * debug 5
 * silly 6
 */

const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat,
  ),
  transports: [
    // info level
    new winstonDaily({
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 15,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: "warn",
      datePattern: "YYYY-MM-DD",
      dirname: `${logDir}/warn`,
      filename: `%DATE%.warn.log`,
      maxFiles: 15,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: `${logDir}/error`,
      filename: `%DATE%.error.log`,
      maxFiles: 15,
      zippedArchive: true,
    }),
  ],
});

logger.stream = {
  write: (message) => {
    logger.info(message);
  },
};

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize({ all: true }), logFormat),
    }),
  );
}

export default logger;
