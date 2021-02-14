import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: String,
    categoryDescription: String,
    isActive: {
        type: Boolean,
        default: true,
    },
});

interface ICategory extends mongoose.Document {
    categoryName: string,
    categoryDescription: string,
    isActive: boolean,
};

const Category = mongoose.model<ICategory>("Category", categorySchema);

export { Category, ICategory };