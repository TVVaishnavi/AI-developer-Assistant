const mongoose = require("../config/dataBase");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: function(){
      return !this.google;
    }
  },
  google: {
  type: Boolean,
  default: false,
}

});

const User = mongoose.model("User", userSchema);
module.exports = User;