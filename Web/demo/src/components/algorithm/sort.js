import * as THREE from 'three';
import DemoBase,{Cmd} from './demoBase.js';

export default class SortDemo extends DemoBase{

	constructor(id)
	{
		super();
		if(typeof id === 'string')
		{
			super.id = id;
		}
	}

	initMesh()
	{
		let geometry = new THREE.SphereGeometry( 1, 10, 10 );
		let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		let sphere = new THREE.Mesh( geometry, material );
		this.meshSet.sphere = sphere;

		for(let name in this.meshSet)
		{
			let mesh = this.meshSet[name];
			this.scene.add( mesh );
		}
	}

	init()
	{
		super.initBase();
		this.initMesh();
	}

	run()
	{
		let cmd = new Cmd();
		let self = this;
		cmd.setMeshs([this.meshSet.sphere])
			.rotate(10,10,10)
			.move(1,1,1)
			.rotate(-10,-10,-10)
			.excuteStart(1000,function()
		{
			self.renderer.render( self.scene, self.camera );
		});
	}
}

