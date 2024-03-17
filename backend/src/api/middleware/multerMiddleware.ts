import multer, { DiskStorageOptions, StorageEngine } from 'multer';
import { Request } from 'express';
const fs = require('fs');
const path = require('path');

// Define the storage options
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const directoryPath = path.join(__dirname, '../../public/assets');
    if (!fs.existsSync(directoryPath)){
      fs.mkdirSync(directoryPath, { recursive: true });
    }        
    cb(null, directoryPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, file.originalname);
  },
});

// Create the multer instance with the storage configuration
const upload: multer.Multer = multer({ storage });

export default upload;
