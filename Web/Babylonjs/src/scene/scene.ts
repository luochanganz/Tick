import { MapCamera } from "./camera";
import { TestTool } from "./TestTool";
import { Babylon } from "./typs";

export class MapScene {
    private _scene: Babylon.Scene;
    private _canvas: HTMLCanvasElement;
    private _camera: MapCamera;
    public get scene() {
        return this._scene;
    }

    public get canvas() {
        return this._canvas;
    }

    constructor(engine: Babylon.Engine, canvas: HTMLCanvasElement) {
        this._scene = new Babylon.Scene(engine);
        this._canvas = canvas;
        this._camera = new MapCamera(this);

        this.initLight();
        this.initEntities();
        this.initMinimap();

        engine.runRenderLoop(() => this.scene.render());
        window.addEventListener("resize", () => engine.resize());
    }

    public initLight() {
        const light = new Babylon.DirectionalLight(
            "light",
            new Babylon.Vector3(0, -1, 0),
            this.scene
        );
		light.intensity = 1;
    }

    public initEntities() {
        const sphere = Babylon.MeshBuilder.CreateSphere(
            "sphere1",
            {
                segments: 16,
                diameter: 20,
                sideOrientation: Babylon.Mesh.FRONTSIDE,
            },
            this.scene
        );
        sphere.position = new Babylon.Vector3(666, 0, 1024);

        const entities: any = TestTool.loadData().entities;
        for (const entityId in entities) {
            const entity = entities[entityId];
            const sphere = Babylon.MeshBuilder.CreateSphere(
                entityId,
                {
                    segments: 16,
                    diameter: entity.entityType == 'Hero' ? 70 : 20,
                    sideOrientation: Babylon.Mesh.FRONTSIDE,
                },
                this.scene
            );
            sphere.position = new Babylon.Vector3(entity.x, 0, entity.z);
        }
    }

    public initMinimap() {
        const ground = Babylon.MeshBuilder.CreateGround(
            "ground1",
            { width: 1024, height: 1024 },
            this.scene
        );
        ground.position = new Babylon.Vector3(1024, -1, 1024);
		
        //Create dynamic texture
        const textureGround = new Babylon.Texture(require('../assets/xxx.webp').default, this.scene, true);
        const materialGround = new Babylon.StandardMaterial("Mat", this.scene);
        materialGround.diffuseTexture = textureGround;
        ground.material = materialGround;
    }
}
