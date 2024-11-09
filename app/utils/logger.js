import winston from "winston";
import "winston-daily-rotate-file";

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  //template string, modifica el formato de la cadena de texto
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

const customLevelOptions = {
  levels: {
    error: 0,
    warning: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: "red",
    warning: "yellow",
    info: "green",
    debug: "blue",
  },
};

//Para crear un archivo logs diario, lo recomendable es generar un archivo por dia
const fileTransport = new winston.transports.DailyRotateFile({
  dirname: "./logs",
  filename: "application-%DATE%.log", //application-2024-10-25.log, application-2024-10-26.log
  datePattern: "YYYY-MM-DD-HH-mm",
  //Vamos a definir una politica de retencion de archivos
  //Vamos a comprimir los archivos que ya no se esten utilizando
  zippedArchive: true,
  //Vamos a definir el tamano maximo de los archivos
  maxSize: "1m",
  //Vamos a definir el numero maximo de archivos que vamos a tener disponibles
  //una vez que lleguemos a este numero automaticamente los archivos mas antiguos se eliminan
  maxFiles: 3,
  //Vamos a definir la frecuencia en tiempo que queremos segmentar nuestros logs
  frequency: "1m",
  //Vamos a definir el nivel
  level: "debug",
});

//Vamos a crear nuestro logger
//Para esto tenemos que definir un transporte
const logger = winston.createLogger({
  levels: customLevelOptions.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat //estructura del mensaje que vamosa a aplicar
  ),
  transports: [
    new winston.transports.Console({
      level: "debug", //mas bajo, menos prioridad, a partir de aqui se registran los eventos
      format: winston.format.colorize({
        all: true,
        colors: customLevelOptions.colors,
      }),
    }),
    //Reemplazamos la 62, 63, 64 por fileTransport
    // new winston.transports.File({
    //   filename: "logs/error.log", //aqui es donde se van a registrar los eventos
    //   level: "warning",
    // }),
    fileTransport,
  ],
});

//Como registrar los eventos en consola
//logger.error("Hello World this is an error");
//logger.warn("Hello World this is a warning");
//logger.info("Hello World with logger");
//logger.http("Hello World this is an http log");
//logger.verbose("Hello World this is a verbose");
//logger.debug("Hello World this is a debug");
//logger.silly("Hello World this is a silly");
export default logger;
