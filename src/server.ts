import { app } from "./app.js";
const port = process.env.PORT || 7283;

const server = app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});

export { server };
