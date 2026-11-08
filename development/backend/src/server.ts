import { createApp } from './app';
import { ENV } from './config/env';
import { connectDatabase } from './models/db';

async function bootstrap() {
  await connectDatabase();

  const app = createApp();
  const server = app.listen(ENV.PORT, () => {
    console.log(`===================================================`);
    console.log(` 🚀 Shifatdevs Raye MERN Backend API Server`);
    console.log(` 📡 Base URL: http://localhost:${ENV.PORT}`);
    console.log(` 🌐 API Prefix: http://localhost:${ENV.PORT}/api/v1`);
    console.log(` 🩺 Health: http://localhost:${ENV.PORT}/health`);
    console.log(` 📦 Mode: ${ENV.NODE_ENV}`);
    console.log(`===================================================`);
  });

  const handleTermination = (signal: string) => {
    console.log(`\n[Process] Received ${signal}. Gracefully closing HTTP server...`);
    server.close(() => {
      console.log('[Process] HTTP server closed cleanly.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => handleTermination('SIGINT'));
  process.on('SIGTERM', () => handleTermination('SIGTERM'));
}

bootstrap().catch((err) => {
  console.error('[Bootstrap] Fatal startup error:', err);
  process.exit(1);
});
