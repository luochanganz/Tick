import { MapScene } from "./scene";
import { Babylon } from "./typs";

export class SceneManager {

    

    public static CreateMapScene(canvas: HTMLCanvasElement): MapScene {
        const engine = new Babylon.Engine(canvas, true);
        const mapScene = new MapScene(engine, canvas);
        return mapScene;
    }
}