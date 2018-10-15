import { CrossWordCreator } from "./crossWordCreator";
import { injectable } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import {GridWord, GameDifficulty} from "../../../../../common/crossword/constant";

@injectable()
export class GridRouter {
    public readonly mainRoute: string = "/generation/grid/";

    public get routes(): Router {
        const router: Router = Router();

        router.get("/Easy", (req: Request, res: Response, next: NextFunction) => {
            CrossWordCreator.createCrossWord(GameDifficulty.Easy)
                .then((grid: Array<GridWord>) => {
                    res.send(grid);
                })
                .catch(() => {
                    console.error("GridRouter: Could not route the difficulty to create the easy grid.");
                });
        });

        router.get("/Medium", (req: Request, res: Response, next: NextFunction) => {
            CrossWordCreator.createCrossWord(GameDifficulty.Medium)
                .then((grid: Array<GridWord>) => {
                    res.send(grid);
                })
                .catch(() => {
                    console.error("GridRouter: Could not route the difficulty to create the medium grid.");
                });
        });

        router.get("/Hard", (req: Request, res: Response, next: NextFunction) => {
            CrossWordCreator.createCrossWord(GameDifficulty.Hard)
                .then((grid: Array<GridWord>) => {
                    res.send(grid);
                })
                .catch(() => {
                    console.error("GridRouter: Could not route the difficulty to create the hard grid.");
                });
        });

        return router;
    }
}
