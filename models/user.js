const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        email: {
          type: String,
          trim: true,
          required: true
        },
        password: {
          type: String,
          required: true,
          min: 6,
          max: 64,
        },
        role: {
          type: [String],
          default: ["Admin"],
          enum: ["Utilisateur", "Admin"],
        },
        passwordResetCode: {
          data: String,
          default: "",
        }
      },
      { timestamps: true }
    );

module.exports = mongoose.model('User', userSchema);