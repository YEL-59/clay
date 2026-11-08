import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import { ENV } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import apiRouter from './routes';

export const createApp = (): Application => {
  const app: Application = express();

  // Basic Middlewares
  app.use(
    cors({
      origin: ENV.CORS_ORIGIN === '*' ? true : ENV.CORS_ORIGIN.split(','),
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (ENV.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Health and Root Info
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
  });

  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      name: 'Shifatdevs Raye Commerce & Admin MERN API',
      version: '1.0.0',
      status: 'active',
      endpoints: {
        overview: '/api/v1/overview',
        products: '/api/v1/products',
        orders: '/api/v1/orders',
        customers: '/api/v1/customers',
        promos: '/api/v1/promos',
        fitSessions: '/api/v1/fit-sessions',
        settings: '/api/v1/settings',
        manufacturer: '/api/v1/manufacturer/batches',
        stores: '/api/v1/stores/branches',
        hr: '/api/v1/hr/candidates',
      },
    });
  });

  // Mount API v1 router
  app.use('/api/v1', apiRouter);

  // 404 Handler for undefined routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `Route not found: ${req.method} ${req.originalUrl}`,
      statusCode: 404,
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
