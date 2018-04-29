import { AudioLoader, AudioListener, Audio } from "three";
import { SoundEvents } from "./constants";

export interface SoundEvent {
    eventKey: SoundEvents;
    eventCommand: Sound;
}

export abstract class Sound {
    protected audio: Audio;
    protected volume: number;

    public constructor(protected audioLoader: AudioLoader, protected audioListener: AudioListener) {
        this.audio = new Audio(this.audioListener);
    }

    public stop(): void {
        if (this.audio.isPlaying) {
            this.audio.stop();
        }
    }

    public isPlaying(): boolean {
        return this.audio.isPlaying;
    }

    public setPitchSpeed(speedRatio: number): void {
        this.audio.setPlaybackRate(speedRatio);
    }

    public setVolume(volume: number): void {
        this.volume = volume;
    }

    public abstract async play(): Promise<void>;
}
