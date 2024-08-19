import prisma from "../../config/prisma.js";
import { imageKit } from "../../config/lib/imageKit.js";
import {
  handleSuccessResponse,
  handleErrorResponse,
} from "../../utils/handleResponse.js";
import { createStorySchema, updateStorySchema } from "../../schema/story.js";

export const createStory = async (req, res) => {
  const { title, content, authorId } = req.body;

  const { error } = createStorySchema.validate(
    { title, content, authorId },
    { abortEarly: false }
  );

  if (error) {
    return handleErrorResponse(
      res,
      error.details.map((err) => err.message).join(", "),
      400
    );
  }

  const file = req.file;

  if (!file) {
    return handleErrorResponse(res, "No file uploaded", 400);
  }

  try {
    const result = await new Promise((resolve, reject) => {
      imageKit.upload(
        {
          file: file.buffer,
          fileName: title,
          folder: "/binar-assets",
        },
        (uploadError, result) => {
          if (uploadError) {
            reject(uploadError);
          } else {
            resolve(result);
          }
        }
      );
    });

    const newStory = await prisma.story.create({
      data: {
        title,
        content,
        authorId,
        imageUrl: result.url,
        id: result.fileId,
      },
    });

    return handleSuccessResponse(
      res,
      "Story created successfully",
      newStory,
      201
    );
  } catch (uploadError) {
    return handleErrorResponse(res, uploadError.message, 500);
  }
};

export const updateStory = async (req, res) => {
  const { title, content } = req.body;

  const { error } = updateStorySchema.validate(
    { title, content },
    { abortEarly: false }
  );

  if (error) {
    return handleErrorResponse(
      res,
      error.details.map((err) => err.message).join(", "),
      400
    );
  }

  try {
    const story = await prisma.story.findUnique({
      where: { id: req.params.id },
    });

    if (!story) {
      return handleErrorResponse(res, "Story not found", 404);
    }

    const file = req.file;
    let updatedData = { title, content };

    if (file) {
      if (!title || typeof title !== "string") {
        return handleErrorResponse(res, "Invalid title", 400);
      }

      try {
        const result = await new Promise((resolve, reject) => {
          imageKit.upload(
            {
              file: file.buffer,
              fileName: title,
              folder: "/binar-assets",
            },
            (uploadError, result) => {
              if (uploadError) {
                reject(uploadError);
              } else {
                resolve(result);
              }
            }
          );
        });

        updatedData.imageUrl = result.url;
        updatedData.id = result.fileId;

        if (story.id) {
          await new Promise((resolve, reject) => {
            imageKit.deleteFile(story.id, (deleteError) => {
              if (deleteError) {
                reject(deleteError);
              } else {
                resolve();
              }
            });
          });
        }

        const updatedStory = await prisma.story.update({
          where: { id: req.params.id },
          data: updatedData,
        });

        return handleSuccessResponse(
          res,
          "Story updated successfully",
          updatedStory,
          200
        );
      } catch (updateError) {
        return handleErrorResponse(res, updateError.message, 500);
      }
    } else {
      const updatedStory = await prisma.story.update({
        where: { id: req.params.id },
        data: updatedData,
      });

      return handleSuccessResponse(
        res,
        "Story updated successfully",
        updatedStory,
        200
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error.message, 500);
  }
};

export const deleteStory = async (req, res) => {
  try {
    const story = await prisma.story.findUnique({
      where: { id: req.params.id },
    });

    if (!story) {
      return handleErrorResponse(res, "Story not found", 404);
    }

    const imageFileId = story.id;

    if (imageFileId) {
      await new Promise((resolve, reject) => {
        imageKit.deleteFile(imageFileId, (deleteError) => {
          if (deleteError) {
            reject(deleteError);
          } else {
            resolve();
          }
        });
      });
    }

    const deletedStory = await prisma.story.delete({
      where: { id: req.params.id },
    });

    return handleSuccessResponse(
      res,
      "Story deleted successfully",
      deletedStory,
      200
    );
  } catch (error) {
    return handleErrorResponse(res, error.message, 500);
  }
};

export const findStoryById = async (req, res) => {
  try {
    const story = await prisma.story.findUnique({
      where: { id: req.params.id },
      include: { author: true },
    });

    if (!story) {
      return handleErrorResponse(res, "Story not found", 404);
    }

    return handleSuccessResponse(
      res,
      "Story retrieved successfully",
      story,
      200
    );
  } catch (error) {
    return handleErrorResponse(res, error.message, 500);
  }
};

export const findStoriesByUserId = async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      where: { authorId: req.params.userId },
    });

    if (!stories || stories.length === 0) {
      return handleErrorResponse(res, "No stories found for this user", 404);
    }

    return handleSuccessResponse(
      res,
      "Stories retrieved successfully",
      stories,
      200
    );
  } catch (error) {
    return handleErrorResponse(res, error.message, 500);
  }
};
