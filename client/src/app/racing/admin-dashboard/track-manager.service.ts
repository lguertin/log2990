import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { catchError } from "rxjs/operators";
import { TrackInformation } from "../../../../../common/racing/constants";
import { BASE_URL } from "../../constants";

const RACE_TRACK_URL: string = BASE_URL + "racing/track/";
const GET_ALL_URL: string = BASE_URL + "racing/track/all";
const CREATE_NEW_URL: string = BASE_URL + "racing/track/new";

@Injectable()
export class TrackManagerService {
    public tracks: TrackInformation[];

    public constructor(private http: HttpClient) {
        this.tracks = [];
    }

    public getTracks(): Observable<TrackInformation[]> {
        return this.http.get<TrackInformation[]>(GET_ALL_URL).pipe(
            catchError(this.handleError("tracks", []))
        );
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }

    public insert(trackInformation: TrackInformation): Observable<TrackInformation> {
        return this.http.post<TrackInformation>(CREATE_NEW_URL, trackInformation)
            .pipe(
                catchError(this.handleError<TrackInformation>("inserting track"))
            );

    }

    public getTrack(id: string): Observable< {} |TrackInformation> {
        return this.http.get<TrackInformation>(RACE_TRACK_URL + id).pipe(
            catchError(this.handleError("tracks", []))
        );
    }

    public saveAs(trackInformation: TrackInformation): Observable<TrackInformation> {
        return this.http.post<TrackInformation>(RACE_TRACK_URL, trackInformation)
            .pipe(
                catchError(this.handleError<TrackInformation>("insertion as new track"))
            );
    }

    private getTrackIdURL(trackInformation: TrackInformation): string {
        return RACE_TRACK_URL  + trackInformation._id;
    }

    public delete(trackInformation: TrackInformation): Observable<{}> {
        return this.http.delete(this.getTrackIdURL(trackInformation))
            .pipe(
                catchError(this.handleError("inserting track", trackInformation))
            );
    }

    public update(trackInformation: TrackInformation): Observable<TrackInformation> {
        return this.http.put<TrackInformation>(this.getTrackIdURL(trackInformation), trackInformation)
            .pipe(
                catchError(this.handleError("inserting track", trackInformation))
            );
    }

}
