const commonStr='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ:?,.!()';

export class dom{
	static getSize(ele,props)
	{
		if(ele == undefined )
		{
			return -1;
		}

		let size = getComputedStyle(ele).getPropertyValue(props);

		if(size === undefined || size === '' )
		{
			size = ele[props];
			if(size === undefined)
			{
				return -1;
			}
		}

		if( size.indexOf === undefined || size.indexOf('px') === -1)
		{
			return size;
		}

		size = size.substring(0,size.length-2);
		size = parseFloat(size);

		return size;
	}

	static getCommonCharWidth(fontSize)
	{
		const size = dom.getTextWidth(commonStr,fontSize);
		return size/commonStr.length;
	}
	
	/**
	 * 适用于块级元素,
	 * 用于获取指定的class，style的块级元素的宽高
	 *
	 * @static
	 * @param {*} className
	 * @param {*} styleName
	 * @returns
	 * @memberof dom
	 */
	static getEleHeight(parent,className,styleObj)
	{
		let result = 10;
		parent = parent || document.body;
		let ele = document.createElement('div')
		ele.setAttribute('class',className);
		for(const key in styleObj)
		{
			ele.setAttribute(key,styleObj[key]);
		}
		parent.append(ele);

		result = {
			width: ele.offsetWidth,
			height:ele.offsetHeight,
		}

		parent.removeChild(ele);
		return result;
	}

	static getTextWidth(str,fontSize)
	{
		let result = 10;

		let ele = document.createElement('span')
		ele.innerText = str;
		ele.style.fontSize = fontSize;
		
		document.documentElement.append(ele);

		result =  ele.offsetWidth;

		document.documentElement.removeChild(ele);
		return result;
	}

	static getEleMaxUnScrollHeight(ele)
	{
		if(!(ele instanceof HTMLElement))
		{
			throw new TypeError( ele+'is not html element');
		}

		let cacheEle = ele;
		let brotherHeight = 0;
		while(cacheEle !== document.body)
		{
			const parent = cacheEle.parentElement;
			const parentMaxHeight = dom.getSize(parent,'maxHeight');
			const children = parent.children;

			for(let index=0;index<children.length;++index)
			{
				const brother = children[index];
				if(brother === cacheEle)
				{
					continue;
				}

				const nowHeight = dom.getSize(brother,'offsetHeight');
				console.log('nowHeight',brotherHeight,nowHeight,brother);
				brotherHeight += nowHeight;
			}

			console.log('caculateMaxHeight',parentMaxHeight,parent);

			if(parentMaxHeight !== -1) //存在最大高度时，就不用往上找了
			{
				return parentMaxHeight - brotherHeight;
			}
			else
			{
				cacheEle = parent;
			}
		}
		const totalHeight = document.body.clientHeight;
		console.log('bodyHeight',totalHeight,brotherHeight);
		return totalHeight - brotherHeight;
	}
}