const mongoose  = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required : [true,'Please provide you name.'],
        trim:true,
    },
    email:{
        type : String,
        required:[true,'Please provide you email address'],
        unique : true,
        lowercase: true,
        trim: true,
        match : [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide valid email address',
        ],
    },
    password : {
        type: String,
        required : [true,'Please provide your password'],
        minLength : [6, 'Password must be at least 6 characters long.'],
        select : false,
    },
},
{
    timestamps:true,
}
);

userSchema.pre('save', async function () {
    // Only hash password if it has been modified
    if(!this.isModified('password')) return;
    
    this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare password
userSchema.methods.correctPassword = async function (candidatePasswrod , userPassword) {
    return await bcrypt.compare(candidatePasswrod,userPassword);
}


const User = mongoose.model('User',userSchema);
module.exports = User;