import { createServer } from "http";
import { createApp, log } from "./app";
import { serveStatic } from "./static";
import { seedAdminUser } from "./auth";

const app = createApp();
const httpServer = createServer(app);

(async () => {
  await seedAdminUser();

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
