
import prisma from '../utils/prisma.js';

export const saveDeviceToken = async (userId, token, platform) => {
    return await prisma.deviceToken.upsert({
        where: { token },
        update: { userId, platform, createdAt: new Date() },
        create: { userId, token, platform },
    });
};
