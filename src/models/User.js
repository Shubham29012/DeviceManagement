const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const {USER_ROLES}=require('../utils/constants');

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is Required'],
        trim:true,
        maxlength:[50,'Name cant be exceeded of 50 characters']
    },
    email:{
        type:String,
        required:[true,'Email is Required'],
        unique:true,
        lowercase:true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Password is Required'],
        minlength:[6,'Must be greater than 6 letter'],
        select:false
    },
    role:{
        type:String,
        enum:Object.values(USER_ROLES),
        default:USER_ROLES.USER
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    lastlogin:{
        type:Date
    }
},
{
timeStamps:true
})
//Hashed the password before Save in Db
userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
         return next();
        this.password=await bcrypt.hash(this.password,12);
        return next();
});
//Compare the Password
userSchema.methods.comparePassword=async function(userPassword){
    return await bcrypt.compare(userPassword,this.password);
}
module.exports=mongoose.model('User',userSchema);
