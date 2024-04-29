const express = require('express');
const router = express.Router();
require('dotenv/config');
const multer = require('multer');
const path = require('path');
const common = require("../../common");

const controller_auth = require("../../controller/portal/auth");
const { exists } = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var storePath = path.join(__dirname, process.env.WRITE_STORAGE_PATH);
        callback(null,storePath);
    },
    filename: (req, file, callback) => {
        let myFile = file.originalname.split(".")
		const fileType = myFile[myFile.length - 1];
       
        common.generate_name()
        .then((name)=>{
           
            req.response = {
                status:200,
                message:"Success",
                description:"Image Updated Successfully",
                image_name:name+"."+fileType
            }       
            callback(null, name + '.' + fileType );
        })
        .catch((error)=>{
           
            req.response = {
                status:500,
                message:"Internal Server Error",
                description:"Error while generating name for image",
            }   
            callback(null,"Error");
        })
    }
});
const upload_file = multer({ storage: storage }).single('file');


function upload_image(req,res)
{

    console.log("Error")
    if(req.response.status == 200)
    {
        console.log('Uploading image');
        res.status(200).json({message:"Success", image_name: process.env.READ_FILE_URL + req.response.image_name});
    }
    else
    {
        console.log('Uploading image not found');
        res.status(req.response.status).json({
            message:req.response.description
        })
    }
}
router.post("/upload-image",upload_file, upload_image);

router.post("/category/create", controller_auth.create_category);
router.post("/category/update", controller_auth.update_category);
router.get("/category/delete", controller_auth.delete_category);
router.get("/category/fetch", controller_auth.fetch_category);

router.post("/sub-category/create", controller_auth.create_sub_category);
router.post("/sub-category/update", controller_auth.update_sub_category);
router.get("/sub-category/delete", controller_auth.delete_sub_category);
router.get("/sub-category/fetch", controller_auth.fetch_sub_category);

router.post("/product/create", controller_auth.create_product);
router.post("/product/update", controller_auth.update_product);
router.get("/product/delete", controller_auth.delete_product);
router.get("/product/fetch", controller_auth.fetch_product);

router.post("/banner/create", controller_auth.create_banner);
router.post("/banner/update", controller_auth.update_banner);
router.get("/banner/delete", controller_auth.delete_banner);
router.get("/banner/fetch", controller_auth.fetch_banner);

module.exports = router;