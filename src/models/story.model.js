import prisma from "../config/prisma.js"

export const findStoryById = (storyId) => {
    return prisma.user.findUnique({
        where: { id: storyId },
        include: { role: true },
    });
}

export const findStoryByUserId = (userId) => {
    return prisma.role.findUnique({
        where: { authorId: userId }, 
        include: { user: true },
    });
}

export const createStory = async (data) => {
    return prisma.story.create({
        data,
    });
}

export const updateStory = async (storyId, data) => {
    return prisma.story.update({
        where: { id: storyId },
        data,
    });
}

export const deleteStory = async (storyId) => {
    return prisma.story.delete({
        where: { id: storyId },
    });
}