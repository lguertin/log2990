import { TestBed, inject } from "@angular/core/testing";
import { HintsComponent } from "../../crossword/hints/hints.component";
import { WordSelectionService } from "./word-selection.service";
import { HttpClient, HttpHandler } from "@angular/common/http";

describe("WordSelectionService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HintsComponent],
            providers: [WordSelectionService,
                        HttpClient,
                        HttpHandler]
        });
    });

    it("should be created", inject([WordSelectionService], (service: WordSelectionService) => {
        expect(service).toBeTruthy();
    }));
});
