"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarqueeServices = void 0;
const marquee_model_1 = require("./marquee.model");
const getActiveMarqueeItemsFromDB = async () => {
    return await marquee_model_1.Marquee.find({ isActive: true }).sort({ priority: -1, createdAt: -1 });
};
const getAllMarqueeItemsFromDB = async (onlyActive = false) => {
    const query = onlyActive ? { isActive: true } : {};
    return await marquee_model_1.Marquee.find(query).sort({ priority: -1, createdAt: -1 });
};
const createMarqueeItemIntoDB = async (payload) => {
    const data = {
        headline: payload.headline || payload.text,
        targetLink: payload.targetLink !== undefined ? payload.targetLink : payload.link || "",
        isActive: payload.isActive !== undefined ? payload.isActive : false,
        priority: payload.priority || 0,
    };
    const result = await marquee_model_1.Marquee.create(data);
    return result;
};
const updateMarqueeItemInDB = async (id, payload) => {
    const updateData = {};
    if (payload.headline)
        updateData.headline = payload.headline;
    if (payload.text)
        updateData.headline = payload.text;
    if (payload.targetLink !== undefined)
        updateData.targetLink = payload.targetLink;
    if (payload.link !== undefined && payload.targetLink === undefined)
        updateData.targetLink = payload.link;
    if (payload.isActive !== undefined)
        updateData.isActive = payload.isActive;
    if (payload.priority !== undefined)
        updateData.priority = payload.priority;
    const result = await marquee_model_1.Marquee.findByIdAndUpdate(id, updateData, { new: true });
    return result;
};
const deleteMarqueeItemFromDB = async (id) => {
    const result = await marquee_model_1.Marquee.findByIdAndDelete(id);
    return result;
};
exports.MarqueeServices = {
    getActiveMarqueeItemsFromDB,
    getAllMarqueeItemsFromDB,
    createMarqueeItemIntoDB,
    updateMarqueeItemInDB,
    deleteMarqueeItemFromDB,
};
//# sourceMappingURL=marquee.service.js.map