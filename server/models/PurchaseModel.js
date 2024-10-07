const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Purchase must have a name'],
  },
  price: {
    type: Number,
    required: [true, 'Purchase must have a price'],
  },
  participants: {
    type: Number,
    required: [true, 'Purchase must have participants'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['course', 'workshop'],
    required: true,
  },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
