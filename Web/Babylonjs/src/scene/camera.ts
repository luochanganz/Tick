import { Babylon } from "./typs";
import { MapScene } from "./scene";


export class MapCamera {
    private _camera: Babylon.FreeCamera;

    public get camera() {
        return this._camera;
    }

    constructor(mapScene: MapScene) {
        this._camera = new Babylon.FreeCamera('main-camera', new Babylon.Vector3(1024, 100, 1024), mapScene.scene);
        this._camera.attachControl(mapScene.canvas, false);

        this._camera.setTarget(new Babylon.Vector3(1024, -1, 1024));

        this._camera.mode = Babylon.Camera.ORTHOGRAPHIC_CAMERA;
        this._camera.orthoTop =  512;
        this._camera.orthoRight = 512;
        this._camera.orthoBottom = -512;
        this._camera.orthoLeft = -512;

        this._camera.rotation.y = 0;

        const inputManger = this._camera.inputs.addMouseWheel();
    }
}