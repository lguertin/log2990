import { injectable, inject } from "inversify";
import { Router, Request, Response } from "express";
import { DataBaseHandler } from "./dataBaseHandler";
import { TrackInformation } from "../../../../common/racing/constants";
import Types from "../../types";

@injectable()
export class TrackRouter {

    public readonly mainRoute: string = "/racing";

    public constructor(@inject(Types.DataBaseHandler) private dataBase: DataBaseHandler) { }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/track/all", (req: Request, res: Response) => {
            this.dataBase.getAllTrack()
                .then((tracks: TrackInformation[]) => {
                    res.send(tracks);
                })
                .catch(() => {
                    console.error("TrackRoutes: Can't get all tracks in the databse");
                });
        });

        router.get("/track/:_id", (req: Request, res: Response) => {
            this.dataBase.getTrack(req.params._id)
                .then((trackInformation: TrackInformation) => {
                    res.send(trackInformation);
                })
                .catch(() => {
                    console.error("TrackRoutes: Can't get element in the databse");
                });
        });

        router.post("/track/new", (req: Request, res: Response) => {
            this.dataBase.insert(req, res)
                .then()
                .catch(() => {
                    console.error("TrackRoutes: Can't insert in the databse");
                });
        });

        router.delete("/track/:_id", (req: Request, res: Response) => {
            this.dataBase.remove(req.params._id)
                .then()
                .catch(() => {
                    console.error("TrackRoutes: Can't delete in the databse");
                });
        });

        router.put("/track/:_id", (req: Request, res: Response) => {
            this.dataBase.update(req, req.params._id)
                .then()
                .catch(() => {
                    console.error("TrackRoutes: Can't update in the databse");
                });
        });

        return router;
    }
}
