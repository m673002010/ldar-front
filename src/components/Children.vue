<template>
    <div id="animateList">
        <div id="box">
            <div id="container1" ref="container1" :class="{ anim:animate == true }" @mouseenter="mEnter" @mouseleave="mLeave">
                <p v-for='(item, index) in List' :key="index">
                    <a :href="item">{{ item.split('/')[(item.split('/')).length-1] }}</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "animateList",
        props:{
            List: {
                type: Array,
                default: []
            },
        },
        data() {
            return {
                animate: false,
            }
        },
        mounted() {
            this.timer= setInterval(this.scroll,1000)
        },
        methods: {
            scroll() {
                let that = this;
                that.$refs.container1.style.marginTop = '-30px';
                that.animate = !that.animate;
                setTimeout(function () {
                    that.List.push(that.List[0]);
                    that.List.shift();
                    that.$refs.container1.style.marginTop = '0px';
                    that.animate = !that.animate; // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
                }, 500)
            },
            mEnter() {
                clearInterval(this.timer)
            },
            mLeave() {
                this.timer = setInterval(this.scroll, 3000)
            },
        },
        beforeDestroy() {
            if (this.timer) { clearInterval(this.timer); }
        },
    }
</script>

<style scoped>
    #box{
        height: 200px;
        width: 450px;
        overflow: hidden;
        transition: all 2s;
    }
    .anim{
        transition: all 2s;
    }
    #container1 li{
        list-style: none;
        line-height: 30px;
        height: 30px;
    }
</style>
