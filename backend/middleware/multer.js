import multer from "multer";


import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({ 
    destination(req,file,cb){
        cb(null, "./uploads");
    },
    filename(req,file,cb){
       const id = uuidv4();

         const ext=file.originalname.split(".").pop();
         const filename=`${id}.${ext}`;
         cb(null, filename);    

    }   
});

export const upload = multer({storage}).single("image");