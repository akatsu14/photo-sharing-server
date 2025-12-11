const mongoose = require("mongoose");
require("dotenv").config();
const agorn2 = require("argon2");
const models = require("../modelData/models.js");

const User = require("../db/userModel.js");
const SchemaInfo = require("../db/schemaInfo.js");

const versionString = "1.0";

async function dbLoad() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.log("Unable connecting to MongoDB Atlas!");
  }

  await User.deleteMany({});
  await SchemaInfo.deleteMany({});

  const userModels = models.userListModel();
  const mapFakeId2RealId = {};
  for (const user of userModels) {
    let password = await agorn2.hash(user.first_name.toLowerCase());
    let username = user.first_name.toLowerCase();
    userObj = new User({
      username: username,
      password: password,
      full_name: user.full_name,
      email: user.email,
      high_score: user.high_score,
    });
    try {
      await userObj.save();
      mapFakeId2RealId[user._id] = userObj._id;
      user.objectID = userObj._id;
      console.log(
        "Adding user:",
        user.first_name + " " + user.last_name,
        " with ID ",
        user.objectID
      );
    } catch (error) {
      console.error("Error create user", error);
    }
  }

  try {
    schemaInfo = await SchemaInfo.create({
      version: versionString,
    });
    console.log("SchemaInfo object created with version ", schemaInfo.version);
  } catch (error) {
    console.error("Error create schemaInfo", reportError);
  }
  mongoose.disconnect();
}

dbLoad();
