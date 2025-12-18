
import mongoose, { Document, Schema } from 'mongoose';

export interface IFolder extends Document {
  name: string;
  parentId: string | null;
  isRoot: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const folderSchema = new Schema<IFolder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parentId: {
      type: String,
      default: null,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

folderSchema.index({ parentId: 1 });

export const Folder = mongoose.model<IFolder>('Folder', folderSchema);