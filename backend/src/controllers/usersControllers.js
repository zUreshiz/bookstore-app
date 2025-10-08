import User from "../../model/User.js";
import bcryptjs from "bcryptjs";
import { validateUserInput } from "../utils/validateUser.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("getAllUsers failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log("getUserById failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    const errors = validateUserInput(req.body);
    if (errors.length) return res.status(422).json({ message: errors.join(", ") });

    //Kiểm tra xem người dùng có tồn tại không
    const existUser = await User.findOne({ email });
    if (existUser) return res.status(409).json({ message: "User already exists" });

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = new User({ name, email, phoneNumber, password: hashedPassword });
    const newUser = await user.save();

    // Xóa password khỏi data trả về
    const { password: _, ...userData } = newUser._doc;
    res.status(201).json(userData);
  } catch (error) {
    console.log("createUser failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    const errors = validateUserInput(req.body, true);
    if (errors.length) return res.status(422).json({ message: errors.join(", ") });

    // Kiểm tra trùng email
    if (email) {
      const existUser = await User.findOne({ email });
      if (existUser && existUser._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "User already exists" });
      }
    }

    let updateFields = { name, email, phoneNumber };

    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key]
    );

    // Hash password
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      updateFields.password = await bcryptjs.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userData } = updatedUser._doc;

    res.status(200).json(userData);
  } catch (error) {
    console.log("updateUser Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const { password, ...userData } = user._doc;
      res.status(200).json(userData);
    }
  } catch (error) {
    console.log("deleteUser Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};
