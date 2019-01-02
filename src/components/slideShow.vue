<template>
    <div id="slideShow" >
        <img src="https://images.pexels.com/photos/237018/pexels-photo-237018.jpeg?cs=srgb&dl=asphalt-autumn-beauty-237018.jpg&fm=jpg"
             >

    </div>
</template>

<script>
    //:style="{ 'background-image': 'url(' + backgroundImage + ')' }"
    //:style="{width: window.width, height: window.height}"
    export default {
        name: "slideShow",
        props:[
            {
                imgUrl:String
            }
        ],
        data(){
            return{
                window: {
                    width: 0,
                    height: 0
                }
            }
        },
        created() {
            window.addEventListener('resize', this.handleResize)
            this.handleResize();
        },
        methods: {
            handleResize() {
                this.window.width = window.innerWidth;
                this.window.height = window.innerHeight;
            }
        }
    }
</script>

<style scoped>
    html,body{
        height:100%;
    }
    #slideShow{
        position: fixed;
        top: 0;
        left: 0;
        /* Preserve aspet ratio */
        min-width: 100%;
        min-height: 100%;
    }
    .slide-img{
    z-index:-1;
    height:100%;
    margin: 0;
    position: center;

}
</style>