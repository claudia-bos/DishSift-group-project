/////////////////////////////////////////////////////////////////////////////
//  Imports
/////////////////////////////////////////////////////////////////////////////
import express from "express";
import session from "express-session";
import morgan from "morgan";
import ViteExpress from "vite-express";
import config from "../config/config.js";
import "dotenv/config";
import handlerFunctions from "./controller.js";

/////////////////////////////////////////////////////////////////////////////
//  Express instance and Middleware
/////////////////////////////////////////////////////////////////////////////
const app = express();
const port = config.SERVER_PORT;
ViteExpress.config({ printViteDevServerHost: true });

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
  })
);

/////////////////////////////////////////////////////////////////////////////
//  Endpoints
/////////////////////////////////////////////////////////////////////////////
const { 
  register, 
  login, 
  sessionCheck, 
  logout, 
  updateAccount, 
  deleteAccount, 
  addFavorite, 
  getFavorites, 
  removeFavorite
} = handlerFunctions;

app.post("/api/register", register);
app.post("/api/login", login);
app.get("/api/session-check", sessionCheck);
app.get("/api/logout", logout);
app.put("/api/profile", updateAccount);
app.delete("/api/profile", deleteAccount);

app.post("/api/favorites", addFavorite);
app.get("/api/getFavorites", getFavorites);
app.delete("/api/favorites/:favoriteId", removeFavorite);


/////////////////////////////////////////////////////////////////////////////
//  Config server on port
/////////////////////////////////////////////////////////////////////////////
ViteExpress.listen(app, port, () =>
  console.log(`Execute port ${port}! http://localhost:${port}`)
);
