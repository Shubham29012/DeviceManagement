const mongoose=require('mongoose');
const {DEVICE_TYPES,DEVICE_STATUS}=require('../utils/constants');
const deviceSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
        maxlength:[50,'Max length should be not more than 50']
    },
    type:{
        type:String,
        required:[true,'Type is Required'],
        enum:Object.values(DEVICE_TYPES)
    },
    status:{
        type:String,
        enum:Object.values(DEVICE_STATUS),
        default:DEVICE_STATUS.ACTIVE
    },
    owner_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
    },
    last_active_at:{
        type:Date,
        default:null
    },
    metadata:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    }
},
{
    timestamps:true
},)
// Indexing  for efficient queries
deviceSchema.index({ owner_id: 1, type: 1 });
deviceSchema.index({ status: 1, last_active_at: 1 });
module.exports=mongoose.model('Device',deviceSchema);