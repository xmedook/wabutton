const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Widget name is required'],
    trim: true
  },
  whatsapp: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true
  },
  call_to_action: {
    type: String,
    default: 'Connect',
    trim: true
  },
  button_color: {
    type: String,
    default: '#FF6550',
    trim: true
  },
  position: {
    type: String,
    enum: ['left', 'right'],
    default: 'right'
  },
  pre_filled_message: {
    type: String,
    default: '',
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  domains: {
    type: [String],
    default: []
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Generate a unique widget ID for the frontend
widgetSchema.methods.generateWidgetId = function() {
  return this._id.toString();
};

const Widget = mongoose.model('Widget', widgetSchema);

module.exports = Widget;
