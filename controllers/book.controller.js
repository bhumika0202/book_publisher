import { createBook, updateBook, removeBook, changeStatus, bookPublish, printingCost, getBook,bookDetail, deleteBookOrder, switchUnpublish, bookSearch} from "../services/book.service.js";

let addBook = async(req, res, next) => {
    try {
        let userId = req.user.userId;
        const {title,description,categoryId} = req.body;
        
        let categoryid = Number(categoryId);
        
        let content = req.files?.content?.[0]?.path;
        let thumbnail = req.files?.thumbnail?.[0]?.path;;
        let cover = req.files?.cover?.[0]?.path;;

        await createBook(title, description,content,thumbnail,cover,categoryid, userId);

        res.status(201).json({message : "book added successfully"})
    } catch (error) {
        next(error);
    }
}

let editBook = async(req, res, next) => {
    try {
        let bookId = Number(req.params.bookId);
        const {title,description,categoryId} = req.body;

        let finalTitle = title && title.trim() !== "" ? title : undefined;
        let finalDesc = description && description.trim() !== "" ? description : undefined;        
        let categoryid = categoryId ? Number(categoryId) : undefined;
        
        let content = req.files?.content?.[0]?.path;
        let thumbnail = req.files?.thumbnail?.[0]?.path;
        let cover = req.files?.cover?.[0]?.path;

        let result = await updateBook(bookId, finalTitle, finalDesc,content,thumbnail,cover,categoryid);

        res.status(200).json({message : "book updated successfully", data : result})
    } catch (error) {
        next(error);
    }
}

let deleteBook = async(req,res, next) => {
    try {
        
        let bookId = Number(req.params.bookId);
        await removeBook(bookId);

        res.status(200).json({message : "book deleted successfully"})

    } catch (error) {
        next(error);
    }
}

let changeBookStatus = async(req,res, next) =>{

    try {
        let userEmail = req.user.email;
        let bookId = Number(req.params.bookId);

        let result = await changeStatus(bookId, userEmail);
        res.status(200).json({message : "book status changed  successfully", data : result});

    } catch (error) {
        next(error);
    }
}

let printingQuatation = async (req,res, next) => {
    try {
        let { vendorId, quantity,totalPage } = req.body;
        let {singleBookPrice, totalPrice } = await printingCost(vendorId, quantity,totalPage);
        res.status(200).json({message : "printing quataion calculated successfully",singleBookPrice,quantity, totalPrice})
    } catch (error) {
        next(error);
    }
}

let publishBook = async(req, res, next) => {
    try {
        
        let userId = req.user.userId;
        let bookId = Number(req.params.bookId);

        let userEmail = req.user.email;
        let publishMode  = req.publishType;

        let { price, keywords, vendorId, quantity, totalPage, address } = req.body;

        let result = await bookPublish(bookId, publishMode, price, keywords,vendorId, quantity,totalPage, address, userId , userEmail);

        res.status(200).json({message : "book published successfully", data : result})
    } catch (error) {
        next(error);
    }
}

let unPublishBook = async(req,res, next)=> {
    try {
        let userEmail = req.user.email;
        let  bookId = Number(req.params.bookId);
        await switchUnpublish(bookId, userEmail);
        res.status(200).json({ message : "book unpublished successfully"})
    } catch (error) {
        next(error);
    }
}

let getBookWithFilter = async(req,res, next) => {
    try {
        let userId = req.user.userId;
        let userRole = req.user.role;
        let status = req.query.status !== undefined ? req.query.status === "true" : undefined;
        let published = req.query.published !== undefined ? req.query.published === "true" : undefined; 
        let mode = req.query.mode ||  undefined;
        let order = req.query.order || "asc";
        let sortBy = req.query.sortBy || "title";

        let page = Number(req.query.pageNo) || 1;
        let limit = Number(req.query.pageLimit) || 10;

        let books = await getBook(userId,userRole,status, published, mode,order,sortBy, page, limit);
        res.status(200).json({ message : "books fatched successfully", data : books})

    } catch (error) {
        next(error);
    }
}

let getBookDetails =  async (req, res, next) => {
    try {
        
        let bookId = Number(req.params.id);
        let result = await bookDetail(bookId);

        res.status(200).json({message : "book details fetched successfully", data : result});
    } catch (error) {
        next(error);
    }
}

let deleteOrder = async(req,res, next) => {
    try {
        let userId = req.user.userId;
        let vendorOrderId = Number(req.params.id);
        await deleteBookOrder(userId, vendorOrderId);
        res.status(200).json({message : "book printing order deleted successfully"});

    } catch (error) {
        next(error);
    }
}

let searchBook = async(req,res, next) => {
    try {    
        let search = req.query.search;
        let book = await bookSearch(search);
        res.status(200).json({message : "book searched successfully", data : book})

    } catch (error) {
        next(error);
    }
}

export default {
    addBook,
    editBook,
    deleteBook,
    changeBookStatus,
    publishBook,
    printingQuatation,
    getBookWithFilter,
    getBookDetails,
    deleteOrder,
    unPublishBook,
    searchBook
}