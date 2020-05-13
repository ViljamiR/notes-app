import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import App from './app';
import config from './ormconfig';
import NotesController from './notes/notes-controller';
import validateEnv from './utils/validateEnv';
import * as http from 'http'
import * as socketIo from 'socket.io'
import * as express from 'express';

import { getRepository } from 'typeorm';
// import Note from './Note-interface';
import Note from '../src/notes/note-entity'
import CreateNoteDto from '../src/notes/note-dto';



validateEnv();

(async () => {
    try {
        await createConnection(config);
    } catch (error) {
        console.log('Error while connecting to the database', error);
        return error;
    }
    const app: express.Application = new App(
        [
            new NotesController(),
        ],
    );


    const server = http.createServer(app)
    const io = socketIo(server)

    let interval;

    io.on("connection", (socket) => {
        console.log("New client connected");
        if (interval) {
            clearInterval(interval);
        }
        socket.on("initial_data", () => {
            console.log('Retrieving initial data');
            const NoteRepository = getRepository(Note);
            NoteRepository.find({
                order: {
                    order: "ASC"
                }
            }).then(notes => {
                io.emit('updateNotes', notes)

            });
        });

        socket.on("add_note", data => {
            console.log('Adding note');

            const NoteData: CreateNoteDto = data;
            const NoteRepository = getRepository(Note);
            const newNote = NoteRepository.create(NoteData);
            NoteRepository.save(newNote).then(res =>
                NoteRepository.find({
                    order: {
                        order: "ASC"
                    }
                }).then(notes => {
                    io.emit('updateNotes', notes)

                })
            );
        })

        socket.on('update_note', (id, data) => {
            const NoteData: Note = data;
            const NoteRepository = getRepository(Note);
            NoteRepository.update(id, NoteData).then(res =>
                NoteRepository.findOne(id).
                    then(res => {
                        NoteRepository.find({
                            order: {
                                order: "ASC"
                            }
                        }).then(notes => {
                            io.emit('updateNotes', notes)

                        });
                    }))
        })

        socket.on('update_notes', (data) => {
            const NoteData: Note[] = data;
            const NoteRepository = getRepository(Note);
            NoteRepository.save(NoteData).
                then(res => {
                    NoteRepository.find({
                        order: {
                            order: "ASC"
                        }
                    }).then(notes => {

                        io.emit('updateNotes', notes)

                    });
                })
        })



        socket.on("delete_note", noteId => {
            console.log('delete');

            const id = noteId;

            const NoteRepository = getRepository(Note);
            NoteRepository.delete(id).then(deleteResponse => {
                // If number of affected is over zero we have found item with the query id
                if (deleteResponse.affected > 0) {
                    NoteRepository.find({
                        order: {
                            order: "ASC"
                        }
                    }).then(notes => {

                        io.emit('updateNotes', notes)

                    });
                } else {
                    console.log('Not found');

                    // next(new NoteNotFoundException(id));
                }
            }
            )
        })

        socket.on("disconnect", () => {
            console.log("Client disconnected");
            clearInterval(interval);
        });
    });

    const sendNewNotes = repo => {
        repo.find({
            order: {
                order: "ASC"
            }
        }).then(notes => {
            io.emit('updateNotes', notes)
        });
    }


    // app.listen();
    const port = process.env.PORT

    server.listen(port, () => console.log(`Listening on port ${port}`));

})();