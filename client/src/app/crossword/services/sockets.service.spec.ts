import { TestBed, async, fakeAsync } from "@angular/core/testing";
import { SocketsService } from "./sockets.service";
import { Room } from "../../../../../common/crossword/room";
import { GridWord } from "../../../../../common/crossword/constant";

describe("SocketsService", () => {
    let serviceClient1: SocketsService;
    let serviceClient2: SocketsService;
    let spy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SocketsService]
        });
        serviceClient1 = new SocketsService();
        serviceClient2 = new SocketsService();
        serviceClient1.connectToServer();
        serviceClient2.connectToServer();
    });

    it("should be created", async(() => {
        expect(serviceClient1).toBeTruthy();
        expect(serviceClient2).toBeTruthy();
    }));

    it("should call the start playing function when 2 players join the same room", async((done: DoneFn) => {
        const room: Room = new Room();
        serviceClient1.startPlaying().subscribe(() => {
            done();
        });
        room.addPlayer({id: serviceClient1["socket"].id, name: "Jean Guy", score: 0});
        serviceClient1.createRoom(room);
        room.addPlayer({id: serviceClient2["socket"].id, name: "Jean Paul", score: 0});
        serviceClient2.connectToRoom(room);
    }));

    it("should not call the start playing function when 2 players join different room", fakeAsync(() => {
        const room1: Room = new Room();
        const room2: Room = new Room();
        spy = spyOn(serviceClient1, "startPlaying").and.returnValue({subscribe: () => {}});
        room1.addPlayer({id: serviceClient1["socket"].id, name: "Jean Guy", score: 0});
        serviceClient1.createRoom(room1);
        room2.addPlayer({id: serviceClient2["socket"].id, name: "Jean Paul", score: 0});
        serviceClient2.createRoom(room2);
        expect(serviceClient1.startPlaying).toHaveBeenCalledTimes(0);
    }));

    it("should receive a list of rooms after emmiting it's call to the server", async((done: DoneFn) => {
        const room1: Room = new Room();
        const room2: Room = new Room();
        room1.addPlayer({id: serviceClient1["socket"].id, name: "Jean Guy", score: 0});
        serviceClient1.createRoom(room1);
        room2.addPlayer({id: serviceClient2["socket"].id, name: "Jean Paul", score: 0});
        serviceClient2.createRoom(room2);
        serviceClient1.allRooms.subscribe((rooms: Room[]) => {
            expect(rooms.length).toEqual(2);
            done();
        });
    }));

    it("should receive a grid word when 2 players are in a room and select a grid word", async((done: DoneFn) => {
        const room: Room = new Room();
        serviceClient1.receiveSelectedWord().subscribe((gridWord: GridWord) => {
            expect(gridWord).toBeTruthy();
            done();
        });
        room.addPlayer({id: serviceClient1["socket"].id, name: "Jean Guy", score: 0});
        serviceClient1.createRoom(room);
        room.addPlayer({id: serviceClient2["socket"].id, name: "Jean Paul", score: 0});
        serviceClient2.connectToRoom(room);
        serviceClient2.sendSelectedWord({posI: 0, posJ: 3, direction: 1, word: "Bla", definition: "Hello world"});
    }));

    it("should not receive a grid word when 2 players are in different room and select a grid word", fakeAsync(() => {
        const room1: Room = new Room();
        const room2: Room = new Room();
        spy = spyOn(serviceClient1, "receiveSelectedWord").and.returnValue({subscribe: () => {}});
        room1.addPlayer({id: serviceClient1["socket"].id, name: "Jean Guy", score: 0});
        serviceClient1.createRoom(room1);
        room2.addPlayer({id: serviceClient2["socket"].id, name: "Jean Paul", score: 0});
        serviceClient2.createRoom(room2);
        serviceClient1.sendSelectedWord({posI: 0, posJ: 3, direction: 1, word: "Bla", definition: "Hello world"});
        serviceClient2.sendSelectedWord({posI: 1, posJ: 3, direction: 1, word: "Bli", definition: "Bye world"});
        expect(serviceClient1.receiveSelectedWord).toHaveBeenCalledTimes(0);
    }));

    it("should receive a grid word when 2 players are in a room and validate a grid word", async((done: DoneFn) => {
        const room: Room = new Room();
        serviceClient1.receiveValidateWord().subscribe((gridWord: GridWord) => {
            expect(gridWord).toBeTruthy();
            done();
        });
        room.addPlayer({id: serviceClient1["socket"].id, name: "Jean Guy", score: 0});
        serviceClient1.createRoom(room);
        room.addPlayer({id: serviceClient2["socket"].id, name: "Jean Paul", score: 0});
        serviceClient2.connectToRoom(room);
        serviceClient2.sendValidatedWord({posI: 0, posJ: 3, direction: 1, word: "Bla", definition: "Hello world"});
    }));

    it("should not receive a grid word when 2 players are in different room and validate a grid word", () => {
        const room1: Room = new Room();
        const room2: Room = new Room();
        spy = spyOn(serviceClient1, "receiveValidateWord").and.returnValue({subscribe: () => {}});
        room1.addPlayer({id: serviceClient1["socket"].id, name: "Jean Guy", score: 0});
        serviceClient1.createRoom(room1);
        room2.addPlayer({id: serviceClient2["socket"].id, name: "Jean Paul", score: 0});
        serviceClient2.createRoom(room2);
        serviceClient1.sendValidatedWord({posI: 0, posJ: 3, direction: 1, word: "Bla", definition: "Hello world"});
        serviceClient2.sendValidatedWord({posI: 1, posJ: 3, direction: 1, word: "Bli", definition: "Bye world"});
        expect(serviceClient1.receiveValidateWord).toHaveBeenCalledTimes(0);
    });

    it("should receive an updated list when a player creates a room", async((done: DoneFn) => {
        const room1: Room = new Room();
        serviceClient2.updateRoomList().subscribe((rooms: Room[]) => {
            expect(rooms.length).toEqual(1);
            done();
        });
        room1.addPlayer({id: serviceClient1["socket"].id, name: "Jean Guy", score: 0});
        serviceClient1.createRoom(room1);
    }));
});
