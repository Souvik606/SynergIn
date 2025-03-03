import mongoose, {Schema} from "mongoose";

const userSchema = new mongoose.Schema({
  name:{type: String, required: true,},
  username:{type: String, required: true, unique: true},
  email:{type: String, required: true, unique: true},
  password:{type: String, required: true,},
  profilePicture:{type:String, default:""},
  bannerImg:{type:String, default:""},
  headline:{type:String, default:"Synergein User"},
  location:{type:String, default:"Earth"},
  about:{type:String, default:""},
  skills:[String],
  experiences:[{
    title:String,
    company:String,
    startDate:Date,
    endDate:Date,
    description:String,
  }],
  education:[{
    school:String,
    fieldOfStudy:String,
    startYear:Number,
    endYear:Number,
  }],
  connections:[{
    type:Schema.Types.ObjectId,
    ref:"User",
  }]
},{
  timestamps: true
})

export const User=mongoose.model("User",userSchema);