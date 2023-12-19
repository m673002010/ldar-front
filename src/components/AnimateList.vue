<template>
    <div id="animateList">
        <div id="box">
            <div id="scrollContainer" @mouseenter="mEnter" @mouseleave="mLeave">
                <div class="item" v-for='(item, index) in List' :key="index">
                    <a :href="item" style="text-decoration:none">{{ (item.split('/')[(item.split('/')).length-1]).split('.')[0] }}</a>
                </div>
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
            this.timer= setInterval(this.scroll,2000)
        },
        methods: {
            scroll() {
                let that = this
                that.animate = !that.animate
                setTimeout(function () {
                    that.List.push(that.List[0])
                    that.List.shift()
                    that.animate = !that.animate
                }, 500)
            },
            mEnter() {
                clearInterval(this.timer)
            },
            mLeave() {
                this.timer = setInterval(this.scroll, 2000)
            },
        },
        beforeDestroy() {
            if (this.timer) clearInterval(this.timer)
        }
    }
</script>

<style scoped>
    #box{
        overflow: hidden;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        /* width: 400px; */
    }

    #scrollContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #scrollContainer .item {
        height: 25px;
    }

	a:link {color: #4a5064}     /* 未访问的链接 */
	a:visited {color: #4a5064}  /* 已访问的链接 */
	a:hover {color: #4a5064}    /* 当有鼠标悬停在链接上 */
	a:active {color: #4a5064}   /* 被选择的链接 */
</style>
