import * as THREE from 'three';

export default class DemoBase{
	id = undefined;
	cmdQueue = new Array(5);

	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	meshSet = {};
	constructor()
	{
		if(new.target === undefined || new.target === DemoBase)
		{
			throw new Error("必须使用new生成实例，并且基类不可创建实例")
		}
	}

	initBase()
	{
		let rootDom = document.body;
		if(this.id!== undefined)
		{
			let tmpDom = document.getElementById(this.id);
			if(tmpDom)
			{
				rootDom = tmpDom;
			}
		}
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		rootDom.appendChild( this.renderer.domElement );
		this.camera.position.z = 5;
	}

	createSphere(num)
	{
		let geometry = new THREE.SphereGeometry( 0.1, 20, 20 );
		let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		this.meshSet.sphere = [];
		for(let i=0;i<num;++i)
		{
			let sphere = new THREE.Mesh( geometry, material );
			this.meshSet.sphere[i] = sphere;
		}
		
		for(let name in this.meshSet)
		{
			let mesh = this.meshSet[name];
			this.scene.add( mesh );
		}
	}

	getSphere(index)
	{
		return this.meshSet.sphere[index];
	}
}

