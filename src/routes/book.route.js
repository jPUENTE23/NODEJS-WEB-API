const express = require('express')
const router = express.Router();
const Book = require('../models/book.model')


//Midleware

const getBook = async(req, res, next) => {
    let book
    const {id} = req.params;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({
            message: "El id ingresado no es valido"
        })
    }


    try{
        book = await Book.findById(id);
        if(!book){
            res.status(404).json({message: "El libro no fue encontrado"})
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }

    res.book = book;
    next()
}


// TRAEMOS TODOS LOS LIBROS

router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('GET ALL', books)
        if (books.length === 0) {
            return res.status(204).json([])
        }
        res.json(books)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})



// AGREGAMOS UN NUEVO LIBRO

router.post("/", async (req, res)=> {

    const { title, author, genero, fecha_publicacion} = req.body;

    if (!title || !author || !genero || !fecha_publicacion){
        res.status(400).json({message: "La peticion no es valida"})
    }

    const book = new Book({

        title,
        author,
        genero,
        fecha_publicacion

    })

    try{

        const newBook = await book.save();
        res.status(201).json(newBook)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})


router.get('/:id', getBook, (req, res)  => {
    res.json(res.book)
})



router.put('/:id', getBook, async (req, res) => {

    try{
        const book = res.book;

        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genero = req.body.genero || book.genero;
        book.fecha_publicacion = req.body.fecha_publicacion || book.fecha_publicacion;


        const actualizar = await book.save();

        res.json(actualizar);
    }
    catch (error){
        res.status(400).json({
            message: error.message
        })
    }
})


router.patch('/:id', getBook, async (req, res) => {

    if(!req.body.title && !req.body.author && !req.body.genero && !req.body.fecha_publicacion){
        res.status(400).json({
            message: "Tiene que haber un al menos un registro a modificar"
        })
    }


    try{
        const book = res.book;

        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genero = req.body.genero || book.genero;
        book.fecha_publicacion = req.body.fecha_publicacion || book.fecha_publicacion;


        const actualizar = await book.save();

        res.json(actualizar);
    }

    catch (error){
        res.status(500).json({
            message: error.message
        })
    }

})


router.delete('/:id', getBook, async(req,res) => {

    try{

        const book = res.book;
        await book.deleteOne({

            _id: book._id
        })
        res.json({
            message: "El registro se elimino correctamente"
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router;