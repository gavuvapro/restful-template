// allowSelfOrAdmin: allows ADMIN or the owner (id matches req.params.id or req.user.id)
module.exports = function allowSelfOrAdmin() {
  return (req, res, next) => {
    const user = req.user;
    const targetId = req.params.id;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (user.role === "ADMIN") return next();
    if (String(user.id) === String(targetId)) return next();
    return res.status(403).json({ success: false, message: "Forbidden" });
  };
};
