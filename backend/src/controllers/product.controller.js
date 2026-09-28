import {deleteFiles, uploadFiles} from '../services/storage.service.js'
import {productModel} from '../models/product.model.js'

const createProductController = async (req, res) => {
    
    const fileUrls = [];
    const imageIDs = [];

    // mentos jindagi
    const promises = [];

    for(let i=0; i<req.files.length; i++){
        const response = uploadFiles(req.files[i].buffer, req.files[i].originalname)
        promises.push(response);
    }

    const responses = await Promise.all(promises);
    responses.forEach((res) => {
        fileUrls.push(res.url);
        imageIDs.push(res.fileId);
    });

    // normal jindagi

    // for(let i=0; i<req.files.length; i++){
    //     const response = await  uploadFiles(req.files[i].buffer, req.files[i].originalname)
    //     fileUrls.push(response.url);
    //     imageIDs.push(response.fileId);
    // }

    const product = await productModel.create({
        title: req.body.title,
        description: req.body.description,
        images: fileUrls,
        imageIDs,
        price: {
            amount: req.body.price.amount,
            currency: req.body.price.currency
        },
        sizes: req.body.sizes,
        seller: req.user.userID
    })

    return res.status(200).json({
        message: "Product Created successfully.",
        data: {
            product
        }
    });

}

const getAllProductController = async (req, res) => {
    const products = await productModel.find({isListed: true});
    return res.status(200).json({
        message: "Products Fetched successfully",
        data: {
            products
        }
    })
}

const getSingleProductController = async (req, res) => {
    try{
        const id = req.params.id
        const product = await productModel.findById(id);
        return res.status(200).json({
            message: "Product Fetched successfully",
            data: {
                product
            }
        })
    }catch(err){
        return res.status(400).json({
            message: "Error in single product",
            errors: err
        })
    }
}

const getAllSellerProductController = async (req, res) => {
    const products = await productModel.find();
    return res.status(200).json({
        message: "Products Fetched successfully",
        data: {
            products
        }
    })
}

const listProductController = async (req, res) => {
    const id = req.params.id
    const product = await productModel.findByIdAndUpdate(id, {isListed: true})
    return res.status(200).json({
        message: "Product Listed Successfully",
        data: {
            product
        }
    })
}

const unlistProductController = async (req, res) => {
    const id = req.params.id
    const product = await productModel.findByIdAndUpdate(id, {isListed: false})
    return res.status(200).json({
        message: "Product Unlisted Successfully",
        data: {
            product
        }
    })
}

const deleteProductController = async (req, res) => {
    const id = req.params.id;
    const product = await productModel.findById(id);
    const fileids = product.imageIDs || [];

    // normal jindagi

    // for(let i=0; i<fileids.length; i++){
    //     await deleteFiles(fileids[i])
    // }

    // mentos jindagi

    const promises = fileids.map(id => deleteFiles(id));
    await Promise.all(promises);

    const deletedproduct = await productModel.findByIdAndDelete(id);

    return res.status(200).json({
        message: "Product deleted successfully",
        data: {
            product: deletedproduct
        }
    })
}

export {createProductController, getAllProductController, getSingleProductController, deleteProductController, getAllSellerProductController, listProductController, unlistProductController}