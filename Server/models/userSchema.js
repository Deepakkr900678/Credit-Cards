const mongoose = require("mongoose");
const sequencingProperty = require("../config/sequencingProperty");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  
  _id: Number,
  card_number: {
    type: Number,
    required: true,
  },
  name_oncard: {
    type: String,
    required: true,
  },
  expiry: {
    type: Number,
    required: true,
  },
  cvv: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    min: 2,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  }
  
});

userSchema.pre("save", function (next) {
  let doc = this;
  sequencingProperty
    .getSequenceNextValue("user_id")
    .then((counter) => {
      if (!counter) {
        sequencingProperty
          .insertCounter("user_id")
          .then((counter) => {
            doc._id = counter;
            next();
          })
          .catch((error) => next(error));
      } else {
        doc._id = counter;
        next();
      }
    })
    .catch((error) => next(error));
});

const userModal = new mongoose.model("user", userSchema);
module.exports = userModal;
