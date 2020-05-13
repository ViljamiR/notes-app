import HttpException from './HttpException';

class NoteNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Post with id ${id} not found`);
    }
}

export default NoteNotFoundException;