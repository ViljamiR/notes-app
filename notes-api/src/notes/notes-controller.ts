import * as express from 'express';
import { getRepository } from 'typeorm';

// import Note from './Note-interface';
import Note from './note-entity'
import CreateNoteDto from './note-dto';
import NoteNotFoundException from '../expections/NoteNotFoundException'

class NotesController {
    public path = '/Notes';
    public router = express.Router();
    private noteRepository = getRepository(Note);


    private Notes: any[] = [
        {
            author: 'Marcin',
            content: 'Dolor sit amet',
            title: 'Lorem Ipsum',
        }
    ];

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getAllNotes);
        this.router.post(this.path, this.createNote);
        this.router.delete(`${this.path}/:id`, this.deleteNote)
        this.router.get("/", (req, res) => {
            res.send({ response: "I am alive" }).status(200);
        });
    }

    private getAllNotes = async (request: express.Request, response: express.Response) => {
        const Notes = await this.noteRepository.find();
        response.send(Notes);
    }

    private getNoteById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const Note = await this.noteRepository.findOne(id);
        if (Note) {
            response.send(Note);
        } else {
            next(new NoteNotFoundException(id));
        }
    }

    private modifyNote = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const noteData: Note = request.body;
        await this.noteRepository.update(id, noteData);
        const updatedNote = await this.noteRepository.findOne(id);
        if (updatedNote) {
            response.send(updatedNote);
        } else {
            next(new NoteNotFoundException(id));
        }
    }

    private createNote = async (request: express.Request, response: express.Response) => {
        const noteData: CreateNoteDto = request.body;
        const newNote = this.noteRepository.create(noteData);
        await this.noteRepository.save(newNote);
        response.send(newNote);
    }

    private deleteNote = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.noteRepository.delete(id);
        console.log(deleteResponse);
        // If number of affected is over zero we have found item with the query id
        if (deleteResponse.affected > 0) {
            response.sendStatus(200);
        } else {
            next(new NoteNotFoundException(id));
        }
    }


}

export default NotesController;