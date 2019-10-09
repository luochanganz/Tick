import * as THREE from 'three';

export class Cmd{
	meshList = [];
	
	order = []; // 操作步骤与顺序
	index = 0;
	stepTime = 0; //每一个操作的动画时间，默认为0

	animateStepTime = 0; //播放中的动画过去的时间;
	animateIndex = 0; //当前动画步骤的索引

	xDis = {};
	yDis = {};
	zDis = {};

	xRota = {};
	yRota = {};
	zRota = {};

	xScal = {};
	yScal = {};
	zScal = {};

	lastTimeStamp = -1;
	loopKey = -1;

	setMeshs(meshs)
	{
		this.meshList = meshs;

		return this;
	}

	move(x,y,z)
	{
		this.xDis[this.index] = x || 0;
		this.yDis[this.index] = y || 0;
		this.zDis[this.index] = z || 0;

		this.order[this.index] = 'move';

		++this.index;
		return this;
	}

	rotate(x,y,z)
	{
		this.xRota[this.index] = x || 0;
		this.yRota[this.index] = y || 0;
		this.zRota[this.index] = z || 0;

		this.order[this.index] = 'rotate';

		++this.index;
		return this;
	}

	scale(x,y,z)
	{
		this.xScal[this.index] = x || 0;
		this.yScal[this.index] = y || 0;
		this.zScal[this.index] = z || 0;

		this.order[this.index] = 'scale';

		++this.index;
		return this;
	}

	excuteStart(milliSec,onUpdate)
	{
		this.stepTime = milliSec || 1;

		this.excute(0,this,onUpdate);
	}



	setDest(stepIndex)
	{
		let self = this;
		let animate = self.order[stepIndex]
		switch(animate)
		{
			case 'move':
				{
					let animateXDis = self.xDis[stepIndex];
					let animateYDis = self.yDis[stepIndex];
					let animateZDis = self.zDis[stepIndex];
					if(animateXDis<=0 && animateYDis<=0 && animateZDis<=0)
					{
						break;
					}
					for(let i=0;i<self.meshList.length;++i)
					{
						let mesh = self.meshList[i];
						mesh.position.x+=animateXDis;
						mesh.position.y+=animateYDis;
						mesh.position.z+=animateZDis;
					}
				}
				break;
			case 'rotate':
				{
					let animateXRota = self.xRota[stepIndex];
					let animateYRota = self.yRota[stepIndex];
					let animateZRota = self.zRota[stepIndex];
					if(animateXRota<=0 && animateYRota<=0 && animateZRota<=0)
					{
						break;
					}
					for(let i=0;i<self.meshList.length;++i)
					{
						let mesh = self.meshList[i];
						mesh.rotation.x+=animateXRota;
						mesh.rotation.y+=animateYRota;
						mesh.rotation.z+=animateZRota;
					}
				}
				break;
			case 'scale':
				{
					let animateXScale = self.xScal[stepIndex];
					let animateYScale = self.yScal[stepIndex];
					let animateZScale = self.zScal[stepIndex];
					if(animateXScale<=0 && animateYScale<=0 && animateZScale<=0)
					{
						break;
					}
					for(let i=0;i<self.meshList.length;++i)
					{
						let mesh = self.meshList[i];
						mesh.scale.x+=animateXScale;
						mesh.scale.y+=animateYScale;
						mesh.scale.z+=animateZScale;
					}
				}
				break;
		}
	}



	/**
	 *真实的动画移动操作
	 *
	 * @param {*} animateCount 将当前操作切分为多少步来进行，以达到动画效果
	 * @memberof Cmd
	 */
	act(stepIndex,animateCount) 
	{
		let self = this;
		let animate = self.order[stepIndex];
		switch(animate)
		{
			case 'move':
				{
					let animateXDis = self.xDis[stepIndex]/animateCount;
					let animateYDis = self.yDis[stepIndex]/animateCount;
					let animateZDis = self.zDis[stepIndex]/animateCount;
					if(animateXDis<=0 && animateYDis<=0 && animateZDis<=0)
					{
						break;
					}
					for(let i=0;i<self.meshList.length;++i)
					{
						let mesh = self.meshList[i];
						mesh.position.x+=animateXDis;
						mesh.position.y+=animateYDis;
						mesh.position.z+=animateZDis;
					}
					self.xDis[stepIndex] -= animateXDis
					self.yDis[stepIndex] -= animateYDis
					self.zDis[stepIndex] -= animateZDis
				}
				break;
			case 'rotate':
				{
					let animateXRota = self.xRota[stepIndex]/animateCount;
					let animateYRota = self.yRota[stepIndex]/animateCount;
					let animateZRota = self.zRota[stepIndex]/animateCount;
					if(animateXRota<=0 && animateYRota<=0 && animateZRota<=0)
					{
						break;
					}
					for(let i=0;i<self.meshList.length;++i)
					{
						let mesh = self.meshList[i];
						mesh.rotation.x+=animateXRota;
						mesh.rotation.y+=animateYRota;
						mesh.rotation.z+=animateZRota;
					}

					self.xRota[stepIndex] -= animateXRota
					self.yRota[stepIndex] -= animateYRota
					self.zRota[stepIndex] -= animateZRota
				}
				break;
			case 'scale':
				{
					let animateXScale = self.xScal[stepIndex]/animateCount;
					let animateYScale = self.yScal[stepIndex]/animateCount;
					let animateZScale = self.zScal[stepIndex]/animateCount;
					if(animateXScale<=0 && animateYScale<=0 && animateZScale<=0)
					{
						break;
					}
					for(let i=0;i<self.meshList.length;++i)
					{
						let mesh = self.meshList[i];
						mesh.scale.x+=animateXScale;
						mesh.scale.y+=animateYScale;
						mesh.scale.z+=animateZScale;
					}

					self.xScal[stepIndex] -= animateXScale
					self.yScal[stepIndex] -= animateYScale
					self.zScal[stepIndex] -= animateZScale
				}
				break;
		}
	}

	excute(timeStamp,self,onUpdate)
	{
		let  elapseTime = 0;
		if(self.lastTimeStamp > 0 && timeStamp>0)
		{
			elapseTime = timeStamp - self.lastTimeStamp;
		}
		if(timeStamp>0)
		{
			self.lastTimeStamp = timeStamp;
		}
		
		self.animateStepTime += elapseTime;

		if(self.animateStepTime>= self.stepTime)
		{
			//检查, 因为动画已经超时，直接设置为目标位置
			self.setDest(self.animateIndex);
			++self.animateIndex; //进入下一步
			self.animateStepTime = 0; //动画计时清零
			if(self.animateIndex>=self.order.length)
			{
				window.cancelAnimationFrame(self.loopKey);
			}
		}
		else if(elapseTime <=0) //上一帧无耗时(其实就是起始帧)
		{
			//认为帧耗时是 16ms, FPS差不多是60
			let animateCount = self.stepTime/16;
			animateCount = animateCount>0?animateCount:1;
			self.act(self.animateIndex,animateCount);
		}
		else
		{
			let validAnimateStepTime = self.stepTime - self.animateStepTime;
			let animateCount = validAnimateStepTime/elapseTime;
			animateCount = animateCount>0?animateCount:1;
			self.act(self.animateIndex,animateCount);
		}

		 self.loopKey = requestAnimationFrame((stamp)=>{
			self.excute(stamp,self,onUpdate);
			onUpdate();
		})
	}
}


export default class DemoBase{
	id = '';

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

