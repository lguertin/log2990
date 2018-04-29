import { injectable } from "inversify";
import { Request, Response } from "express";
import { MongoClient, ObjectID, MongoError } from "mongodb";
import { TrackInformation } from "../../../../common/racing/constants";

const URL: string = "mongodb://team10:Allforone@ds261678.mlab.com:61678/log2990";
const DBNAME: string = "log2990";
const COLLECTION_NAME: string = "tracks";

@injectable()
export class DataBaseHandler {

    public async getAllTrack(): Promise<void | TrackInformation[]> {
        return MongoClient.connect(URL)
            .then(
                async (client: MongoClient) => {

                    return client.db(DBNAME).collection(COLLECTION_NAME).find().toArray()
                        .then((docs: TrackInformation[]) => {
                            client.close()
                                .then()
                                .catch((err: MongoError) => console.error(err));

                            return docs;
                        });
                })
            .catch((err: MongoError) => console.error(err));
    }

    public async insert(req: Request, res: Response): Promise<void> {
        return MongoClient.connect(URL)
            .then(
                (client: MongoClient) => {
                    client.db(DBNAME).collection(COLLECTION_NAME)
                        .insertOne({
                            name: req.body.name,
                            description: req.body.description,
                            image: req.body.image,
                            points: req.body.points,
                            bestTimes: req.body.bestTimes,
                            numberOfTimesPlayed: req.body.numberOfTimesPlayed
                        })
                        .then()
                        .catch(() => console.error("dataBaeHandler: can't insert in the database"));
                })
            .catch((err: MongoError) => console.error(err));

    }

    public async update(req: Request, id: string): Promise<void> {
        return MongoClient.connect(URL)
            .then(
                (client: MongoClient) => {
                    client.db(DBNAME).collection(COLLECTION_NAME).updateOne(
                        {
                            _id: new ObjectID(id)
                        },
                        {
                            points: req.body.points,
                            name: req.body.name,
                            description: req.body.description,
                            bestTimes: req.body.bestTimes,
                            image: req.body.image,
                            numberOfTimesPlayed: req.body.numberOfTimesPlayed
                        })
                        .then()
                        .catch((err: MongoError) => console.error(err));
                })
            .catch((err: MongoError) => console.error(err));

    }

    public async remove(id: string): Promise<void> {
        return MongoClient.connect(URL)
            .then(
                (client: MongoClient) => {
                    client.db(DBNAME).collection(COLLECTION_NAME).deleteOne({
                        _id: new ObjectID(id)
                    })
                        .then()
                        .catch((err: MongoError) => console.error(err));

                })
            .catch((err: MongoError) => console.error(err));
    }

    public async getTrack(id: string): Promise<void | TrackInformation> {
        return MongoClient.connect(URL)
            .then(
                async (client: MongoClient) => {
                    return  client.db(DBNAME).collection(COLLECTION_NAME).findOne({ _id: new ObjectID(id) })
                        .then((trackInformation: TrackInformation) => {

                            return trackInformation;
                        })
                        .catch((err: MongoError) => console.error(err));
                })
            .catch((err: MongoError) => console.error(err));
    }
}
