import { Injectable } from "@angular/core";
import { AudioListener, AudioLoader } from "three";
import { SoundEvent } from "./sound";
import { SoundRaceStart } from "./soundRaceStart";
import { SoundEngine } from "./soundEngine";
import { SoundEvents } from "./constants";
import { SoundCollisionCar, SoundCollisionWall } from "./soundCollision";

@Injectable()
export class SoundService {
    private events: SoundEvent[];
    private audioListener: AudioListener;
    private audioLoader: AudioLoader;

    public constructor() {
        this.audioListener = new AudioListener();
        this.audioLoader = new AudioLoader();

        this.events = [
            {eventKey: SoundEvents.RACE_START,
             eventCommand: new SoundRaceStart(this.audioLoader, this.audioListener)},
            {eventKey: SoundEvents.ENGINE,
             eventCommand: new SoundEngine(this.audioLoader, this.audioListener)},
            {eventKey: SoundEvents.CAR_COLLISION_CAR,
             eventCommand: new SoundCollisionCar(this.audioLoader, this.audioListener.clone())},
            {eventKey: SoundEvents.CAR_COLLISION_WALL,
             eventCommand: new SoundCollisionWall(this.audioLoader, this.audioListener)}
        ];
    }

    public play(event: SoundEvents, volume?: number): void {
        const selectedEvent: SoundEvent = this.events.find((value) => value.eventKey === event);
        if (selectedEvent) {
            if (selectedEvent.eventCommand.isPlaying()) {
                selectedEvent.eventCommand.stop();
            }

            if (volume) {
                this.adjustVolume(selectedEvent.eventKey, volume);
            }

            selectedEvent.eventCommand.play()
                .then()
                .catch(() => {
                    console.error("Sound Error: Could not load " + SoundEvents[selectedEvent.eventKey] + " sound.");
            });
        } else {
            console.error("Sound Error: Could not load " + SoundEvents[selectedEvent.eventKey] + " sound.");
        }
    }

    public adjustPitchSpeed(event: SoundEvents, speed: number): void {
        const selectedEvent: SoundEvent = this.events.find((value) => value.eventKey === event);
        if (selectedEvent) {
            selectedEvent.eventCommand.setPitchSpeed(speed);
        } else {
            console.error("Sound Error: Sound " + SoundEvents[selectedEvent.eventKey] + " was not found.");
        }
    }

    public stopAllSound(): void {
        for (const event of this.events) {
            event.eventCommand.stop();
        }
    }

    public adjustVolume(event: SoundEvents, volume: number): void {
        const selectedEvent: SoundEvent = this.events.find((value) => value.eventKey === event);
        if (selectedEvent) {
            selectedEvent.eventCommand.setVolume(volume);
        } else {
            console.error("Sound Error: Sound " + SoundEvents[selectedEvent.eventKey] + " was not found.");
        }
    }
}
