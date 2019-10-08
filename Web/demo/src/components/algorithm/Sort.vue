<template>
  <div id="sort"></div>
</template>

<script>
import SortDemo from './sort.js';

let sort = new SortDemo();

export default {
	name:'sort-vue',
	mounted:function()
	{
		this.$nextTick(function()
		{
			sort.init('sort');
			sort.run();
		})
	}
}

</script>