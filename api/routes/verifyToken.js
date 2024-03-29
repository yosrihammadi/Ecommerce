const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.token;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, process.env.JWT_SEC, (err, user) => {
			if (err) res.status(403).json("Token is not valid!");
			req.user = user;
			console.log("token verified!");
			next();
		});
	} else {
		return res.status(401).json("You are not authenticated!");
	}
};

const verifyTokenAndAuthorization = (req, res, next) => {
	verifyToken(req, res, () => {
		console.log(req.user);
		console.log(req.user.id, req.params.id);
		if (req.user.id === req.params.id || req.user.isadmin === 1) {
			next();
		} else {
			res.status(403).json("You are not allowed to do that");
		}
	});
};

const verifyTokenAndAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		console.log(req.user);
		if (req.user.isadmin === 1) {
			next();
		} else {
			res.status(403).json("You are not allowed to do that");
		}
	});
};

module.exports = {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
};
