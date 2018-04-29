import { TestBed, inject } from "@angular/core/testing";
import { GridService } from "./grid.service";
import { HttpClient, HttpHandler } from "@angular/common/http";

describe("GridService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GridService,
                        HttpClient,
                        HttpHandler]
        });
    });

    it("should be created", inject([GridService], (service: GridService) => {
        expect(service).toBeTruthy();
    }));
});
