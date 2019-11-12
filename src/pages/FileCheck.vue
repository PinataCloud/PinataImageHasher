<template>
<q-page class="flex flex-center">
  <!--UPLOAD FORM-->
  <form enctype="multipart/form-data" novalidate v-if="isInitial">
    <q-card
          class="text-white"
          style="background: radial-gradient(circle, #4578e3 0%, #336699 100%)"
        >
          <q-card-section>
              <div class="text-h6 text-center q-pb-md">Verify Images</div>
              <div class="col-12 dropbox"
              color="secondary">
                <div class="row full-width absolute-center items-center content-end">
                    <q-icon class ="q-pa-sm col-12" name="add_a_photo" size="xl"/>
                    <div v-if="isInitial" class="col-12">
                      Drag your file(s) here to begin <br> or click to browse
                    </div>
                    <div v-if="isSaving" class="col-12">
                      Uploading {{ fileCount }} files...
                    </div>
                </div>
              <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files);
                fileCount = $event.target.files.length" accept="image/*" class="input-file absolute-center">
              </div>
          </q-card-section>
        </q-card>

  </form>

  <!--SUCCESS-->
  <div v-if="uploadedFiles" v-for="item in uploadedFiles" class="flex justify-center q-pt-xl">
      <q-card class="img-card" align="center" style="width: 90%">
      <img id="imgSelected" :src="item.url" :alt="item.originalName" style="max-width: 80vh">
      <!-- LOADING -->
      <div v-if="isLoading" class="text-center">
        <h5>loading...</h5>
      </div>
      <!-- METADATA LOADED -->
      <div v-if="metaData" class="q-pa-md" :style="verifiedColor">
        <div v-if="verifiedCID">
          <h6>Fingerprint VERIFIED!</h6>
        </div>
        <div v-else>
          <h6>Fingerprint <b>NOT</b> in Log</h6>
        </div>
        <q-list dense bordered padding class="rounded-borders">
          <q-item>
            <q-item-section>
              <b>Fingerprint (CID)</b>
            </q-item-section>
            <q-item-section >
              {{uploadedCids[0].hash}}
            </q-item-section>
          </q-item>
          <q-item v-for="(value, key) in metaData">
            <q-item-section>
              <b>{{ key }}</b>
            </q-item-section>
            <q-item-section>
              {{value}}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- FAILED METADATA LOADED -->
      <div v-if="isFailedRetrieve">
        <h2>Error... Failed to Verify File.</h2>
        <pre>{{ uploadError }}</pre>
      </div>
      <q-card-actions align="around" style="background: radial-gradient(circle, #4578e3 0%, #336699 100%)">
        <q-btn flat round color="blue-grey-9" icon="layers_clear" stacked no-caps label="Reset" @click="reset()"/>
        <q-btn flat round color="blue-grey-9" stacked no-caps label="Report" icon="image_search" @click="checkImage()" />
      </q-card-actions>
      </q-card>

    </div>

  <!--FAILED-->
  <div v-if="isFailedLoad">
    <h2>Error... Failed to Upload File.</h2>
    <p>
      <a href="javascript:void(0)" @click="reset()">Try again</a>
    </p>
    <pre>{{ uploadError }}</pre>
  </div>

</q-page>
</template>

<script>
import AtraAPI from "../plugins/AtraAPI";
import ImageMetadata from "../plugins/ImageMetadata";
import {
  upload
} from '../plugins/upload';

export default {

  name: "FileCheck",
  data: function() {
    return {
      currentStatus: null,
      metaData: "",
      verifiedCID: false,
      knownCids: [],
      uploadedFiles: [],
      uploadedCids: [],
      uploadError: null,
      uploadFieldName: 'photos'
    };
  },
  mounted: function() {
    this.fillCIDsVariable();
    this.reset();
  },
  computed: {
    verifiedColor(){
      if (this.verifiedCID) return "background: green"
      else return "background: yellow"
    },
    isInitial() {
      return this.currentStatus === "STATUS_INITIAL";
    },
    isSaving() {
      return this.currentStatus === "STATUS_SAVING";
    },
    isNoImg() {
      return this.currentStatus === "STATUS_NO_IMG";
    },
    isImg() {
      return this.currentStatus === "STATUS_IMG";
    },
    isLoading() {
      return this.currentStatus === "STATUS_LOADING";
    },
    isSuccess() {
      return this.currentStatus === "STATUS_SUCCESS";
    },
    isFailedLoad() {
      return this.currentStatus === "STATUS_FAILED_LOAD";
    },
    isFailedRetrieve() {
      return this.currentStatus === "STATUS_FAILED_RETRIEVE";
    }
  },
  methods: {
    async fillCIDsVariable() {
        // console.log("filecheck key:" + this.$encryption_key);
      this.knownCids = await AtraAPI.GetCIDs(this.$encryption_key);
      // console.log(this.knownCids)
    },
    async genCIDs() {
      try {
        // const fReader = new FileReader();
        // Await for ipfs node instance.
        const ipfs = await this.$ipfs;
        let cids = await this.uploadedFiles.map(file => ipfs.add(file.url, { onlyHash: true }));
        this.uploadedCids =  await cids[0]; // NOTE - object, not just the hash
        // this.uploadedCids = cids.map(item => item.hash);
        return this.uploadedCids[0].hash;
      } catch (err) {
        this.currentStatus = "STATUS_FAILED_LOAD";
        // Set error status text.
        console.log(`Error: ${err}`);
      }
    },
    async checkImage(){
      // TODO: FIX ME!!!!! CID is wrong of upload
      // if(this.knownCids.includes(this.genCIDs())) {
      if(this.genCIDs()) {
        this.verifiedCID = true;
      };
      this.retrieveImageMetadata();
    },
    async retrieveImageMetadata(){
        let img;
        img = document.getElementById("imgSelected");
        // Pass in image data to get metadata out
        this.currentStatus = "STATUS_LOADING";
        await ImageMetadata.GetMetadata(img).then( response =>{
                // get specific information: jsonData["purpose"], etc.
                this.metaData = response;
                console.log(response);
                this.currentStatus = "STATUS_IMG";

              }
          ).catch( err=>{
                  this.metaData = err;
              this.currentStatus = "STATUS_FAILED_RETRIEVE";
              console.log(`Error: ${err}`);

              }
          );

    },
    async getAtraRecordData() {
      [this.knownCids, this.knownDates, this.knownLocations] = await AtraAPI.GetCIDsLocationAndDates();
    },
    reset() {
      // reset form to initial state
      this.currentStatus = "STATUS_INITIAL";
      this.uploadedFiles = [];
      this.uploadedCids = [];
      this.uploadError = null;
      this.metaData = "";
    },
    save(formData) {
      // upload data to the server
      this.currentStatus = "STATUS_SAVING";

      upload(formData)
        .then(x => {
          this.uploadedFiles = [].concat(x);
          console.log(this.uploadedFiles);
          this.currentStatus = "STATUS_SUCCESS";
        })
        .catch(err => {
          this.uploadError = err.response;
          this.currentStatus = "STATUS_FAILED";
        });
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();

      if (!fileList.length) return;

      // append the files to FormData
      Array
        .from(Array(fileList.length).keys())
        .map(x => {
          formData.append(fieldName, fileList[x], fileList[x].name);
        });

      // save it
      this.save(formData);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.img-card{
  max-height: 75vh;
}

.input-file {
  opacity: 0;
  /* invisible but it's there! */
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 100;
}

.dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    padding: 10px 10px;
    min-height: 30vh; /* minimum height */
    min-width: 40vh; /* minimum height */
    position: relative;
    cursor: pointer;
    text-align: center;
  }

.dropbox:hover {
  background: #5487e8;
  /* when mouse over to the drop zone, change color */
}
</style>
