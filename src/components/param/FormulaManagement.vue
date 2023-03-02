<template>
    <div style="text-align: center">
        <el-image
            :src="url" 
            :preview-src-list="srcList">
        </el-image>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        url: 'http://175.178.8.213:3002/law/gs2.jpg',
        srcList: [
          'http://175.178.8.213:3002/law/gs2.jpg'
        ]
      }
    }
  }
</script>