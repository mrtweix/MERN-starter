import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please add first name'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Please add last name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      maxlength: [255, 'Should not be more than 255 characters'],
      unique: [true, 'Email already exists'],
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      lowercase: true,
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      trim: true,
      minlength: 6
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false
    }
  },
  {
    toObject: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    },
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  },
  {
    timestamps: true
  }
);

// Encrypt password
UserSchema.pre('save', async function (next) {
  // only hash the password if it has been modified (or is new)
  if (this.isModified('password')) {
    // generate a salt
    const salt = await bcrypt.genSalt(10);
    // hash the password using the salt
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Match entered password to hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
