const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    //document structure & rules definition here
    fullName: {type: String, required: true},
    email: {type: String, required: true, unique: true, /*match: */},
    /* Add in the role here */
    role: {
        type: String,
        enum: [ "normal", "admin"],
        default:"normal"
    },
    // only for users who signed up normally
    encryptedPassword: { type: String},

    // Google users will have additional googleID
    goodleID: { type: String},

    // Github users will have additional githubID
    githubID: { type: String}

},{
    // additional settings for the schema here
    timestamps: true
});

//加入一个virtual propoer来识别admin
userSchema.virtual("isAdmin").get(function() {
    return this.role === "admin";
})

const User = mongoose.model("User", userSchema);

module.exports = User;