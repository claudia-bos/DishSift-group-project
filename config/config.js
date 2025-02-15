import "dotenv/config";

const config = {
  SERVER_PORT: 66,
  DB_NAME: "dish_sift",
  DB_PASSWORD: process.env.DATABASE_PASSWORD,
  DB_USER: process.env.DATABASE_USER,
};

export default config;
