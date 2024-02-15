const mongoose = require('mongoose')

const { Schema } = mongoose;

const InsurancSchema = new Schema({
  companyName: {
    type: String,
    required: true,
  },
  policyName: {
    type: String,
    required: true,
  },
  premium: {
    type: Number,
    required: true,
  },
  coverage: {
    type: Number,
    required: true,
  },
  benifits: [{
    type: String,
    required: true,
  }],
  logo: {
    type: String,
    required: true,
  },
  address: {
    1: {
      type: String,
    },
    2: {
      type: String,
    },
  },
})

mongoose.models = {}

const Insurance = mongoose.model('Insurance', InsurancSchema)
module.exports = Insurance