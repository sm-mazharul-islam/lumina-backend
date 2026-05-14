import mongoose, { Schema, Document } from "mongoose";

export interface IGeneration extends Document {
  userId: mongoose.Types.ObjectId;
  toolId: string;
  toolName: string;
  prompt: string;
  content: string;
  createdAt: Date;
}

const GenerationSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  toolId: { type: String, required: true },
  toolName: { type: String, required: true },
  prompt: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IGeneration>("Generation", GenerationSchema);
