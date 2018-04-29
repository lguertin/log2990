import { AudioLoader, AudioBuffer, AudioListener } from "three";
import { RACE_START_SOUND_PATH, RACE_START_SOUND_VOLUME } from "./constants";
import { Sound } from "./sound";

export class SoundRaceStart extends Sound {
    public constructor(protected audioLoader: AudioLoader, protected audioListener: AudioListener) {
        super(audioLoader, audioListener);
    }

    public async play(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.audioLoader.load( RACE_START_SOUND_PATH, ( buffer: AudioBuffer ) => {
                this.audio.setBuffer( buffer );
                this.audio.setLoop( false );
                this.audio.setVolume( RACE_START_SOUND_VOLUME );
                this.audio.play();
            },
                                   () => {},
                                   () => {});
        });
    }
}
