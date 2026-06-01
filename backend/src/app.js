const express =
require("express");

const cors =
require("cors");

const helmet =
require("helmet");

const morgan =
require("morgan");

const app = express();

app.use(cors());
app.use(helmet());

// request logging
app.use(morgan("dev"));

app.use(express.json());

// routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));

// swagger UI (optional)
const { swaggerUi, swaggerJsdoc } = require("./config/swagger");
const swaggerSpec = require("./config/swaggerSpec");
if (swaggerSpec) {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerSpec)));
}

// error handler
app.use(require("./middlewares/error.middleware"));

module.exports = app;