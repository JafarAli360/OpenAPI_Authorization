import db from "../models/index.js"
import jwt from "jsonwebtoken";
 
const Books = db.Books
export const getBooks = async(req, res) => {
        const books = await Books.findAll({
            attributes:['id','title','price','author','description']
        });
        res.json(books);
}

export const getBookById = async(req, res) => {
    const { id } = req.params;
    const books = await Books.findOne({
        where: { id: id },
    });
    res.json(books);
}

export const createBooks = async(req, res) => {
    const { title, price, author, description } = req.body;
    try {
        await Books.create({
            title: title,
            price: price,
            author : author,
            description : description
        });
        return res.status(200).json({
            success: true,
            message: "Buku Berhasil ditambahkan",
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateBooks = async(req, res) => {
    const { id } = req.params;
    const { title, price, author, description} = req.body;
        try {
            await Books.update(
                { title: title, price: price, author : author, description : description },
                {
                where: { id: id},
                }
            );
            return res.status(200).json({
                success: true,
                message: "Buku Berhasil diupdate",
            });
        } catch (error) {
            console.log(error);
        }
}

export const deleteBooks = async(req, res) => {
    const { id } = req.params;
    const dataBeforeDelete = await Books.findOne({
    where: { id: id },
    });
// if(tokenUser.role !="superadmin"){res.json()}
    const parsedDataProfile = JSON.parse(JSON.stringify(dataBeforeDelete));

    if (!parsedDataProfile) {
        return res.status(400).json({
            success: false,
            message: "Books doesn't exist or has been deleted!",
        });
    }

    await Books.destroy({
        where: { id },
    });

    return res.status(200).json({
        success: true,
        message: "Delete Data Successfully",
    });
}
    