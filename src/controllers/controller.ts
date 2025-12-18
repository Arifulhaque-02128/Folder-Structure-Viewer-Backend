import { Request, Response } from 'express';
import { Folder } from '../models/Folders';

// fetching all folders and building tree 
export const getFolders = async (req: Request, res: Response): Promise<void> => {
  try {
    const folders = await Folder.find().sort({ createdAt: 1 });
    
    const folderMap = new Map();
    const tree: any[] = [];

    folders.forEach((folder) => {
      folderMap.set(folder._id.toString(), {
        _id: folder._id,
        name: folder.name,
        parentId: folder.parentId,
        isRoot: folder.isRoot,
        children: [],
      });
    });

    folders.forEach((folder) => {
      const node = folderMap.get(folder._id.toString());
      if (folder.parentId === null) {
        tree.push(node); // All folders without parent are root level
      } else {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children.push(node);
        }
      }
    });

    res.status(200).json({
      success: true,
      data: tree,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching folders',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Create a new folder
export const createFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, parentId } = req.body;

    if (!name || name.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Folder name is required',
      });
      return;
    }

    // Check if parent exists 
    if (parentId) {
      const parentExists = await Folder.findById(parentId);
      if (!parentExists) {
        res.status(404).json({
          success: false,
          message: 'Parent folder not found',
        });
        return;
      }
    }

    const newFolder = await Folder.create({
      name: name.trim(),
      parentId: parentId || null,
      isRoot: parentId === null, 
    });

    res.status(201).json({
      success: true,
      data: newFolder,
      message: 'Folder created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating folder',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete a folder and all its children
export const deleteFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const folder = await Folder.findById(id);

    if (!folder) {
      res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
      return;
    }

    // root folder can not be deleted
    if (folder.parentId === null) {
      res.status(403).json({
        success: false,
        message: 'Cannot delete root folder',
      });
      return;
    }
    // deleting all the childs 
    await deleteChildrenRecursively(id);

    // Delete the folder itself
    await Folder.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Folder and its children deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting folder',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};


const deleteChildrenRecursively = async (parentId: string): Promise<void> => {
  const children = await Folder.find({ parentId });
  
  for (const child of children) {
    await deleteChildrenRecursively(child._id.toString());
    await Folder.findByIdAndDelete(child._id);
  }
};

// If root folder doesn't exist, create one 
export const initializeRoot = async (): Promise<void> => {
  try {

    const rootExists = await Folder.findOne({ parentId: null });
    
    if (!rootExists) {
      await Folder.create({
        name: 'Root',
        parentId: null,
        isRoot: true,
      });
      console.log('Default root folder created');
    }
  } catch (error) {
    console.error('Error initializing root folder:', error);
  }
};