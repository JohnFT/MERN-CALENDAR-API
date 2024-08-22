const { Router } = require("express");
const { check } = require("express-validator");
const { createUser, userLogin, validateToken } = require("../controllers/auth");
const { fieldsValidator } = require("../middlewares/fieldsValidator");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

router.post(
  "/",
  [
    //middlewares
    check("email", "Email is not email valid").isEmail(),
    check("password", "Password is required and have six characters")
      .not()
      .isEmpty()
      .isLength({ min: 6 }),
    fieldsValidator,
  ],
  userLogin
);

router.post(
  "/new",
  [
    //middlewares
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is not email valid").isEmail(),
    check("password", "Password is required and have six characters")
      .not()
      .isEmpty()
      .isLength({ min: 6 }),
    fieldsValidator,
  ],
  createUser
);

router.get("/renew", validateJWT, validateToken);

module.exports = router;
