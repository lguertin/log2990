import { TestBed, inject } from "@angular/core/testing";

import { EditorRendererService } from "./editor-renderer.service";

describe("EditorRendererService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditorRendererService]
    });
  });

  it("should be created", inject([EditorRendererService], (service: EditorRendererService) => {
    expect(service).toBeTruthy();
  }));
});
