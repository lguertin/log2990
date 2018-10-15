import { CrossWordGrid } from "./types/crosswordGrid";
import { GameDifficulty, GridWord, GRID_DIMENSION } from "../../../../../common/crossword/constant";
import { BlackCellFiller } from "./crossword-content-filler/blackCellFiller";
import { injectable } from "inversify";
import { WordFiller } from "./crossword-content-filler/wordFiller";
import { WordSlot, LEXICON_DEFINITION } from "./constant";
import { DataFetcher} from "../lexical-service/dataFetcher";

@injectable()
export class CrossWordCreator {

    public static async createCrossWord(difficulty: GameDifficulty): Promise<Array<GridWord>> {
        const grid: CrossWordGrid = new CrossWordGrid(GRID_DIMENSION);
        const wordFiller: WordFiller = new WordFiller(difficulty);

        BlackCellFiller.execute(grid);
        wordFiller.execute(grid);

        let gridWords: Array<GridWord> ;
        gridWords = this.createParsedData(wordFiller.insertedWordsHistory);

        for (const gridWord of gridWords) {
            const definitions: string[] = await this.assignDefinitions(gridWord);
            gridWord.definition = definitions[(difficulty === GameDifficulty.Easy) ? 0 : 1];
            this.lookIfWordInDefinition(gridWord, definitions, 0);
        }

        return gridWords;
    }

    private static lookIfWordInDefinition(gridWord: GridWord, definitions: string[], index: number): string {
        if ( gridWord.definition.search(" " + gridWord.word + " ") !== -1 )  {
            gridWord.definition = definitions[index + 1];
            if (this.hasNoDefinition(gridWord.definition)) {
                gridWord.definition = definitions[index - 1].replace(" " + gridWord.word + " ", " ... ");
            } else {
                this.lookIfWordInDefinition(gridWord, definitions, index + 1);
            }
        }

        return gridWord.definition;
    }

    private static hasNoDefinition(definition: string): boolean {
      return definition === undefined;
    }

    private static createParsedData(dataInserted: Array<WordSlot>): Array<GridWord> {
        const parsedData: Array<GridWord> = [];
        for (const data of dataInserted) {
            const newData: GridWord = {
                posI: data.posI, posJ: data.posJ, direction: data.direction,
                word: data.word.getWord(),
                definition: ""
            };
            parsedData.push(newData);
        }

        return parsedData;
    }

    private static async assignDefinitions(gridWordData: GridWord): Promise<string[]> {
            return  JSON.parse(await DataFetcher.getApiData(LEXICON_DEFINITION + gridWordData.word));
    }
}
