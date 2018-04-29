import { AudioLoader, AudioBuffer, AudioListener } from "three";
import { CAR_ENGINE_SOUND_PATH, ENGINE_SOUND_VOLUME } from "./constants";
import { Sound } from "./sound";

export class SoundEngine extends Sound {
    public constructor(protected audioLoader: AudioLoader, protected audioListener: AudioListener) {
        super(audioLoader, audioListener);
        this.volume = ENGINE_SOUND_VOLUME;
    }

    public async play(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.audioLoader.load( CAR_ENGINE_SOUND_PATH, ( buffer: AudioBuffer ) => {
                this.audio.setBuffer( buffer );
                this.audio.setLoop( true );
                this.audio.setVolume( this.volume );
                this.audio.play();
            },
                                   () => {},
                                   () => {});
        });
    }
}
