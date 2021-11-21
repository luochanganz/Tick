import { useEffect, useState } from "react";
import { MapScene } from "./scene";
import { SceneManager } from "./sceneManager";

export const MapViewCom: React.FC = (props)=>{
    const [canvas, setCanvas] = useState(null as unknown as HTMLCanvasElement | null);
    const [_, SetScene] = useState(undefined as unknown as MapScene);

    useEffect(()=>{
        if(!canvas) {
            console.log('canvas not ready');
            return;
        }
        const mapScene = SceneManager.CreateMapScene(canvas);
        SetScene(mapScene);
    }, [canvas]);

    return (<div>
        <canvas className='main-scene' ref={ref=>setCanvas(ref)} />
    </div>);
}