const mongoose = require("mongoose");
const Business = require("./models/Business");

mongoose
  .connect("mongodb://127.0.0.1:27017/locallink", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    const count = await Business.countDocuments();
    const docs = await Business.find().limit(5).lean();
    console.log("connected");
    console.log("count", count);
    console.log(JSON.stringify(docs, null, 2));
    await mongoose.disconnect();
  })
  .catch((err) => {
    console.error("error", err.message);
  });
