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

const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, sizes } = req.body;

    const product = await productModel.findOne({ _id: id, seller: req.user.userID });

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    let updatedFileUrls = [...product.images];
    let updatedImageIDs = [...product.imageIDs];

    if (req.body.imagesToDelete) {
      const imagesToDelete = Array.isArray(req.body.imagesToDelete)
        ? req.body.imagesToDelete
        : JSON.parse(req.body.imagesToDelete || "[]");

      for (const fileId of imagesToDelete) {
        // Optional: Call your cloud delete utility here
        await deleteFiles(fileId)

        const index = updatedImageIDs.indexOf(fileId);
        if (index !== -1) {
          updatedImageIDs.splice(index, 1);
          updatedFileUrls.splice(index, 1);
        }
      }
    }

    // 3. Handle upload of new images if provided in request
    if (req.files && req.files.length > 0) {
      const promises = req.files.map((file) =>
        uploadFiles(file.buffer, file.originalname)
      );

      const responses = await Promise.all(promises);

      responses.forEach((uploaded) => {
        updatedFileUrls.push(uploaded.url);
        updatedImageIDs.push(uploaded.fileId);
      });
    }

    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.images = updatedFileUrls;
    product.imageIDs = updatedImageIDs;

    if (price) {
      product.price = {
        amount: price.amount ?? product.price.amount,
        currency: price.currency ?? product.price.currency,
      };
    }

    if (sizes) {
      product.sizes = sizes;
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully.",
      data: {
        product,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update product.",
      error: error.message,
    });
  }
};

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

export {createProductController, getAllProductController, updateProductController, getSingleProductController, deleteProductController, getAllSellerProductController, listProductController, unlistProductController}