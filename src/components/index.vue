<template>
    <div id="imgUpload">
        <h1>Image Slider</h1>

        <!--슬라이드쇼 시작-->
        <div v-if="slideShowbtnvalid">
            <button v-on:click="slideShowBtn" :disabled="slideShowbtnClicked">슬라이드쇼</button>
        </div>
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
            <hr>
            <label for="userName">이름: </label>
            <input type="text" id="userName" placeholder="이름" v-model="userInfo.name">&nbsp;
            <button @click="ExportBtn" :disabled="!csvExportBtn">KeyResult csv 파일 생성</button>
            <br>
        </div>
        <div class="participantList">
            <h4>참여자 목록</h4>
            <hr>
            <div v-for="user in exportUserData" :key="user.id">
                <div v-if="user.id>=1">
                    {{user.id}}&nbsp;&nbsp;&nbsp;
                    {{user.name}}&nbsp;&nbsp;&nbsp;

                    <vue-csv-downloader
                            :data="exportDataList[user.id]"
                            :fields="exportDataFields"
                            :download-name="user.id+'_'+user.name+'_keyResult.csv'"
                    >
                        {{user.id+'_'+user.name+'_keyResult'}} .csv
                    </vue-csv-downloader>
                </div>

            </div>
        </div>

        <table class="tableSetting">
            <tbody>
            <tr>
                <td class="taskSetting">
                    <!--이미지 이름에 i,b,q가 들어가면 사전에 시간/키보드 설정.-->
                    <div>
                        <h4>이미지 이름별 설정</h4>
                        <hr>
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
                    <div>
                        <h4>csv 파일 정보</h4>
                        <hr>
                        <label for="fileName">파일 이름: </label>
                        <input type="text" id="fileName" placeholder="파일 이름" v-model="fileName">
                        <br>
                        <!--csv 다운로드-->
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
            <hr>
            <input type="file" multiple accept="image/*" @change=uploadImage>
        </div>

        <section>
            <div class="imgSetting"  v-if="clickedImg>=1">
                <!--이미지 개별 전환 방식 -->
                <h3>이미지 전환 방식</h3>
                {{imgList[clickedImg].name}}
                <br>
                <br>
                <div>
                    <input type="radio" id="time" value="time" v-model="tranMethod">
                    <label for="time">Time</label>
                    <br>
                    <input type="radio" id="keyboard" value="keyboard" v-model="tranMethod">
                    <label for="keyboard">keyboard</label>
                </div>
                <br>
                <div v-if="tranMethod=='time'">
                    <input type="number" v-model="imgList[clickedImg].time"> 초
                </div>
                <br>
                <button @click="saveBtn">전환 방식 변경</button>
            </div>

            <!--이미지 미리보기-->
            <div class="showImage">
                <h4>이미지 리스트</h4>
                <hr>
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
                i_time:3,
                b_time:1,
                q_time:3,
                tranMethod: String,
                selectedImgId:Number,
                csvExportBtn:false,
                slideShowbtnvalid:false,
                currentSlideImg: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAKIBIADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAriP2jP2kfA37JHwc1n4gfEfxJp/hPwh4fiEt9qN4WKR5YKqqqgvJIzEKqIrOzEBQScV29fg3/wAHeXjLWvjz+1l+y7+zlZ3z2Oj+LNQW/utjHElzd3kdhBIyn5T5S+eV5/5bNnHGcpucqlOhS+OpJRV9rvX8k/nY0goKM6tX4YRcnby/4LR9KeDf+Dwv9kPxX8VU8OXI+KOg6ZJOYR4k1Hw9F/ZQGcCQrDcSXQU+9vkdwK/Tvwd420n4i+DNM8Q+H9Ssda0PW7OO/wBOv7OZZra9t5EDxyxupIZGUggg4IIr8+v2z/8Ag3k/Zj1b/gm/4n8CeFPhh4T8Ma/4Y8Oz3Wh+LILFF1xb23heSOW6vQvnXCu4xIkhZSrHaq7U2+Pf8GbH7RGr/FP/AIJseKvBeqztcw/DbxVNaaYzOxMNpdQpcCLnjAmM5GD/AB4wMDOqcJRr04v3qcVK/dN8vyd/lYwnzRVKo9ptxt1TS5vmrfj+Pov/AAQL/wCCz3xR/wCCp/xl+OXh34g6D4B0ey+G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8V2T6dqtj9pmtvtUD/eTzIWSRM+qMD71zf7IX7Gfw2/YN+DcPw/+FHhv/hFfCNvdzX0dh/aF1fbZpSDI3mXMsknJA43YHYCvUKKI+6247tWfmlqk/K+oPVJPpqvJ7X+4KKKKACuB+NP7Knwv/aSu9Kn+Inw38BePp9BLtpkniPw/aaq+nFypcwmeNzHuKJnbjOxc9BXfUUdU+weR4Frf/BL/AOBniL9tex/aJvPA/m/GPTERLbxANZ1BfKVbY2qj7KJxbHELFeYj1z15r32iihaRUFsunrv94PWXM99F8lt93QKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//Z",

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
                        time: Number,
                        isImg: Boolean
                    }
                ],
                exportDataFields:['imageName','keyInput','startTime','endTime'],
                exportData:[
                    {
                        imageName: '이미지 이름',
                        keyInput: '입력한 키보드 값',
                        startTime: '이미지 시작지점',
                        endTime: '이미지 끝나는 지점'
                    }
                ],
                exportDataList:[
                    [
                        {
                            imageName: '이미지 이름',
                            keyInput: '입력한 키보드 값',
                            startTime: '이미지 시작지점',
                            endTime: '이미지 끝나는 지점'
                        }
                    ]
                ]

                ,
                userId:1,
                exportUserFields:['id','name'],
                exportUserData:[
                    {
                        id:"순서",
                        name: "이름",
                    }
                ],

                timer:null,
                seconds: 0,


            }
        },
        created() {
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
            //document.documentElement.style.overflow = 'hidden'
        },
        watch:{

            slideShowbtnClicked:function () {
                if(this.slideShowbtnClicked){
                    document.documentElement.style.overflow = 'hidden'
                }
                else{
                    document.documentElement.style.overflow = 'auto'
                }
            }
        },
        methods:{

        //csv Export 하는 버튼
            ExportBtn(){
                this.userInfo={
                    name:"",
                    nameEng:"",
                    gender:"",
                    age:Number
                }
                this.csvExportBtn=false;
                if(this.exportData[this.exportData.length-1].imageName=='end'){
                    this.exportData[this.exportData.length-1]=''
                }
                this.exportDataList.push(this.exportData);
                this.exportData=[
                    {
                        imageName: '이미지 이름',
                        keyInput: '입력한 키보드 값',
                        startTime: '이미지 시작지점',
                        endTime: '이미지 끝나는 지점'
                    }
                ]

            },
            saveBtn(){
                this.imgList[this.clickedImg].tranMethod= this.tranMethod;
            },
//이미지 불러오기
            uploadImage(imglist){
                this.slideShowbtnvalid=true;

                this.imgList[1]={
                    id: 0,
                    name: 'StartScreen',
                    url:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABIAAAAKICAIAAACHSRZaAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAA25SURBVHhe7dcxDQAwDMCwAelZ/szKYSxyWTIJv5sFAAAgIGAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAAJGY/GFZc7Ay6vRoAAAAASUVORK5CYII="
                    ,tranMethod: 'keyboard',
                    time: 1
                };

                for(let i=0;i<imglist.target.files.length;i++){
                    const reader = new FileReader();
                    const image = imglist.target.files[i];
                    reader.readAsDataURL(image);

                    var tranMethod_str = 'time';
                    var time_num = 2;
                    var isImg_Bool = false;
                    this.imgList.length= imglist.target.files.length;
//이미지 이름에 i,b,q가 들어가면 사전에 시간/키보드 설정.
                    reader.onload = e =>{
                        if(image.name.search('_i_')>0){
                            //console.log("IMAGE>>"+i);
                            tranMethod_str=this.i_tranMethod;
                            isImg_Bool=true;
                            if(this.i_tranMethod=='time'){
                                time_num=this.i_time;
                            }
                        }
                        else if (image.name.search('_b_')>0){
                            //console.log("BLANK>>"+i)
                            tranMethod_str=this.b_tranMethod;
                            isImg_Bool=false;
                            if(this.b_tranMethod=='time'){
                                time_num=this.b_time;
                            }
                        }
                        else if( image.name.search('_q_')>0){
                            //console.log("QUESTION>>"+i)
                            tranMethod_str=this.q_tranMethod;
                            isImg_Bool=false;
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
                            id: i+1,
                            name: image.name,
                            url: e.target.result,
                            tranMethod: tranMethod_str,
                            time: time_num,
                            isImg: isImg_Bool
                        };
//imgList[0]에는 이미 데이터가 들어있어서 +1된 값에 저장.
                        this.imgList[i+2]= imgData;
                    };
                }
//마지막 이미지 추가.

                this.imgList[imglist.target.files.length+2]= {
                    tranMethod:'time',
                    name:'end',
                    url:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABIAAAAKICAIAAACHSRZaAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAA25SURBVHhe7dcxDQAwDMCwAelZ/szKYSxyWTIJv5sFAAAgIGAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAARAQMAAAgImAAAAARAQMAAIgIGAAAQETAAAAAIgIGAAAQETAAAICIgAEAAEQEDAAAICJgAAAAEQEDAACICBgAAEBEwAAAACICBgAAEBEwAACAiIABAABEBAwAACAiYAAAABEBAwAAiAgYAABARMAAAAAiAgYAABARMAAAgIiAAQAAJGY/GFZc7Ay6vRoAAAAASUVORK5CYII="
                }


            },
//슬라이드쇼에서 이미지가 전체 화면에 맞도록 화면 크기에따라 변경
            handleResize() {
                this.window.width = window.innerWidth;
                this.window.height = window.innerHeight;
            },

//이미지를 클릭하면 값이 나옴, 이미지 각각의 값을 조정할 때
            imgClicked(id){
                //console.log(id);
                //console.log(this.imgList[id+1]);
                //console.log(this.imgList)
                this.clickedImg = id+1;
                this.tranMethod=this.imgList[id+1].tranMethod;
            },

//슬라이드쇼 버튼을 누르면 slideShow() 호출
            slideShowBtn(){
                this.slideShowbtnClicked=true;
                this.csvExportBtn=true;
                this.slideShow();
            }
            ,slideShow(){

                var thisVue = this;
//csv에 저장 될 유저 정보 작성. 슬라이드쇼가 시작되자 마자 작성됨.
                //키 결과값 용 데이터
                this.exportData=[
                    {
                        imageName: '이미지 이름',
                        keyInput: '입력한 키보드 값'
                    }
                ];
                /*
                this.exportData.push({imageName: this.userId,
                    keyInput: this.userInfo.name});*/
                //참여자 정보용 데이터
                this.exportUserData.push({
                    id: this.userId,
                    name: this.userInfo.name
                });
                this.userId= this.userId+1;
                var array = this.imgList;

                slowEach( array,  function( element, index ) {
                    thisVue.currentSlideImg= thisVue.imgList[index].url;
                    console.log("Current Index>>>>"+index);
                    console.log("TIME>>"+thisVue.seconds);
                    //시작하는 슬라이드. 시간값 초기화. setInterval로 시작.
                    if(index==2){
                        console.log("Slide Start");
                        thisVue.timer= setInterval(add,1);
                        thisVue.seconds=0;
                    }


                    //끝나는 슬라이드, clearInterval, 시간값 초기화
                    if(index>=thisVue.imgList.length-1){
                        console.log("Slide End");
                        console.log(thisVue.seconds);
                        clearInterval(thisVue.timer);
                        thisVue.seconds=0;
                    }
                });

                function add() {
                    thisVue.seconds+=1;
                }

                function timeTransition(sec){
                    return sec/250.0;
                }

                function slowEach( array, callback ) {
                    if( ! array.length ) return;

                    var i = 1;
                    var startTime, endTime;

                    next();
                    function next() {
//다음 슬라이드가 마지막이거나, 슬라이드쇼에서 클릭을 했을때(slideShowbtnClicked==false일 경우)
                        if( callback( array[i], i ) !== false && thisVue.slideShowbtnClicked ) {
                            if( i+1 < array.length ) {
                                //console.log("number>>"+i);
                                //console.log("METHOD>>"+array[i].tranMethod);
//Time 설정. 이미지에서만 시간을 저장할 수 있도록
                                if(thisVue.imgList[i].isImg){
                                    startTime= timeTransition(thisVue.seconds);

                                } else{
                                    startTime='';
                                }


//tranMethod가 keyboard인 경우
                                if(array[i].tranMethod=='keyboard'){
                                    document.body.onkeydown = function(e) {
                                        //console.log("KEYPRESSED>>"+e.code);
                                        //KeyO, KeyX, KeyA 값이 필요
                                        if(e.code=='KeyO'||e.code=='KeyX'||e.code=='KeyA'||e.code=='Space'){
                                           // console.log("Valid Key")
                                            //키를 누르는 순간 이미지가 끝나는 시간 저장.
                                            if(thisVue.imgList[i].isImg){
                                                endTime= timeTransition(thisVue.seconds);
                                            } else{
                                                endTime='';
                                            }

                                            var keyData={
                                                imageName: thisVue.imgList[i].name,
                                                keyInput: e.code.replace('Key',''),
                                                startTime: startTime,
                                                endTime: endTime

                                            };
                                           // console.log("KEYVALUE>>>"+e.code.replace('Key',''));
                                            if(i>1){
                                                thisVue.exportData.push(keyData);
                                            }
                                            i+=1;
                                            setTimeout( next, 1);
                                        } else{
                                           // console.log("Invalid Key")
                                        }
//이미지 이름과 누른 키값을 keyData에 저장

                                    }
//tranMethod가 time인 경우
                                } else if(array[i].tranMethod=='time'){
                                    document.body.onkeydown = function() {
                                        //console.log("TIME_KEYPRESSED>>")
                                    }
                                    //console.log("TIME>>"+array[i].time);
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

    hr{
        width: 150px;
        margin-bottom: 15px;
    }
    h4{
        margin-bottom: 5px;
    }
    .showImage{
        width:60%;
        margin-top: 50px;
        margin-bottom: 150px;
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
    html{
        height:100%;
    }

    body{
        height:100%;
        overflow:hidden;
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
        padding-bottom: 20px;
        margin-bottom: 10px;
        margin-left: 20%;
        margin-right:20%;
        border-radius:5px;
        border: 3px solid rgba(0, 0, 0, 0.48);
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
        margin-top:40px;
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