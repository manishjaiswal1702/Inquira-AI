import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";


/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body { username, email, password }
 */
export async function register(req, res) {

    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "User already exists"
        })
    }

    // Create user with verified: false
    const user = await userModel.create({ 
        username, 
        email, 
        password,
        verified: false
    })

    // Send verification email
    const emailVerificationToken = jwt.sign({
        email: user.email,
    }, process.env.JWT_SECRET, { expiresIn: '24h' })

    await sendEmail({
        to: email,
        subject: "Verify Your Email - Inquira AI",
        html: `
            <h2>Welcome to Inquira AI, ${username}!</h2>
            <p>Thank you for registering. Please verify your email to get started.</p>
            <p><a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}" style="background-color: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
            <p>Or click this link: http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}</p>
            <p>This link expires in 24 hours.</p>
            <p>If you did not create this account, please ignore this email.</p>
            <p>Best regards,<br>The Inquira AI Team</p>
        `
    })

    res.status(201).json({
        message: "Registration successful! Please check your email to verify your account.",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            verified: user.verified
        }
    });

}


/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    // Check if email is verified
    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in. Check your inbox for the verification link.",
            success: false,
            err: "Email not verified"
        })
    }

    // Create JWT token for verified user
    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie("token", token)

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            verified: user.verified
        }
    })

}



/**
 * @desc Get current logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */
export async function getMe(req, res) {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })
}

/**
 * @desc Logout user
 * @route POST /api/auth/logout
 * @access Private
 */
export async function logout(req, res) {
    res.clearCookie("token");

    res.status(200).json({
        message: "Logout successful",
        success: true,
    })
}

/**
 * @desc Verify user's email address
 * @route GET /api/auth/verify-email
 * @access Public
 * @query { token }
 */
export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {
        if (!token) {
            return res.status(400).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Email Verification - Inquira AI</title>
                    <style>
                        body { font-family: Arial, sans-serif; background: #0f0f1e; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                        .container { background: #1a1a2e; padding: 40px; border-radius: 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
                        h1 { color: #ef4444; margin: 0 0 10px 0; }
                        p { color: #a0aec0; margin: 10px 0; }
                        a { color: #f97316; text-decoration: none; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>❌ Verification Failed</h1>
                        <p>No verification token provided.</p>
                        <p><a href="http://localhost:5173/login">Back to Login</a></p>
                    </div>
                </body>
                </html>
            `)
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Email Verification - Inquira AI</title>
                    <style>
                        body { font-family: Arial, sans-serif; background: #0f0f1e; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                        .container { background: #1a1a2e; padding: 40px; border-radius: 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
                        h1 { color: #ef4444; margin: 0 0 10px 0; }
                        p { color: #a0aec0; margin: 10px 0; }
                        a { color: #f97316; text-decoration: none; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>❌ User Not Found</h1>
                        <p>The email address in this verification link doesn't exist in our system.</p>
                        <p><a href="http://localhost:5173/register">Create an Account</a></p>
                    </div>
                </body>
                </html>
            `)
        }

        // Check if already verified
        if (user.verified) {
            return res.status(200).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Email Verification - Inquira AI</title>
                    <style>
                        body { font-family: Arial, sans-serif; background: #0f0f1e; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                        .container { background: #1a1a2e; padding: 40px; border-radius: 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
                        h1 { color: #f97316; margin: 0 0 10px 0; }
                        p { color: #a0aec0; margin: 10px 0; }
                        a { color: #f97316; text-decoration: none; font-weight: bold; padding: 10px 20px; display: inline-block; background: #f97316; color: #0f0f1e; border-radius: 5px; margin-top: 15px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>✓ Already Verified</h1>
                        <p>Your email is already verified!</p>
                        <p><a href="http://localhost:5173/login">Go to Login</a></p>
                    </div>
                </body>
                </html>
            `)
        }

        // Verify the user
        user.verified = true;
        await user.save();

        return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Email Verification - Inquira AI</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #0f0f1e; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                    .container { background: #1a1a2e; padding: 40px; border-radius: 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
                    h1 { color: #22c55e; margin: 0 0 10px 0; }
                    p { color: #a0aec0; margin: 10px 0; }
                    a { color: #f97316; text-decoration: none; font-weight: bold; padding: 10px 20px; display: inline-block; background: #f97316; color: #0f0f1e; border-radius: 5px; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>✓ Email Verified Successfully!</h1>
                    <p>Your email has been verified.</p>
                    <p>You can now log in to your account with your credentials.</p>
                    <a href="http://localhost:5173/login">Go to Login</a>
                </div>
            </body>
            </html>
        `);

    } catch (err) {
        return res.status(400).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Email Verification - Inquira AI</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #0f0f1e; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                    .container { background: #1a1a2e; padding: 40px; border-radius: 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
                    h1 { color: #ef4444; margin: 0 0 10px 0; }
                    p { color: #a0aec0; margin: 10px 0; }
                    a { color: #f97316; text-decoration: none; font-weight: bold; }
                    .error-msg { background: #7f1d1d; padding: 10px; border-radius: 5px; margin: 15px 0; color: #fecaca; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>❌ Verification Failed</h1>
                    <div class="error-msg">${err.message}</div>
                    <p>The verification link is invalid or has expired (24 hours).</p>
                    <p><a href="http://localhost:5173/login">Back to Login</a></p>
                </div>
            </body>
            </html>
        `)
    }
}