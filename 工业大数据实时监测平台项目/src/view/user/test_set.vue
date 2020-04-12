<template>
    <div>
        <Upload
                :before-upload="handleUpload"
                :on-progress = "handlessss"
                :on-success = "handleSUCCC"
                action="http://127.0.0.1:8000/user/modeTou">
            <Button icon="ios-cloud-upload-outline">Select the file to upload</Button>
        </Upload>
        <div v-if="file !== null">Upload file: {{ file.name }} <Button type="text" @click="upload" :loading="loadingStatus">
            {{ loadingStatus ? 'Uploading' : 'Click to upload' }}</Button></div>

        <Upload action="http://127.0.0.1:8000/
user/modeTou" :on-progress = "handlessss"
                :on-success = "handleSUCCC">
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
        </Upload>
    </div>
</template>
<script>
    import { changeUserTou } from "@/api/user.js";
    export default {
        data () {
            return {
                file: null,
                loadingStatus: false
            }
        },
        methods: {
            handleSUCCC(response, file, fileList){
                console.log("_+++++=")
                console.log(response, file, fileList)
            },
            handlessss(file){
                console.log("____")
                console.log(file)
            },
            handleUpload (file) {
                this.file = file;
                console.log(file);
                return false;
            },
            async upload () {
                this.loadingStatus = true;
                const file = this.file;

                console.log(file[0]);
                const res = await  changeUserTou(file);
                console.log(res)
                setTimeout(() => {
                    this.file = null;
                    this.loadingStatus = false;
                    this.$Message.success('Success')
                }, 1500);
            }
        }
    }
</script>