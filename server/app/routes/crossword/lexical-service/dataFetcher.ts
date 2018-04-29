import * as http from "http";

export class DataFetcher {
    public static async getApiData(dataUrl: string): Promise<string> {
        return new Promise((resolve: (value?: string | PromiseLike<string>) => void, reject: (reason?: string) => void) => {
            http.get(dataUrl, (result: http.IncomingMessage) => {

                result.setEncoding("utf8");
                let rawData: string = "";

                result.on("data", (data: string) => {
                    rawData += data;
                });

                result.on("end", () => {
                    resolve(rawData);
                });
            });
        });
    }

}
