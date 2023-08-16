import Jwt from "jsonwebtoken";
export function isAuthenticated(req, res, next) {
    const token = req.headers["X-auth_token"];
    if (!tokenn) {
        return res.status(401).send({ message: "invalid authenticationn" })
    }
    const decode = Jwt.verify(token, process.env.SECRET_KEY)
    console.log(decode)
    next();
}

//