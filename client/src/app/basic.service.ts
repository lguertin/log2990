import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

import { Message } from "../../../common/communication/message";
import { BASE_URL } from "./constants";

@Injectable()
export class BasicService {

    public constructor(private http: HttpClient) { }

    public basicGet(): Observable<Message> {

        return this.http.get<Message>(BASE_URL).pipe(
            catchError(this.handleError<Message>("basicGet"))
        );
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
