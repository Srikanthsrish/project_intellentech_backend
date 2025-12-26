const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, unique: true, required: true },

    password: { type: String },

    role: {
      type: String,
      enum: ["SuperAdmin", "Manager", "Employee", "Viewer"],
      required: true,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: String,

    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    employees: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    tasks: [
      {
        title: { type: String, required: true },
        taskUrl: { type: String, required: true, trim: true },
        submittedUrl: { type: String, default: "" },
        deadline: { type: Date },
        submissionDate: { type: Date, default: null },
        status: {
          type: String,
          enum: ["Pending", "In Progress", "Submitted", "Completed"],
          default: "Pending",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    userStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// 🔒 pre-save: hash password
UserSchema.pre("save", async function (next) {
  if (this.provider === "local" && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// 🔒 pre-save: remove empty fields on registration
UserSchema.pre("save", function (next) {
  if (this.isNew) {
    if (Array.isArray(this.employees) && this.employees.length === 0) {
      this.employees = undefined;
    }
    
    if (!this.managerId) {
      this.managerId = undefined;
    }
  }
  next();
});

// ✅ password compare method
UserSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
