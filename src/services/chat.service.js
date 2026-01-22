
import prisma from '../utils/prisma.js';

export const saveMessage = async (roomId, senderId, content, type = 'TEXT') => {
    return await prisma.message.create({
        data: {
            roomId: parseInt(roomId),
            senderId,
            content,
            type,
        },
        include: {
            sender: {
                select: { id: true, name: true, avatar: true },
            },
        },
    });
};

export const getMessages = async (roomId, limit = 50, offset = 0) => {
    return await prisma.message.findMany({
        where: { roomId: parseInt(roomId) },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
            sender: {
                select: { id: true, name: true, avatar: true },
            },
        },
    });
};

export const createOrGetDirectRoom = async (user1Id, user2Id) => {
    // Verificar si existe sala entre estos usuarios (lógica simplificada)
    // Una implementación adecuada verificaría RoomParticipants donde userId IN [u1, u2]
    // Por simplicidad, asumimos creación genérica o usando nombre como "u1-u2"

    // Mejor Enfoque: Consultar una sala que tenga EXACTAMENTE estos participantes
    /*
      SELECT r.id FROM "Room" r
      JOIN "RoomParticipants" rp1 ON r.id = rp1."roomId" AND rp1."userId" = $1
      JOIN "RoomParticipants" rp2 ON r.id = rp2."roomId" AND rp2."userId" = $2
      WHERE r.type = 'DIRECT'
    */

    // Implementación Prisma
    const rooms = await prisma.room.findMany({
        where: {
            type: 'DIRECT',
            participants: {
                every: {
                    userId: { in: [user1Id, user2Id] }
                }
            }
        },
        include: {
            participants: true
        }
    });

    // Filtrar coincidencia exacta (longitud 2)
    const existingRoom = rooms.find(r => r.participants.length === 2);

    if (existingRoom) return existingRoom;

    // Crear nueva sala
    return await prisma.room.create({
        data: {
            type: 'DIRECT',
            participants: {
                create: [
                    { userId: user1Id },
                    { userId: user2Id }
                ]
            }
        }
    });
};
