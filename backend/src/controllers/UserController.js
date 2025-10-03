import User from "../../model/User.js";
import bcryptjs from "bcryptjs";

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("getAllUser failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    //Kiểm tra xem người dùng có tồn tại không
    const exisUser = await User.findOne({ email });
    if (exisUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = new User({ name, email, phoneNumber, password: hashedPassword });
    const newUser = await user.save();

    // Xóa password
    const { password: _, ...userData } = newUser._doc;
    res.status(201).json(userData);
  } catch (error) {
    console.log("registerUser failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    if (email) {
      const exisUser = await User.findOne({ email });
      if (exisUser && exisUser._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "User already exists" });
      }
    }

    // Hash password
    let updateFields = { name, email, phoneNumber };
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
