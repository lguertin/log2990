import { expect } from "chai";
import * as ioClient from "socket.io-client";
import { Server } from "../../../server";
import Types from "../../../types";
import "reflect-metadata";
import { container } from "../../../inversify.config";
import { SOCKET_CREATE_ROOM, SOCKET_JOIN_ROOM } from "../../../../../common/crossword/constant";
import { Room } from "../../../../../common/crossword/room";

const ROOM_OF_PLAYER_1: number = 0;
const ROOM_OF_PLAYER_2: number = 1;
const MINIMUM_WAITING_RESPONSE_TIME: number = 200;

describe ("Sockets", () => {
    const server: Server = container.get<Server>(Types.Server);
    const port: string | number | boolean = server["normalizePort"](process.env.PORT || "4394");
    /*tslint:disable-next-line*/ // Make the read only variable modifiable for tests
    server["appPort" as any] = port;
    server.init();

    it("Should create a server with a custom port for testing", () => {
        expect(server["appPort"]).to.equal(port);
    });

    const client1: SocketIOClient.Socket = ioClient("http://localhost:" + port);
    client1.connect();

    it("Should have 1 room in the room list if 1 player creates a room", (done: MochaDone) => {
        const room: Room = new Room({players: [{id: client1.id, name: "andre", score: 0}], difficulty: 0, grid: []});
        client1.emit(SOCKET_CREATE_ROOM, room);

        setTimeout(() => { expect(server["sockets"]["rooms"].length).to.equal(1); done(); }, MINIMUM_WAITING_RESPONSE_TIME);
    });

    const client2: SocketIOClient.Socket = ioClient("http://localhost:" + port);
    client2.connect();

    it("Should not override the first room if a second player creates a room", (done: MochaDone) => {
        const room: Room = new Room({players: [{id: client2.id, name: "bob", score: 0}], difficulty: 2, grid: []});
        client2.emit(SOCKET_CREATE_ROOM, room);
        const EXPECTED_AMOUNT_OF_ROOMS: number = 2;

        setTimeout(() => { expect(server["sockets"]["rooms"].length).to.equal(EXPECTED_AMOUNT_OF_ROOMS); done(); },
                   MINIMUM_WAITING_RESPONSE_TIME);
    });

    it("Should find the good room index when passing a room in parameter", () => {
        const roomIndex: number = server["sockets"]["findRoomIndex"](Room.copy(server["sockets"]["rooms"][ROOM_OF_PLAYER_1]));
        expect(roomIndex).to.equal(ROOM_OF_PLAYER_1);
    });

    it("Should find the good room index when passing a room in parameter", () => {
        const roomIndex: number = server["sockets"]["findRoomIndex"](Room.copy(server["sockets"]["rooms"][ROOM_OF_PLAYER_2]));
        expect(roomIndex).to.equal(ROOM_OF_PLAYER_2);
    });

    it("Should find room index -1 when passing a non existant room in parameter", () => {
        const roomIndex: number =
            server["sockets"]["findRoomIndex"](new Room({players: [{id: "woejwjiiw", name: "claude", score: 0}], difficulty: 1, grid: []}));
        expect(roomIndex).to.equal(-1);
    });

    const client3: SocketIOClient.Socket = ioClient("http://localhost:" + port);
    client3.connect();

    it("Should be able to join the room of the second player", (done: MochaDone) => {
        const room: Room = Room.copy(server["sockets"]["rooms"][ROOM_OF_PLAYER_2]);
        room.addPlayer({id: client3.id, name: "Jean Guy", score: 0});
        client3.emit(SOCKET_JOIN_ROOM, room);
        const EXPECTED_AMOUNT_OF_ROOMS: number = 2;

        setTimeout(() => { expect(server["sockets"]["rooms"][ROOM_OF_PLAYER_2].players.length).to.equal(EXPECTED_AMOUNT_OF_ROOMS);
                           done();
                        },
                   MINIMUM_WAITING_RESPONSE_TIME);
    });

    it("Should have only 1 player in the room 1", () => {
        expect(server["sockets"]["rooms"][ROOM_OF_PLAYER_1].players.length).to.equal(1);
    });

    it("Should remove the second room if the second player disconnect", (done: MochaDone) => {
        client2.disconnect();

        setTimeout(() => { expect(server["sockets"]["rooms"].length).to.equal(1); done(); }, MINIMUM_WAITING_RESPONSE_TIME);
    });

    const client4: SocketIOClient.Socket = ioClient("http://localhost:" + port);
    client4.connect();
    const client5: SocketIOClient.Socket = ioClient("http://localhost:" + port);
    client5.connect();

    it("Should replace the previous room spot when another player creates a room", (done: MochaDone) => {
        const room: Room = new Room({players: [{id: client4.id, name: "paulette", score: 0}], difficulty: 1, grid: []});
        client4.emit(SOCKET_CREATE_ROOM, room);
        const EXPECTED_AMOUNT_OF_ROOMS: number = 2;

        setTimeout(() => { expect(server["sockets"]["rooms"].length).to.equal(EXPECTED_AMOUNT_OF_ROOMS); done(); },
                   MINIMUM_WAITING_RESPONSE_TIME);
    });

    it("Should remove the room of the middle position (0-1-2)  if the middle player (1) disconnects", (done: MochaDone) => {
        const room: Room = new Room({players: [{id: client5.id, name: "barbara", score: 0}], difficulty: 2, grid: []});
        client5.emit(SOCKET_CREATE_ROOM, room);
        client4.disconnect();
        setTimeout(() => { expect(server["sockets"]["rooms"][0].host.name + " " + server["sockets"]["rooms"][1].host.name ).
                           to.equal("andre" + " " + "barbara");
                           done(); },
                   MINIMUM_WAITING_RESPONSE_TIME);
    });

});
