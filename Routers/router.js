
import express from "express"
import { addUser, generateToken, getUser, getuserbyId, getUserName, resetPassword, forgotPassword } from "../Contorllers/control.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'p94067636@gmail.com',
        password: 'flbzsazqdnffeviz'
    }
});

router.get("/getUser/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const user = await getuserbyId(id);
        if (!user) {
            return res.status(404).json({ message: "User does not exist " })
        }
        res.status(200).json({ data: user })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
})


router.get("/getUser", async (req, res) => {
    try {
        console.log("get a user");

        const user = await getUser(req.body);

        if (!user) {
            return res.status(404).json({ message: "User does not exist" })
        }
        res.status(200).json({ data: user })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.post("/forgot-password", async (req, res) => {
    try {
        //user exist validations
        const user = await getUser(req.body);
        if (!user) {
            return res.status(404).json({ message: "Invalid Email" })
        }

        const secret = 'rpuhsgpurgsuprurkkjhrtglwrfiy4fv,adhfye'
        const token = generateToken(user._id, secret);

        const link = `${token}`;

        const mailOptions = {
            from: 'p94067636@gmail.com',
            to: user.email,
            subject: 'Password reset link sent',
            text: `${link} use the token to reset the password`
        };
        const result = await forgotPassword(user.email, { password: secret })
        if (!result.lastErrorObject.updatedExisting) {
            return res.status(400).json({ message: "Error setting verification" })
        }
        else {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("Email not sent", error);
                    res.status(400).send({ message: "Error sending email", reset: result.lastErrorObject.updatedExisting });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).send({ result: result.lastErrorObject.updatedExisting });
                }
            });
        }

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


//for login

router.post("/login", async (req, res) => {
    try {
        const user = await getUser(req.body.email)
        if (!user) {
            return res.status(404).json({ message: "invalid email or passowrd" })
        }
        //valid the password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "password is inocrrect" })
        }
        const validUsername = await getUserName(req.body.name);
        if (!validUsername) {
            return res.status(400).json({ message: "username is inocrrect" })
        }
        const token = generateToken(user._id)
        console.log(token)
        res.send({ data: user, token: token })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "innternal server error" })


    }
})

//for singup
//before using the /singup use /user for not getting the error can not get  
router.post("/singup", async (req, res) => {
    try {
        //hashing user password

        const salt = await bcrypt.genSalt(10);
        const user = await getUser({ email: req.body.email });
        if (!user) {
            //console.log(salt)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            //console.log(hashedPassword)
            const hashedUser = await { ...req.body, password: hashedPassword }
            const result = await addUser(hashedUser)
            return res.status(200).json({ result, data: hashedUser });

        } res.status(400).json({ message: "email already exist " })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" })


    }
    //user exist with id



    // forgot password request, creates temporary token and emails reset link 


    // verifying and authorizing token to allow reset password
    router.get("/forgot-password/authorize/:id/:token", async (req, res) => {
        try {
            const { id, token } = req.params;
            //console.log(id, token);
            if (!id) {
                return res.status(404).json({ message: "User does not exist" })
            }
            if (!token) {
                return res.status(404).json({ message: "Invalid authorization" })
            }
            const user = await getUserByID(id);
            if (!user) {
                return res.status(404).json({ message: "Invalid Email" })
            }
            try {
                const decode = jwt.verify(token, user.password)
                //console.log(decode); 
                if (decode.id) {
                    res.status(200).json({ decode: decode })
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ message: "Token error", error: err });
            }

        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
    })


    // Resetting password in DB
    router.post('/reset-password/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const user = await getUserByID(id);
            const salt = await bcrypt.genSalt(10);
            if (!user) {
                return res.status(404).json({ message: "Invalid Email" })
            }
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const result = await resetPassword(id, { password: hashedPassword })
            if (!result.lastErrorObject.updatedExisting) {
                return res.status(400).json({ message: "Error resetting password" })
            }
            res.status(200).send({ result: result.lastErrorObject.updatedExisting, user: user });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
    })


})


export default router;