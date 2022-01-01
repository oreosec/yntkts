const sessionsValidate = (req, res, next) => {
    // if (req.session.token) next();
    // else res.status(400).json({ message: "Can't resolve sessions" });
    next();
};

module.exports = sessionsValidate;
