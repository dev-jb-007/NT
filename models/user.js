const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt=require("jsonwebtoken");

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
        maxLength: [500, 'Address Above 500 characters is not supported'],
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    password: {
        type: String,
        required: true,
    },
});
userSchema.methods.isPasswordValid = async function (password) {
    if (this.password == password) {
        return true;
    }
    else {
        return false;
    }
}
userSchema.methods.createAuthToken=async function(){
    const user=this;
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET);
    user.tokens=user.tokens.concat({token:token});//.concat combines two or more array
    // console.log(user);
    await user.save();
    return token;
}
userSchema.pre('save', async function () {
    let user = this;
    if (user.search) {
        let length = this.search.length;
        if (length > 8) {
            for (let i = 0; i < length - 8; i++) {
                this.search.splice(i, 1);
            }
        }
    }

})
module.exports = mongoose.model('User', userSchema);