import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Index } from "./routes/index";
import { Routes } from "./routes";

import { CrosswordRoutes } from "./routes/crossword/crosswordRoutes";
import { LexicalService } from "./routes/crossword/lexical-service/lexicalService";
import { WordFetcher } from "./routes/crossword/lexical-service/wordFetcher";
import { GridRouter } from "./routes/crossword/crossword-generator/gridRouter";
import { CrossWordCreator } from "./routes/crossword/crossword-generator/crossWordCreator";
import {DataBaseHandler} from "./routes/racing/dataBaseHandler";
import {TrackRouter} from "./routes/racing/tracksRoutes";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);

container.bind(Types.Index).to(Index);

container.bind(Types.CrosswordRoutes).to(CrosswordRoutes);
container.bind(Types.LexicalService).to(LexicalService);
container.bind(Types.WordFetcher).to(WordFetcher);

container.bind(Types.GridRouter).to(GridRouter);
container.bind(Types.GridFiller).to(CrossWordCreator);

container.bind(Types.DataBaseHandler).to(DataBaseHandler);
container.bind(Types.TrackRouter).to(TrackRouter);
export { container };
