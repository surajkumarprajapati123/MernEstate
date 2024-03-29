const app = require("./app");
const mongoose = require("mongoose");

console.log(process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => {
    console.log(
      `Databse is connected successfully with host id is ${e.connection.host}`
    );
  })
  .catch((erro) => {
    console.log(erro);
  });

app.listen(process.env.PORT, () => {
  console.log(`Conntection crated successful  Port is ${process.env.PORT}`);
});
