import Joi from "joi";

export const createStorySchema = Joi.object({
    title: Joi.string().required().messages({
        "string.base": `"Title" should be a type of 'text'`,
        "string.empty": `"Title" cannot be an empty field`,
        "any.required": `"Title" is a required field`,
    }),
    content: Joi.string().required().messages({
        "string.base": `"Content" should be a type of 'text'`,
        "string.empty": `"Content" cannot be an empty field`,
        "any.required": `"Content" is a required field`,
    }),
    authorId: Joi.string().uuid().required().messages({
        "string.base": `"Author ID" should be a type of 'text'`,
        "string.guid": `"Author ID" must be a valid UUID`,
        "any.required": `"Author ID" is a required field`,
    }),
});

export const updateStorySchema = Joi.object({
    title: Joi.string().optional().messages({
        "string.base": `"Title" should be a type of 'text'`,
    }),
    content: Joi.string().optional().messages({
        "string.base": `"Content" should be a type of 'text'`,
    }),
    image: Joi.string().optional().uri().messages({
        "string.base": `"Image URL" should be a type of 'text'`,
        "string.uri": `"Image URL" must be a valid URI`,
    }),
});

