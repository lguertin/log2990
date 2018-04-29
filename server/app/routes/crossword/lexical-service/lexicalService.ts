import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import { WordFetcher } from "./wordFetcher";
import Types from "../../../types";

@injectable()
export class LexicalService {

    public readonly mainRoute: string = "/lexicon";

    public constructor( @inject(Types.WordFetcher) private wordFetcher: WordFetcher) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/words/common/:wordConstraint/", (req: Request, res: Response, next: NextFunction) => {
            this.wordFetcher.getWords(req.params.wordConstraint, true).then((words: string[]) => {
                res.send(words);
            }).catch((reason: string) => {
                console.error("Word Fetcher Promise error : ", reason);

                return reason;
                });
        });

        router.get("/words/uncommon/:wordConstraint/", (req: Request, res: Response, next: NextFunction) => {
            this.wordFetcher.getWords(req.params.wordConstraint, false).then((words: string[]) => {
                res.send(words);
            }).catch((reason: string) => {
                console.error("Word Fetcher Promise error : ", reason);

                return reason;
                });
        });

        router.get("/definition/:word/", (req: Request, res: Response, next: NextFunction) => {
            this.wordFetcher.getWordDefinitions(req.params.word).then((definitions: string[]) => {
                res.send(definitions);
            }).catch((reason: string) => {
                console.error("Word Fetcher Promise error : ", reason);

                return reason;
                });
        });

        return router;
    }
}
