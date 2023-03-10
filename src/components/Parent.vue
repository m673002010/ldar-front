<template>
    <div id="container">
    	<animateList :List="List"></animateList>
	</div>
</template>

<script>

import animateList from './Children.vue' // 引入子组件路径

export default {
    data() {
        return {
            List:[
				'http://175.178.8.213:3002/pdf/广东省LDAR实施的技术要求.pdf',
				'http://175.178.8.213:3002/pdf/江苏省泄漏检测与修复(LDAR)实施技术指南.pdf',
				'http://175.178.8.213:3002/pdf/上海市设备泄漏挥发性有机物排放控制技术规程.pdf',
				'http://175.178.8.213:3002/pdf/石化行业泄漏检测与修复工作指南.pdf',
				'http://175.178.8.213:3002/pdf/石化行业VOCs污染源排查工作指南.pdf',
				'http://175.178.8.213:3002/pdf/石油化学工业污染物排放标准.pdf'
			]
        };
    },
    components:{
        animateList
    }
}
</script>

<style scoped>
    #container{
    	background-color: white;
    }
</style>

