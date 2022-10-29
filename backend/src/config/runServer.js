import config from "./config.js";

const runServer = (app) => {
  const server = app.listen(config.PORT, () =>
    console.log(`Server running at ${config.PORT}`)
  );

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    console.log(`Server Error: ${error.message}`);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);
};

export default runServer;
