import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publicationDate: Date;
  rating: number;
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  genre: { type: String, required: true },
  publicationDate: { type: Date, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
});

export default mongoose.model<IBook>("Book", BookSchema);
