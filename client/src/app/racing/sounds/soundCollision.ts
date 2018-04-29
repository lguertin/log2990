import { AudioLoader, AudioBuffer, AudioListener } from "three";
import { CAR_COLLISION_CAR_SOUND_PATH,
         CAR_COLLISION_WALL_SOUND_PATH,
         COLLISION_SOUND_VOLUME,
         MIN_COLLISION_SOUND_VOLUME } from "./constants";
import { Sound } from "./sound";

export class SoundCollisionCar extends Sound {
    public constructor(protected audioLoader: AudioLoader, protected audioListener: AudioListener) {
        super(audioLoader, audioListener);
        this.volume = COLLISION_SOUND_VOLUME;
    }

    public async play(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.audioLoader.load( CAR_COLLISION_CAR_SOUND_PATH, ( buffer: AudioBuffer ) => {
                this.audio.setBuffer( buffer );
                this.audio.setLoop( false );
                this.audio.setVolume( Math.min(this.volume + MIN_COLLISION_SOUND_VOLUME, COLLISION_SOUND_VOLUME) );
                this.audio.play();
            },
                                   () => {},
                                   () => {
                                       console.error("Sound Collision: Cound not load car-car collision sound.");
                                       });
        });
    }
}

export class SoundCollisionWall extends Sound {
    public constructor(protected audioLoader: AudioLoader, protected audioListener: AudioListener) {
        super(audioLoader, audioListener);
        this.volume = COLLISION_SOUND_VOLUME;
    }

    public async play(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.audioLoader.load( CAR_COLLISION_WALL_SOUND_PATH, ( buffer: AudioBuffer ) => {
                this.audio.setBuffer( buffer );
                this.audio.setLoop( false );
                this.audio.setVolume( Math.min(this.volume + MIN_COLLISION_SOUND_VOLUME, COLLISION_SOUND_VOLUME) );
                this.audio.play();
            },
                                   () => {},
                                   () => {
                                    console.error("Sound Collision: Cound not load car-wall collision sound.");
                                   });
        });
    }
}
