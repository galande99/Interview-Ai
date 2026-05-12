const mongoose = require("mongoose");


const blackistTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true, "Token is required to be added to the blacklist"],
    }
},{
    timestamps:true,
})


const tokenBlacklistModel = mongoose.model("blacklistTokens",blackistTokenSchema)

module.exports = tokenBlacklistModel