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
        url: 'https://www.mmldar.com/api/law/gs2.jpg',
        srcList: [
          'https://www.mmldar.com/api/law/gs2.jpg'
        ]
      }
    }
  }
</script>