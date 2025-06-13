import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sender_name: { type: String, required: true },
    designation: { type: String, required: true },
    service_no: { type: String, required: true, unique: true },
    section: { type: String, required: true },
    group_number: { type: String, required: true },
    contact_number: { type: String, required: true },
    branch_location: { type: String, required: true},
    role: { type: String, enum: ["user", "admin","executive_officer","duty_officer","security_officer", "super admin"], default: "user" },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Prevent overwriting model
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
