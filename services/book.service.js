import prisma from "../config/db.config.js";
import { createBookValidation , printingCostValidation, onlinePublishValdation, offlinePublishValdation } from "../validations/book.validation.js";
import cloudinaryFile from "../utils/cloudinary.js"
import { v2 as cloudinary} from "cloudinary";
import { orderplaced, newOrder, publishingEmail, unPublishingEmail, statusChangeEmail} from "../services/email.service.js"
import fs from "fs";

export const createBook = async(title, description,content,thumbnail,cover,categoryId, userId) => {
    let contentUpload, thumbnailUpload, coverUpload;
    try {
        
        let { error } = createBookValidation.validate({title, description,categoryId});

        if(error){
            throw error;
        }

        if(!content || !thumbnail || !cover){
            throw new Error("Content, thumbnail and cover are required");
        }
        
        contentUpload = await cloudinaryFile(content);
        thumbnailUpload = await cloudinaryFile(thumbnail);
        coverUpload = await cloudinaryFile(cover);

        [content, thumbnail, cover].forEach(file => {
            if (file) deleteLocalFile(file);
        });

        return await prisma.book.create({
            data : {
                title, 
                description,
                contentUrl : contentUpload.secure_url,
                contentPublic_id : contentUpload.public_id,
                thumbnailUrl : thumbnailUpload.secure_url,
                thumbnailPublic_id : thumbnailUpload.public_id,
                coverImageUrl : coverUpload.secure_url,
                coverImagePublic_id : coverUpload.public_id,
                categoryId, 
                authorId : userId
            }
        });

    } catch (error) {

        [content, thumbnail, cover].forEach(file => {
            if (file) deleteLocalFile(file);
        });

        if(contentUpload?.public_id){
            await cloudinary.uploader.destroy(contentUpload.public_id);
        }
        if(thumbnailUpload?.public_id){
            await cloudinary.uploader.destroy(thumbnailUpload.public_id);
        }
        if(coverUpload?.public_id){
            await cloudinary.uploader.destroy(coverUpload.public_id);
        }
        throw error;
    }
}

let deleteLocalFile = (filePath) => {
    if (!filePath) return;

    fs.unlink(filePath, (err) => {
        if (err) console.log("Local file delete error:", err);
    });
}

export const updateBook = async(bookId, newTitle, newDesc,content,thumbnail,cover,newCategoryId) => {
    let contentUpload, thumbnailUpload, coverUpload;

    try {

        let oldBook = await prisma.book.findUnique({
            where : {bookId}
        });        
        if (!oldBook) {
            throw new Error("Book not found");
        }
        let title = newTitle ?? oldBook.title;
        let description = newDesc ?? oldBook.description;
        let categoryId = newCategoryId ?? oldBook.categoryId;

        let { error } = createBookValidation.validate({title, description,categoryId});

        if(error){
            throw error;
        }

        let contentUrl = oldBook.contentUrl;
        let contentPublicId = oldBook.contentPublic_id;
        if(content) {
            let contentUpload = await cloudinaryFile(content);
            contentUrl = contentUpload.secure_url;
            contentPublicId = contentUpload.public_id;
        }

        let thumbnailUrl = oldBook.thumbnailUrl;
        let thumbnailPublicId = oldBook.thumbnailPublic_id;
        if (thumbnail) {
            let thumbnailUpload = await cloudinaryFile(thumbnail);
            thumbnailUrl = thumbnailUpload.secure_url;
            thumbnailPublicId = thumbnailUpload.public_id;
        }

        let coverUrl = oldBook.coverImageUrl;
        let coverPublicId = oldBook.coverImagePublic_id;
        if (cover) {
            let coverUpload = await cloudinaryFile(cover);
            coverUrl = coverUpload.secure_url;
            coverPublicId = coverUpload.public_id;
        }

        let updatedBook =  await prisma.book.update({
            where : {bookId},
            data : {
                title, 
                description,
                contentUrl : contentUrl,
                contentPublic_id : contentPublicId,
                thumbnailUrl : thumbnailUrl,
                thumbnailPublic_id : thumbnailPublicId,
                coverImageUrl : coverUrl,
                coverImagePublic_id : coverPublicId,
                categoryId 
            }
        });

        if (content && oldBook.contentPublic_id) {
            await cloudinary.uploader.destroy(oldBook.contentPublic_id);
        }

        if (thumbnail && oldBook.thumbnailPublic_id) {
            await cloudinary.uploader.destroy(oldBook.thumbnailPublic_id);
        }

        if (cover && oldBook.coverImagePublic_id) {
            await cloudinary.uploader.destroy(oldBook.coverImagePublic_id);
        }

        [content, thumbnail, cover].forEach(file => {
            if (file) deleteLocalFile(file);
        });

        return updatedBook;
    } catch (error) {

        if(contentUpload?.public_id){
            await cloudinary.uploader.destroy(contentUpload.public_id);
        }
        if(thumbnailUpload?.public_id){
            await cloudinary.uploader.destroy(thumbnailUpload.public_id);
        }
        if(coverUpload?.public_id){
            await cloudinary.uploader.destroy(coverUpload.public_id);
        }
        [content, thumbnail, cover].forEach(file => {
            if (file) deleteLocalFile(file);
        });
        throw error;
    }
}

export const removeBook = async(bookId) => {
    try {
        let book = await prisma.book.findUnique({
            where : {bookId}
        });
        if (!book) {
            throw new Error("Book not found");
        }
        if (book.contentPublic_id) {
            await cloudinary.uploader.destroy(book.contentPublic_id);
        }

        if (book.thumbnailPublic_id) {
            await cloudinary.uploader.destroy(book.thumbnailPublic_id);
        }

        if (book.coverImagePublic_id) {
            await cloudinary.uploader.destroy(book.coverImagePublic_id);
        }
        
        await prisma.book.delete({
            where : {bookId}
        })

    } catch (error) {
        throw error;
    }
}

export const changeStatus = async(bookId, userEmail) =>{
    try {
        let book = await prisma.book.findUnique({
            where : {bookId}
        });
        if (!book) {
            throw new Error("Book not found");
        }

        const newStatus = !book.isActive;
        await prisma.book.update({
            where : {bookId},
            data : {
                isActive : newStatus
            }
        })
        await statusChangeEmail(userEmail);
    } catch (error) {
        throw error;
    }
}

export const printingCost = async(vendorId, quantity,totalPage) => {

    let { error } = printingCostValidation.validate({vendorId, quantity,totalPage});
    if(error){
        throw error;
    }

    try {
        const findValidVendor = await prisma.user.findFirst({
            where : {
                userId : vendorId,
                role : {
                    roleName : "Vendor"
                }
            }
        });
                
        if (!findValidVendor) {
            throw new Error("vendor doesn't exists")
        }
    
        const vendorCost = await prisma.vendorCost.findUnique({
            where : { vendorId }
        });
            
        if(!vendorCost) throw new Error("vendor cost not found");
                
        const singleBookPrice = vendorCost.costPerPage * totalPage;
                
        const totalPrice = singleBookPrice * quantity
        
        return {singleBookPrice, totalPrice, quantity}
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const bookPublish = async(bookId, publishMode, price, keywords,vendorId, quantity,totalPage,address, userId, userEmail) => {

    try {

        if(publishMode === "online" || publishMode === 1){

            let { error } = onlinePublishValdation.validate({price, keywords});
            if(error){
                throw error;
            }

            const checkPublishStatus = await prisma.book.findUnique({
                where :{ bookId : bookId}
            })
            if (checkPublishStatus.isPublished === true ) {
                throw new Error("book is already published");
            }

            let updateBook = await prisma.book.update({
                where : {bookId},
                data : {
                    price,
                    keywords,
                    isActive : true,
                    isPublished : true,
                    publishMode : publishMode
                }
            });
            if(updateBook){ await publishingEmail(userEmail,publishMode)};
        }
        if(publishMode === "offline" || publishMode === 2){

            let { error } = offlinePublishValdation.validate({vendorId, quantity,totalPage,address});
            if(error){
                throw error;
            }
            await prisma.$transaction(async (tx) => {

                let { totalPrice } = await printingCost(vendorId, quantity,totalPage);
                
                let order = await tx.vendorOrder.create({
                    data : {
                        bookId,
                        vendorId,
                        authorId : userId,
                        quantity,
                        totalPrice : totalPrice,
                        deliveryAddress : address,
                        totalPage
                    }
                });
                if (order) {
                    await orderplaced(userEmail);

                    const findVendor = await tx.user.findUnique({
                        where : {userId : vendorId}
                    });

                    await newOrder(findVendor.email);
                }
                let updateBook = await tx.book.update({
                    where : {bookId},
                    data : {
                        isActive : true,
                        isPublished : true,
                        publishMode
                    }
                });
                if(updateBook){ await publishingEmail(userEmail,publishMode)};
            });
        }
    } catch (error) {

        console.log(error);
        throw error;
    }
}

export const switchUnpublish = async(bookId, userEmail) => {
    try {
        let book = await prisma.book.findUnique({
            where : {bookId}
        });
        let updatedPublish;
        if(book.publishMode === "online"){
            updatedPublish = await prisma.book.update({
                where : {bookId},
                data : {
                    isPublished : false,
                    publishMode : null,
                    keywords : [],
                    price : null
                }
            });
        }

        if(book.publishMode === "offline"){
            updatedPublish = await prisma.book.update({
                where : {bookId},
                data : {
                    isPublished : false
                }
            });
        }
        unPublishingEmail(userEmail);
        return updatedPublish;
    } catch (error) {
        throw error;
    }
}

export const getBook = async(userId,userRole,status, published, mode,order,sortBy, pageNo, pageLimit) => {
    try {
        let skip = ((pageNo - 1) * pageLimit);

        if(userRole === 2){
            return await prisma.book.findMany({
                where : 
                {
                    authorId : userId,
                    AND :[
                        {isActive : status},
                        {isPublished : published},
                        {publishMode : mode}
                    ]
                },
                select : {
                    bookId : true,
                    title : true,
                    description : true,
                    thumbnailUrl : true,
                    contentUrl : true,
                    coverImageUrl : true,
                    isActive : true,
                    isPublished : true
                },
                orderBy: sortBy ? { [sortBy]: order || "desc" } : undefined,
                skip : skip,
                take : pageLimit
            });
        }

        if(userRole === 4){
            return await prisma.book.findMany({
                where : 
                {
                    AND :[
                        {isPublished : true},
                        {publishMode : "online"}
                    ]
                },
                select : {
                    bookId : true,
                    title : true,
                    coverImageUrl : true,
                    thumbnailUrl : true,
                    price : true,
                    createdAt : true
                },
                orderBy : {
                    [sortBy] : order
                },
                skip : skip,
                take : pageLimit
            });
        }
        if(userRole === 1){
            return await prisma.book.findMany();
        }

    } catch (error) {
        throw error;
    }
}

export const bookDetail= async(bookId) => {
    try {
        return await prisma.book.findUnique({
                where :{bookId},
                select : {
                    bookId : true,
                    title : true,
                    description : true,
                    coverImageUrl : true,
                    thumbnailUrl : true,
                    price : true,
                    author : {
                        select : {
                            name : true
                        }
                    }
                }
            });

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteBookOrder = async(userId,vendorOrderId) => {
    try {
        await prisma.vendorOrder.deleteMany({
            where : {
                authorId : userId,
                vendorOrderId
            }
        })
    } catch (error) {
        throw error;
    }
}

export const bookSearch = async(search) => {
    try {
        return await prisma.book.findMany({
            where : 
            {
                OR :[
                    {title : {contains : search, mode : "insensitive"}},
                    {description : {contains : search, mode : "insensitive"}},
                    {keywords : {has : search} }
                ],
                AND :[
                    {isPublished : true},
                    {publishMode : "online"}
                ]   
            },
            select : {
                bookId : true,
                title : true,
                coverImageUrl : true,
                thumbnailUrl : true
            }
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}