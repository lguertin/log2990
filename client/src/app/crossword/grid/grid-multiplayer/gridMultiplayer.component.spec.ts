/*tslint:disable:no-magic-numbers*/
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MultiplayerGridComponent } from "./gridMultiplayer.component";
import { FormsModule } from "@angular/forms";
import { GridService } from "../../services/grid.service";
import { WordSelectionService } from "../../services/word-selection.service";
import { MOCK_WORDS } from "../../mock-word";
import { GRID_DIVISION } from "../gridConstants";
import { DiscoveryState, GridWord } from "../../../../../../common/crossword/constant";
import { SocketsService } from "../../services/sockets.service";

describe("MultiplayerGridComponent", () => {
    let component: MultiplayerGridComponent;
    let fixture: ComponentFixture<MultiplayerGridComponent>;
    let socketsService: SocketsService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [MultiplayerGridComponent],
            providers: [GridService,
                        WordSelectionService,
                        SocketsService]
        })
            .compileComponents()
            .catch(() => {
                throw new Error("Grid Component could not be created");
            });
        socketsService = TestBed.get(SocketsService);
    }));

    beforeEach(() => {
        socketsService.connectToServer();
        fixture = TestBed.createComponent(MultiplayerGridComponent);
        component = fixture.componentInstance;
        component.grid.gridWords = MOCK_WORDS;
        component.grid.initializeGrid();
        component.grid.applyWordsOnGrid();
        component.initGridPositions();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("Grid cells", () => {

        it("should be created", () => {
            const cells: NodeListOf<Element> = fixture.nativeElement.querySelectorAll(".cell");
            expect(cells.item(0)).toBeTruthy();
            expect(cells.item(1)).toBeTruthy();
        });

        it("should have the right amount of cells (10x10)", () => {
            const cells: NodeListOf<Element> = fixture.nativeElement.querySelectorAll(".cell");
            expect(cells.length).toEqual(GRID_DIVISION * GRID_DIVISION);
        });

    });

    describe("Testing if user inputs are alphabetical uppercase letters", () => {
        it("should be in uppercase", () => {
            component.selectedWord = component.grid.gridWords[0];
            component.onSelect(component.grid.getCell(0, 0));
            component.handleKeyPress("a");
            component.selectedWord = component.grid.gridWords[1];
            component.onSelect(component.grid.getCell(0, 1));
            component.handleKeyPress("z");
            expect(component.grid.getCell(0, 0).input).toBe("A");
            expect(component.grid.getCell(0, 1).input).toBe("Z");
        });

        it("should only contains alphabetic letter", () => {
            component.selectedWord = component.grid.gridWords[0];
            component.onSelect(component.grid.getCell(0, 0));
            component.handleKeyPress("2");
            component.selectedWord = component.grid.gridWords[1];
            component.onSelect(component.grid.getCell(0, 1));
            component.handleKeyPress("~");
            expect(component.grid.getCell(0, 0).input).toBe("");
            expect(component.grid.getCell(0, 1).input).toBe("");
        });
    });

    describe("Testing if we can detect filled word ", () => {
        it("should return true if the right word is entered", () => {
            component.selectedWord = component.grid.gridWords[5];
            component.onSelect(component.grid.getCell(4, 0));
            component.handleKeyPress("l");
            component.handleKeyPress("e");
            expect(component.grid.getCell(4, 0).discoveryState).toBe(DiscoveryState.DiscoveredSelf);
            expect(component.grid.getCell(4, 1).discoveryState).toBe(DiscoveryState.DiscoveredSelf);
        });

        it("should return false if the wrong word is entered", () => {
            component.selectedWord = component.grid.gridWords[6];
            component.onSelect(component.grid.getCell(5, 0));
            component.handleKeyPress("s");
            component.handleKeyPress("p");
            component.handleKeyPress("i");
            component.handleKeyPress("r");
            expect(component.grid.getCell(5, 0).discoveryState).toBe(DiscoveryState.NonDiscovered);
            expect(component.grid.getCell(5, 1).discoveryState).toBe(DiscoveryState.NonDiscovered);
            expect(component.grid.getCell(5, 2).discoveryState).toBe(DiscoveryState.NonDiscovered);
            expect(component.grid.getCell(5, 3).discoveryState).toBe(DiscoveryState.NonDiscovered);
        });
    });

    describe("Testing if word completed by opponent are seen by me", () => {
        it("should input the validated word cell with the good letter", () => {
            const validatedWord: GridWord = component.grid.gridWords[7];
            component.fillValidatedCells(validatedWord);
            expect(component.grid.getCell(5, 2).input).toBe("D");
            expect(component.grid.getCell(5, 3).input).toBe("E");
        });
    });
});
