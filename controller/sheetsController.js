const {getSheetData, createDoc}= require('../services/sheets/sheetServices');


const createDocController = async (req, res)=>{
    try {
        const {docTitle}=req.body;
        if(!docTitle) {
            console.error("Sheet Contoller :: createDoc :: docTitle is required");
            return res.status(400).json({message:'docTitle is required'})
        }
        const docId = await createDoc(docTitle);
        res.json({docId});
    } catch (error) {
        console.error("Sheet Contoller :: createDoc :: error",error);
        res.status(500).json({message:'Internal Server Error'});
    }
}

const getSheetDataController= async(req,res)=>{
    try {
        const {docId,sheetTitle}=req.query;
        if(!docId || !sheetTitle) {
            console.error("Sheet Contoller :: getSheetValues :: docId and sheetTitle are required");
            return res.status(400).json({message:'docId and sheetTitle are required'})
        }
        res.json(await displaySheet(docId,sheetTitle));
    } catch (error) {
        console.error("Sheet Contoller :: getSheetValues :: error",error);
        res.status(500).json({message:'Internal Server Error'});
    }
}

module.exports={getSheetDataController, createDocController};