import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { createServer } from "http";

const app = express();

// Configure CORS for all environments
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow any subdomain from replit.dev
    if (origin.endsWith('.replit.dev') || origin.includes('.repl.co')) {
      return callback(null, true);
    }
    
    // In production, use specific origin
    if (process.env.NODE_ENV === 'production' && process.env.PRODUCTION_URL) {
      return callback(null, process.env.PRODUCTION_URL === origin);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
  try {
    registerRoutes(app);
    const server = createServer(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Error:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Setup routes based on environment
    if (process.env.NODE_ENV === "development") {
      console.log("Setting up Vite in development mode");
      await setupVite(app, server);
    } else {
      console.log("Setting up static serving in production mode");
      serveStatic(app);
    }

    // Start server with proper port binding
    const port = Number(process.env.PORT) || 3001;
    const HOST = "0.0.0.0";

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please free up the port and try again.`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });

    server.listen(port, HOST, () => {
      const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      console.log(`${formattedTime} [express] Server started successfully`);
      console.log(`Server is running at http://${HOST}:${port}`);
    });

  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
})();
