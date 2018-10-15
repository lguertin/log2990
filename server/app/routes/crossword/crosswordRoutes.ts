import { injectable, inject } from "inversify";
import { Router } from "express";
import { LexicalService } from "./lexical-service/lexicalService";
import Types from "../../types";
import { GridRouter } from "./crossword-generator/gridRouter";

@injectable()
export class CrosswordRoutes {

    public readonly mainRoute: string = "/crossword";

    public constructor( @inject(Types.LexicalService) private lexicalService: LexicalService,
                        @inject(Types.GridRouter) private gridRouter: GridRouter) {}

    public get routes(): Router {
        const router: Router = Router();

        router.use(this.lexicalService.mainRoute, this.lexicalService.routes);
        router.use(this.gridRouter.mainRoute, this.gridRouter.routes);

        return router;
    }
}
