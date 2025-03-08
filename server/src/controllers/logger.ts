import winston from 'winston';
import path from 'path';
import 'winston-mongodb';

function logging() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
        level: 'error'
      }),
      new winston.transports.File({
        filename: path.join(__dirname, '../logs/error.log'),
        level: 'error'
      }),
      new winston.transports.MongoDB({
        db: process.env.MONGODB_URI,
        collection: 'logs',
        level: 'error'
      })
    ]
  });

  logger.exceptions.handle(
    new winston.transports.Console({
      format: winston.format.simple(),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/exceptions.log'),
      level: 'error'
    })
  );

  logger.rejections.handle(
    new winston.transports.Console({
      format: winston.format.simple(),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/rejections.log'),
      level: 'error'
    })
  );

  return logger;
}

export default logging;
