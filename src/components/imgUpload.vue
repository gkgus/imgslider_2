<template>
    <div id="imgUpload">
        <h1>Image Slider</h1>
        현재 배경 크기:
        <span>{{window.width}} x {{window.height}}</span>
        <br>
        <br>
        <button v-on:click="slideShowBtn" >슬라이드쇼</button>
        <br>
        <div class="slideImg" v-if="slideShowbtnClicked">

            <slideShowImg :width="window.width"
                            :height="window.height"
                            :imgsrc="currentSlideImg"></slideShowImg>
        </div>

        <br>
        <div class="imgInput">
            <input type="file" multiple accept="image/jpeg" @change=uploadImage>
        </div>



<section>

    <div class="imgSetting"  v-if="clickedImg>=0">

        <h3>이미지 전환 방식</h3>

        <div class="transitionMethod">
            <input type="radio" id="time" value="time" v-model="imgList[clickedImg+1].tranMethod">
            <label for="time">Time</label>
            <br>
            <input type="radio" id="keyboard" value="keyboard" v-model="imgList[clickedImg+1].tranMethod">
            <label for="keyboard">keyboard</label>
        </div>
        <br>
        <div v-if="imgList[clickedImg+1].tranMethod=='time'" >
            <input type="number" v-model="imgList[clickedImg+1].time"> milisecond
        </div>

        <button v-on:click="saveBtn" >저장</button>



    </div>

    <div class="showImage">
        <div v-for="item in imgList" class="inline"  :key="item.id" >
            <div v-if="item.id>=0">
                <div class="imgObj" @click="imgClicked(item.id)">
                    <img :src="item.url" class="uploaded-image" />
                    <h5>{{item.name}}</h5>
                </div>
            </div>


        </div>
    </div>

</section>



    </div>
</template>

<script>
    //        <router-link to="/slideShow">슬라이드쇼</router-link>
    /*
    * <img src="https://www.gettyimages.com/gi-resources/images/CreativeLandingPage/HP_Sept_24_2018/CR3_GettyImages-159018836.jpg"
                 :width="window.width" :height="window.height">
    * */
    /* eslint-disable no-console */
    import slideShowImg from './slideShowImg.vue'
    export default {
        name: "imgUpload",
        components:{slideShowImg},
        data(){
            return{
                slideShowbtnClicked: false,
                clickedImg: Number,
                previewImage:null,
                tranMethod: String,
                selectedImgId:Number,
                currentSlideImg: "https://images.pexels.com/photos/237018/pexels-photo-237018.jpeg?cs=srgb&dl=asphalt-autumn-beauty-237018.jpg&fm=jpg",
                window: {
                    width: 0,
                    height: 0
                },
                imgList:[
                    {
                        id: Number,
                        name: String,
                        url: String,
                        tranMethod: String,
                        time: Number
                    }
                ]
            }
        },
        created() {
            window.addEventListener('resize', this.handleResize)
            this.handleResize();
        },

        methods:{
            uploadImage(imglist){

                for(let i=0;i<imglist.target.files.length;i++){
                    const reader = new FileReader();
                    const image = imglist.target.files[i];
                    reader.readAsDataURL(image);
                    reader.onload = e =>{
                        var imgData = {
                            id: i,
                            name: image.name,
                            url: e.target.result,
                            tranMethod:'time',
                            time: 2000
                        }
                        this.imgList.push(imgData);
                        console.log(imgData);
                        //this.previewImage = e.target.result;
                        //console.log(this.previewImage);

                    };
                }


            },
            handleResize() {
                this.window.width = window.innerWidth;
                this.window.height = window.innerHeight;
            },

            saveBtn(){
                this.imgList[this.clickedImg+1].tranMethod=this.tranMethod;
            },

            imgClicked(id){
                console.log(id);
                this.clickedImg = id;
            },
            slideShowBtn(){
                this.slideShowbtnClicked=true;
               // this.currentSlideImg= this.imgList[1].url;
                this.slideShow();
                //this.currentSlideImg= this.imgList[1].url;
            }
            ,slideShow(){
                var thisVue = this;

                function slowEach( array, callback ) {
                    if( ! array.length ) return;
                    var i = 1;
                    next();
                    function next() {
                        if( callback( array[i], i ) !== false ) {
                            if( ++i < array.length ) {
                                console.log("METHOD>>"+array[i].tranMethod);
                                console.log("TIME>>"+array[i].time);
                                if(array[i].tranMethod)
                                document.body.onkeydown = function(e) {
                                    console.log("KEYPRESSED!!")
                                }
                                setTimeout( next, array[i].time);
                            }
                        }
                    }
                }

                var array = this.imgList;
                slowEach( array,  function( element, index ) {
                    thisVue.currentSlideImg= thisVue.imgList[index].url;
                    //console.log( element, index );
                });



            }
        }
    }
</script>

<style scoped>
    .showImage{
        width:60%;
    }
    .imgSetting{
        position:sticky;
        position: -webkit-sticky;
        top: 20px;
        border-radius:5px;
        border: 3px solid rgba(0, 0, 0, 0.48);
        float: right;
        width: 20%;
        margin-right: 10%;
        padding: 10px;
    }
    .transitionMethod{

    }
    html,body{
        height:100%;
    }
    .slideImg{
        z-index:1;
        position: fixed;
        top: 0;
        left: 0;
        /* Preserve aspet ratio */
        min-width: 100%;
        min-height: 100%;
    }
    .imgInput{
        margin-bottom: 10px;
    }
    .uploaded-image{
        width: 200px;
    }

    .imgObj{
        margin:5px;
    }

    .inline
    {
        display: inline-block;
    }
</style>