const {uploadFile, createFolder, listFiles, trashFile, moveFile}= require('../services/drive/crudDrive')
const path = require('path');
const fs=require('fs');

const listFilesHandler=async (req,res)=>{
    try {
        const folderId=req.query.listFolderId;//!Change the name as in the from data
        if(!folderId){
            return res.status(400).send('No folder id provided.');
        }
        res.send(await listFiles(folderId));
    } catch (error) {
        console.error("Drive Controller :: listFilesHandler :: Error :: ",error);
        res.status(500).send('Error listing files.');
    }
}

const createFolderHandler=async (req,res)=>{
    try {
        const {folderName, folderParentId}=req.body;
        res.send(await createFolder(folderName, folderParentId));
    } catch (error) {
        console.error("Drive Controller :: createFolderHandler :: Error :: ",error);
        res.status(500).send('Error creating folder.');
    }
}

const uploadFileHandler=async (req,res)=>{
    try {
        const folderId=req.body.uploadFolderId; //!Change the name as in the form data
        const files=req.files;
        if(!files){
            return res.status(400).send('No files were uploaded.');
        }
        if(!folderId){
            return res.status(400).send('No folder id provided.');
        }
        //TODO: Add seperate folder for each user
        
        const uploadPromise=files.map(file=>{
            const cleanedFilename=`${file.originalname.trim().replace(/[^\w\-_.]/g, '')}`;
            const filename=`${path.basename(cleanedFilename, path.extname(cleanedFilename))}-${Date.now()}${path.extname(cleanedFilename)}`;
            return uploadFile(folderId, filename, file.path, file.mimetype);
        });

        const fileIds= await Promise.all(uploadPromise);

        //Delete files from temp folder
        files.map(file=>{
            fs.unlinkSync(file.path);
        });

        res.status(200).json({ fileIds });
    } catch (error) {
        console.error('Drive Controller :: uploadFileHandler :: error ', error);
        res.status(500).send('Error uploading files.');
    }
}

const trashHandler=async(req,res)=>{
    try {
        const fileId=req.body.trashFileId; //!Change the name as in the form data    
        if(!fileId){
            return res.status(400).send('No file id provided.');
        }
        res.send(await trashFile(fileId));  
    } catch (error) {
        console.error("Drive Controller :: trashHandler :: Error :: ",error);
        res.status(500).send('Error trashing file.');
    }
}

const moveFileHandler = async (req, res)=>{
    try{
        const {moveFileId, moveFolderId}=req.body;
        if(!moveFileId || !moveFolderId){
            return res.status(400).send('File Id and Folder Id are required.');
        }
        res.send(await moveFile(moveFileId, moveFolderId));
    }catch(error){
        console.error("Drive Controller :: moveFileHandler :: Error :: ",error);
        res.status(500).send('Error moving file.');
    }
}

module.exports= {listFilesHandler, createFolderHandler, uploadFileHandler, trashHandler, moveFileHandler};  