
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';


export const uploadToCloudinary = async (filePath, folder, resourceType = 'image') => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: resourceType,
   
  });

 
  fs.unlinkSync(filePath);

  return result;
};


export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};

