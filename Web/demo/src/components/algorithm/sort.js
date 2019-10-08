import * as THREE from 'three';
import DemoBase from './demoBase.js';

export default class SortDemo extends DemoBase{

	initMesh()
	{
		let geometry = new THREE.SphereGeometry( 0.1, 20, 20 );
		let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		let sphere = new THREE.Mesh( geometry, material );
		this.meshSet.sphere = sphere;

		for(let name in this.meshSet)
		{
			let mesh = this.meshSet[name];
			this.scene.add( mesh );
		}
	}

	init(id)
	{
		if(typeof id === 'string')
		{
			this.id = id;
		}
		super.initBase();
		this.initMesh();
	}

	run()
	{
		this.animate(this);
	}

	animate(self) 
	{
		let animate = self.animate;
		requestAnimationFrame( ()=>(animate(self)) );
		self.meshSet.sphere.rotation.x += 0.01;
		self.meshSet.sphere.rotation.y += 0.01;
		self.renderer.render( self.scene, self.camera );
	}
}

