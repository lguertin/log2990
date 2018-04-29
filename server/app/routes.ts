import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./routes/index";

import { CrosswordRoutes } from "./routes/crossword/crosswordRoutes";
import {TrackRouter} from "./routes/racing//tracksRoutes";
@injectable()
export class Routes {

    public constructor( @inject(Types.Index) private index: Index,
                        @inject(Types.CrosswordRoutes) private crosswordRoutes: CrosswordRoutes,
                        @inject(Types.TrackRouter) private trackRouter: TrackRouter) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));

        router.use(this.crosswordRoutes.mainRoute, this.crosswordRoutes.routes);
        router.use(this.trackRouter.mainRoute, this.trackRouter.routes);

        return router;
    }
}
