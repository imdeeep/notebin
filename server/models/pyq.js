const mongoose = require("mongoose");
const { stringify } = require("querystring");

const pyqSchema = new mongoose.Schema(
  {
    filename: { 
      type: String, 
      // required: true 
    },
    fileUrl: { 
      type: String, 
      required: true 
    },
    title:{
      type: String,
      required: true
    },
    subject: { 
      type: String, 
      required: true 
    },
    semester: { 
      type: String, 
      required: true 
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    exam:{
      type:String,
      required:true
    },
    year:{
      type:String,  
      required:true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pyq", pyqSchema)