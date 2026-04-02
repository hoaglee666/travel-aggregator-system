import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sql from 'mssql';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, fullName } = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required' });
            return;
        }

        const request = new sql.Request();

        // 1. Check if user already exists
        const checkResult = await request
            .input('email', sql.VarChar, email)
            .query('SELECT user_id FROM USERS WHERE email = @email');

        if (checkResult.recordset.length > 0) {
            res.status(409).json({ success: false, message: 'Email is already registered' });
            return;
        }

        // 2. Hash the password for security (Salt rounds: 10)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Insert the new user into the database
        await request
            .input('newEmail', sql.VarChar, email)
            .input('passwordHash', sql.VarChar, passwordHash)
            .input('fullName', sql.NVarChar, fullName || 'New User')
            .input('role', sql.VarChar, 'Member') // Default role
            .query(`
                INSERT INTO USERS (email, password_hash, full_name, role)
                VALUES (@newEmail, @passwordHash, @fullName, @role)
            `);

        res.status(201).json({ success: true, message: 'User registered successfully!' });

    } catch (error) {
        console.error('[Auth] Registration Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required' });
            return;
        }

        const request = new sql.Request();

        // 1. Find the user in the database
        const userResult = await request
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM USERS WHERE email = @email');

        const user = userResult.recordset[0];

        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }

        // 2. Compare the provided password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }

        // 3. Generate the JWT Session Token
        const token = jwt.sign(
            { userId: user.user_id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user.user_id,
                email: user.email,
                fullName: user.full_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('[Auth] Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};