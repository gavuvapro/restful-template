const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const allowSelfOrAdmin = require("../middlewares/ownership.middleware");
const userCtrl = require("../controllers/user.controller");

router.get("/", auth, authorize("ADMIN"), userCtrl.listUsers);
router.post("/", auth, authorize("ADMIN"), userCtrl.createUser);
router.get("/:id", auth, allowSelfOrAdmin(), userCtrl.getProfile);
router.put("/:id", auth, allowSelfOrAdmin(), userCtrl.updateUser);
router.delete("/:id", auth, authorize("ADMIN"), userCtrl.deleteUser);

module.exports = router;
