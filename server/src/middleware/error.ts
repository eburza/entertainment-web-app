import winston from 'winston';
import { Request, Response, NextFunction } from 'express';

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  winston.error(err.message, err);
  res.status(500).json({ error: 'Internal Server Error' });
}

export default errorHandler;