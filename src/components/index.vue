<template>
    <div id="imgUpload">
        <h1>Image Slider</h1>
        <!--
        현재 배경 크기:
        <span>{{window.width}} x {{window.height}}</span>
        <br>
        <br>
-->
<!--슬라이드쇼 시작-->
        <button v-on:click="slideShowBtn" >슬라이드쇼</button>
        <br>

        <!--슬라이드쇼에서 컴포넌트를 통해 이미지 보여줌-->
        <div class="slideImg" v-if="slideShowbtnClicked" @click="slideImgClicked()">
            <slideShowImg :width="window.width"
                          :height="window.height"
                          :imgsrc="currentSlideImg"
            ></slideShowImg>
        </div>

        <br>
        <div class="userInfo">
            <h4>참여자 정보 입력</h4>
            <label for="userName">이름: </label>
            <input type="text" id="userName" placeholder="이름" v-model="userInfo.name">
            <label for="userNameEng"> 영어 이름: </label>
            <input type="text" id="userNameEng" placeholder="Name" v-model="userInfo.nameEng">
            <label for="userGender"> 성별: </label>
            <input type="text" id="userGender" placeholder="M/W" v-model="userInfo.gender">
            <label for="userAge"> 나이: </label>
            <input type="number" id="userAge" placeholder=0 v-model="userInfo.age"> 대
            <button @click="userclearBtn">Refresh</button>
            <br>

        </div>

        <div class="participantList">
            <h4>참여자 목록</h4>
                <div v-for="user in exportUserData" :key="user.id">
                    <div v-if="user.id>=1">
                            {{user.id}}&nbsp;&nbsp;&nbsp;
                            {{user.name}}&nbsp;&nbsp;&nbsp;
                            {{user.nameEng}}&nbsp;&nbsp;&nbsp;
                            {{user.gender}}&nbsp;&nbsp;&nbsp;
                            {{user.age}}
                    </div>
                </div>
        </div>

        <table class="tableSetting">
            <tbody>
            <tr>
                <td class="taskSetting">
                    <!--이미지 이름에 i,b,q가 들어가면 사전에 시간/키보드 설정.-->
                    <div >

                        <h4>이미지 이름별 설정</h4>
                        <div class="taskElement">
                            q(질문 이미지):
                            <input type="radio" id="q_time" value="time" v-model="q_tranMethod">
                            <label for="q_time">Time</label>
                            <input type="radio" id="q_keyboard" value="keyboard" v-model="q_tranMethod">
                            <label for="q_keyboard">keyboard</label>
                            <br>
                            <div v-if="q_tranMethod=='time'">
                                <input type="number" v-model="q_time"> 초
                            </div>
                        </div>

                        <div class="taskElement">
                            b(blank 이미지):
                            <input type="radio" id="b_time" value="time" v-model="b_tranMethod">
                            <label for="b_time">Time</label>
                            <input type="radio" id="b_keyboard" value="keyboard" v-model="b_tranMethod">
                            <label for="b_keyboard">keyboard</label>
                            <br>
                            <div v-if="b_tranMethod=='time'">
                                <input type="number" v-model="b_time"> 초
                            </div>
                        </div>

                        <div class="taskElement">
                            i(사진):
                            <input type="radio" id="i_time" value="time" v-model="i_tranMethod">
                            <label for="i_time">Time</label>
                            <input type="radio" id="i_keyboard" value="keyboard" v-model="i_tranMethod">
                            <label for="i_keyboard">keyboard</label>
                            <br>
                            <div v-if="i_tranMethod=='time'">
                                <input type="number" v-model="i_time"> 초
                            </div>
                        </div>

                        <br>

                    </div>

                </td>
                <td class="fileInfo">
                    <div >
                        <h4>csv 파일 정보</h4>
                        <label for="fileName">파일 이름: </label>
                        <input type="text" id="fileName" placeholder="파일 이름" v-model="fileName">
                        <br>
                        <br>

                        <!--csv 다운로드-->
                        이미지별 Keyboard 입력값 저장:
                        <br>
                        <vue-csv-downloader
                                :data="exportKeyData"
                                :fields="exportKeyFields"
                                :download-name="fileName+'_keyResult.csv'"
                        >
                            {{fileName+'_keyResult'}} .csv
                        </vue-csv-downloader>
                        <br>
                        <br>
                        참여자 목록 저장:
                        <br>
                        <vue-csv-downloader
                                :data="exportUserData"
                                :fields="exportUserFields"
                                :download-name="fileName + '_participant.csv'"
                        >
                            {{fileName+'_participant'}} .csv
                        </vue-csv-downloader>

                    </div>
                    <br>

                </td>
            </tr>
            </tbody>
        </table>






<!--이미지 불러오기-->
        <div class="imgInput">
            <h4>이미지 불러오기</h4>
            <input type="file" multiple accept="image/*" @change=uploadImage>
        </div>



<section>



    <div class="imgSetting"  v-if="clickedImg>=1">
<!--이미지 개별의 전환 방식 -->
        <br>
        {{imgList[clickedImg].name}}
        <h3>이미지 전환 방식</h3>

        <div class="transitionMethod">
            <input type="radio" id="time" value="time" v-model="imgList[clickedImg].tranMethod">
            <label for="time">Time</label>
            <br>
            <input type="radio" id="keyboard" value="keyboard" v-model="imgList[clickedImg].tranMethod">
            <label for="keyboard">keyboard</label>
        </div>
        <br>
        <div v-if="imgList[clickedImg].tranMethod=='time'">
            <input type="number" v-model="imgList[clickedImg].time"> 초
        </div>

    </div>

<!--이미지 미리보기-->
    <div class="showImage">
        <h4>이미지 리스트</h4>
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
    /* eslint-disable no-console */
    import slideShowImg from './slideShowImg.vue'
    import VueCsvDownloader from 'vue-csv-downloader';
    export default {
        name: "imgUpload",
        components:{VueCsvDownloader, slideShowImg},
        data(){
            return{
                userInfo:{
                    name:"",
                    nameEng:"",
                    gender:"",
                    age:0
                },
                fileName:"",
                slideShowbtnClicked: false,
                clickedImg: Number,
                previewImage:null,
                i_tranMethod:'time',
                b_tranMethod:'time',
                q_tranMethod:'time',
                i_time:2,
                b_time:2,
                q_time:2,
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
                ],
                exportKeyFields:['imageName','keyInput'],
                exportKeyData:[
                    {
                        imageName: '이미지 이름',
                        keyInput: '입력한 키보드 값'
                    }
                ],
                userId:1,
                exportUserFields:['id','name','nameEng','gender','age'],
                exportUserData:[
                    {
                        id:"순서",
                        name: "이름",
                        nameEng: "영문 이름",
                        gender:"성별",
                        age:"나이"
                    }
                ]

            }
        },
        created() {
            window.addEventListener('resize', this.handleResize)
            this.handleResize();
        },

        methods:{
            userclearBtn(){
              this.userInfo={
                  name:"",
                  nameEng:"",
                  gender:"",
                  age:Number
              }
            },
//이미지 불러오기
            uploadImage(imglist){

                for(let i=0;i<imglist.target.files.length;i++){
                    const reader = new FileReader();
                    const image = imglist.target.files[i];
                    reader.readAsDataURL(image);

                    var tranMethod_str = 'time';
                    var time_num = 2;
                    this.imgList.length= imglist.target.files.length;
//이미지 이름에 i,b,q가 들어가면 사전에 시간/키보드 설정.
                    reader.onload = e =>{
                        if(image.name.search('_i_')>0){
                            //console.log("IMAGE>>"+i);
                            tranMethod_str=this.i_tranMethod;
                            if(this.i_tranMethod=='time'){
                                time_num=this.i_time;
                            }
                        }
                        else if (image.name.search('_b_')>0){
                            //console.log("BLANK>>"+i)
                            tranMethod_str=this.b_tranMethod;
                            if(this.b_tranMethod=='time'){
                                time_num=this.b_time;
                            }
                        }
                        else if( image.name.search('_q_')>0){
                            //console.log("QUESTION>>"+i)
                            tranMethod_str=this.q_tranMethod;
                            if(this.q_tranMethod=='time'){
                                time_num=this.q_time;
                            }
                        }
                        else{
                           //console.log("Nothing>>+i")
                            tranMethod_str='time';
                        }
// imgData 구성한 뒤 imgList에 넣어줌.
                        var imgData = {
                            id: i,
                            name: image.name,
                            url: e.target.result,
                            tranMethod: tranMethod_str,
                            time: time_num
                        };
//imgList[0]에는 이미 데이터가 들어있어서 +1된 값에 저장.
                        this.imgList[i+1]= imgData;
                        //this.imgList.push(imgData);
                        //console.log(imgData);
                    };
                }
//마지막 이미지 추가.
                /*
                this.imgList[imglist.target.files.length+1]= {
                    tranMethod:'time',
                    url:'http://cdn.shopify.com/s/files/1/1711/8411/products/placard_thx_cdf0763b-e1e2-45f0-98af-4c00d72c9180_1024x1024.png?v=1492780365'
                }
*/

            },
//슬라이드쇼에서 이미지가 전체 화면에 맞도록 화면 크기에따라 변경
            handleResize() {
                this.window.width = window.innerWidth;
                this.window.height = window.innerHeight;
            },

//이미지를 클릭하면 값이 나옴, 이미지 각각의 값을 조정할 때
            imgClicked(id){
                console.log(id);
                console.log(this.imgList[id+1]);
                //console.log(this.imgList)
                this.clickedImg = id+1;
            },

//슬라이드쇼 버튼을 누르면 slideShow() 호출
            slideShowBtn(){
                this.slideShowbtnClicked=true;
                this.slideShow();

            }
            ,slideShow(){
                var thisVue = this;
//csv에 저장 될 유저 정보 작성. 슬라이드쇼가 시작되자 마자 작성됨.
            //키 결과값 용 데이터
                this.exportKeyData.push({imageName: this.userInfo.name,
                    keyInput: this.userInfo.nameEng});
            //참여자 정보용 데이터
                this.exportUserData.push({
                    id: this.userId,
                    name: this.userInfo.name,
                    nameEng: this.userInfo.nameEng,
                    gender: this.userInfo.gender,
                    age: this.userInfo.age
                });
                this.userId= this.userId+1;
                var array = this.imgList;
                slowEach( array,  function( element, index ) {
                    thisVue.currentSlideImg= thisVue.imgList[index].url;
                });

                function slowEach( array, callback ) {
                    if( ! array.length ) return;
                    var i = 1;
                    next();
                    function next() {
//다음 슬라이드가 마지막이거나, 슬라이드쇼에서 클릭을 했을때(slideShowbtnClicked==false일 경우)
                        if( callback( array[i], i ) !== false && thisVue.slideShowbtnClicked  ) {
                            if( i+1 < array.length ) {
                                console.log("number>>"+i);
                                console.log("METHOD>>"+array[i].tranMethod);
//tranMethod가 keyboard인 경우
                                if(array[i].tranMethod=='keyboard'){
                                    document.body.onkeydown = function(e) {
                                        console.log("KEYPRESSED>>"+e.code);
                                        //KeyO, KeyX, KeyA 값이 필요
                                        if(e.code=='KeyO'||e.code=='KeyX'||e.code=='KeyA'){
                                            console.log("Valid Key")
                                            var keyData={
                                                imageName: thisVue.imgList[i].name,
                                                keyInput: e.code[3]
                                            };
                                            console.log("KEYVALUE>>>"+e.code[3]);
                                            thisVue.exportKeyData.push(keyData);
                                            i+=1;
                                            setTimeout( next, 1);
                                        } else{
                                            console.log("Invalid Key")
                                        }
//이미지 이름과 누른 키값을 keyData에 저장

                                    }

//tranMethod가 time인 경우
                                } else if(array[i].tranMethod=='time'){
                                    document.body.onkeydown = function() {
                                        console.log("TIME_KEYPRESSED>>")
                                    }
                                    console.log("TIME>>"+array[i].time);
                                    i+=1;
                                    setTimeout( next, array[i-1].time*1000);

                                }


                            }
                        }

                    }


                }




            },
//슬라이드쇼에서 마우스를 클릭하면 나올 수 있도록 설정.
            slideImgClicked(){
                this.slideShowbtnClicked=false;
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
    input[type="number"] {
        width:50px;
    }
    input[type="text"]{
        width:100px;
    }
    .tableSetting{
        width: 100%;
        margin-right:20%;
        padding-right: 20%;
        padding-left: 20%;
    }
    .taskSetting{
        border-radius:5px;
        border: 3px solid rgba(0, 0, 0, 0.48);
        line-height:25px;


    }
    .fileInfo{
        width:50%;
        border-radius:5px;
        border: 3px solid rgba(0, 0, 0, 0.48);
        line-height:25px;
        padding-bottom: 20px;

    }
    .userInfo{
        padding-top:1px;
        padding-bottom: 20px;
        margin-bottom:10px;
        margin-left: 20%;
        margin-right:20%;
        background-color: rgba(0, 0, 0, 0.22);

    }

    .participantList{
        margin-bottom: 10px;
    }

    .taskElement{
        margin-bottom:10px;
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
        margin-top:10px;
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