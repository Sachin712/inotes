const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "$achinisagoodboy";

//Route 1: Create a user using POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("email", "Enter a valid email id.").isEmail(),

    body("name", "Enter a valid name.").isLength({ min: 3 }),
    // password must be at least 5 chars long
    body("password", "Password must be atleast 5 characters.").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //return errors and bad requst if errors are present
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      //check whether user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "Sorry, a user with this email id already exists." });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //create new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: user.id,
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error.");
    }
  }
);

//Route 2: Authenticating a user using POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email id.").isEmail(),
    body("password", "Password can not be blank.").exists(),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (!user)
        return res
          .status(400)
          .json({success, error: "Please try to login with correct credentials." });

      const passCompare = await bcrypt.compare(password, user.password);
      if (!passCompare)
        return res
          .status(400)
          .json({success, error: "Please try to login with correct credentials." });
      const data = {
        user: user.id,
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error.");
    }
  }
);

//Route 3: Getting logged in user details POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    idfromuser = req.user.id;
    const user = await User.findById(idfromuser).select("-password");
    //console.log(idfromuser);
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;