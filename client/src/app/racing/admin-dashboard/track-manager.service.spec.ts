import { TestBed, inject } from "@angular/core/testing";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { TrackManagerService } from "./track-manager.service";

describe("TrackManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackManagerService,
                  HttpClient,
                  HttpHandler]
    });
  });

  it("should be created", inject([TrackManagerService], (service: TrackManagerService) => {
    expect(service).toBeTruthy();
  }));
});
