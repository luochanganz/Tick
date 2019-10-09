<template>
  <div id="sort"></div>
</template>

<script>
import SortDemo from './sort.js';



export default {
	name:'sort-vue',
	mounted:function()
	{
		this.$nextTick(function()
		{
			let sort = new SortDemo('sort');
			sort.init();
			sort.run();
		})
	}
}

</script>