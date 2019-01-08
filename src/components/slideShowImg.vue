<template>
    <div class="slideShowImg">
        <img :src="this.imgsrc"
        :width="this.width" :height="this.height"/>
    </div>
</template>

<script>
    export default {
        name: "slideShowImg",
        props:{
            width: Number,
            height: Number,
            imgsrc: String
        }
    }
</script>

<style scoped>

</style>