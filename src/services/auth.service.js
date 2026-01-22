
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { config } from '../config/index.js';

export const registerUser = async (userData) => {
    const { name, email, password } = userData;

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // Generar Token
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: '7d',
    });

    return { user, token };
};

export const loginUser = async (credentials) => {
    const { email, password } = credentials;

    // Buscar usuario
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Generate Token
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: '7d',
    });

    // Registrar historial de login (implementación opcional)
    await prisma.loginHistory.create({
        data: {
            userId: user.id,
            // ip: podría pasarse aquí
        }
    });

    return { user, token };
};
