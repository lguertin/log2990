import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { catchError} from "rxjs/operators";
import { GridWord, GameDifficulty } from "../../../../../common/crossword/constant";
import { BASE_URL } from "../../constants";

@Injectable()
export class GridService {
    private crosswordBaseURL: string = BASE_URL + "crossword/generation/grid/";

    public constructor(private http: HttpClient) { }

    public getGrid(difficulty: GameDifficulty): Observable<GridWord[]> {
        return this.http.get<GridWord[]>(this.crosswordBaseURL + difficulty).pipe(
            catchError(this.handleError("getGrid", []))
        );
    }
    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
