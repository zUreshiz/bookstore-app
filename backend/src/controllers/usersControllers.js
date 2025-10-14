import User from "../../model/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

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
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

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
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Not authorized to update this user" });
    }
    const { name, email, phoneNumber, password } = req.body;

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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Please provide email and password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const accessToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
    user.refreshToken = refreshToken;
    await user.save();

    const { password: pw, refreshToken: _, ...userData } = user._doc;
    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken, user: userData });
  } catch (error) {
    console.log("loginUser Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(404).json({ message: "No refresh token provided" });

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(404).json({ message: "User not found or already logged out" });
    }
    user.refreshToken = "";
    await user.save();
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout Failed" });
  }
};
