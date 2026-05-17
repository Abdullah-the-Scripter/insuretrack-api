const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppDataSource = require("../config/db");
const asyncHandler = require("../middleware/asyncHandler");

exports.register = async (req, res) => {
  const repo = AppDataSource.getRepository("User");

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = repo.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: 'policyholder', 
    });

    const savedUser = await repo.save(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (err) {
    console.error("Registration Logic Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.login = asyncHandler(async (req, res) => {
  const repo = AppDataSource.getRepository("User");
  const user = await repo.findOneBy({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Wrong password" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET
  );

  return res.json({ 
    token, 
    user: { id: user.id, name: user.name, email: user.email, role: user.role } 
  });
});