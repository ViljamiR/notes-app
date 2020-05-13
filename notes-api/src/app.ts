import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as  cors from 'cors'

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers) {
        this.app = express();

        this.app.use(cors())
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/api', controller.router);
        });
    }

    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }
}

export default App