const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    index: true,
    sparse: true,
    required: true,
  },
  password: {
    type: String,
  },
  waNumber: {
    type: String,
    unique: true,
    index: true,
    sparse: true,
    required: true
  },
  address: {
    1: {
      type: String,
    },
    2: {
      type: String,
    },
  },
  picture: {
    type: String,
    default: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E'
  },
  hasUserId: {
    type: Boolean,
    default: false
  },
  aadharVerified: {
    type: Boolean,
    default: false
  },
  associatedFaces: {
    type: Number,
    default: 0
  },
  dob: {
    type: String
  }
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified) {
    next()
  }
  let salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt)
})

UserSchema.methods.matchPassword = async function (pass) {
  return await bcrypt.compare(pass, this.password)
}

mongoose.models = {}

const User = mongoose.model('User', UserSchema)
module.exports = User