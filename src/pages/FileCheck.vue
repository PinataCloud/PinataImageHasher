<template>
<q-page class="flex flex-center">
  <!--UPLOAD FORM-->
  <form enctype="multipart/form-data" novalidate v-if="isInitial">
    <q-card class="text-white" style="background: radial-gradient(circle, #4578e3 0%, #336699 100%)">
      <q-card-section>
        <div class="text-h5 text-center q-pb-md text-italic">Verify Images</div>

        <pinDialog class="justify-center q-mb-md" @new_pin="newPin"></pinDialog>

        <div class="col-12 dropbox" color="secondary">
          <div class="row full-width absolute-center items-center content-end">
            <q-icon class="q-pa-sm col-12" name="add_a_photo" size="xl" />
            <div v-if="isInitial" class="col-12">
              <b>Set the Reporter PIN</b><br>
              then drag your file(s) here to begin <br> or click to browse
            </div>
          </div>
          <input type="file" :name="uploadFieldName" @change="filesChange($event.target.name, $event.target.files);
                fileCount = $event.target.files.length" accept="image/*" class="input-file absolute-center">
        </div>

      </q-card-section>
    </q-card>
  </form>

  <!--UPLOADED IMAGE DISPLAY-->
  <div v-if="uploadedFiles && !isFailedDecrypt" v-for="item in uploadedFiles" class="flex justify-center q-pb-xl">
    <q-card class="img-card bg-blue-grey-2" align="center" style="width: 100%">

      <!--UPLOADED IMAGE-->
      <img class="q-ma-md" id="imgSelected" :src="item.url" :alt="item.originalName" style="max-width: 70vh">

      <!-- LOADING (displayed under image) -->
      <div v-if="isLoading" class="text-center">
        <q-spinner-pie class="q-mt-lg" color="primary" size="13%" />
        <p class="text-italic q-pa-sm" style="font-size:150%;">Extracting Metadata... Checking Fingerprint</p>
      </div>

      <!-- METADATA (displayed under image) , check vs. logs-->
      <div v-if="metaData" class="q-pa-md" :style="verifiedColor">
        <div v-if="verifiedCID">
          <h6>Fingerprint VERIFIED!</h6>
        </div>
        <div v-else>
          <h6>Fingerprint <b>NOT</b> in Log</h6>
        </div>
        <q-list dense bordered class="q-ma-sm rounded-borders bg-blue-grey-2">
          <q-item>
            <q-item-section>
              <b>Uploaded Fingerprint (CID)</b>
            </q-item-section>
            <q-item-section>
              {{shortCID}}
            </q-item-section>
          </q-item>

        <div v-if="isImg">
          <q-item v-for="(value, key) in metaData">
            <q-item-section>
              <b>{{ key }}</b>
            </q-item-section>
            <q-item-section>
              {{value}}
            </q-item-section>
          </q-item>
        </div>

        <div v-if="isFailedMeta">
          <p class="text-2xl text-italic"> <br> ALERT: <br> No Report Data <br> Found Within Image</p>
        </div>
        </q-list>
      </div>

      <!-- Actions under image -->
      <q-card-actions align="around" class="bg-blue-grey-2">
        <q-btn class="q-px-xl q-py-xs" color="blue-grey-9" icon-right="layers_clear" no-caps label="Reset" @click="reset()" />
        <q-btn color="blue-grey-9" no-caps label="Generate Report" icon-right="image_search" @click="checkImage()" />
      </q-card-actions>
    </q-card>

  </div>

  <!-- FAILED to Decrypt -->
  <div v-if="isFailedDecrypt" class="flex absolute-center object-center text-center">
    <q-card class="bg-warning" style="width: 80%">

      <h2>Unable to Decrypt Data.</h2>
      <h5><em>Enter a new PIN</em></h5>
      <pinDialog class="justify-center q-mb-xl" @new_pin="newPin"></pinDialog>
      <q-btn class="q-mb-lg" size="lg" rounded color="primary" stacked no-caps label="Reset the Page" @click="reset()" />
    </q-card>
  </div>

</q-page>
</template>

<script>
import pinDialog from "../components/pinDialog";
import AtraAPI from "../plugins/AtraAPI";
import ImageMetadata from "../plugins/ImageMetadata";
import {
  upload
} from '../plugins/upload';

export default {

  name: "FileCheck",
  data: function() {
    return {
      encryption_pin: this.$encryption_pin,
      currentStatus: "STATUS_INITIAL",
      metaData: "",
      verifiedCID: false,
      knownCids: [],
      uploadedFiles: [],
      uploadedCids: [],
      shortCID: "",
      uploadError: null,
      uploadFieldName: 'photos'
    };
  },
  mounted: function() {
    this.fillCIDsVariable();
    this.reset();
  },
  computed: {
    verifiedColor() {
      if (this.verifiedCID) return "background: green"
      else return "background: yellow"
    },
    isInitial() {
      return this.currentStatus === "STATUS_INITIAL";
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
    isFailedMeta() {
      return this.currentStatus === "STATUS_FAILED_META";
    },
    isFailedDecrypt() {
      return this.currentStatus === "STATUS_FAILED_DECRYPT";
    }
  },
  methods: {
    async fillCIDsVariable() {
      this.knownCids = await AtraAPI.GetCIDs(this.encryption_pin);
    },

    async retrieveImageMetadata() {
      // Pass in image data to extract metadata
      let img;
      img = document.getElementById("imgSelected");
      this.currentStatus = "STATUS_LOADING";

      await ImageMetadata.GetMetadata(img).then(response => {
        this.metaData = response;
        this.currentStatus = "STATUS_IMG";

      }).catch(err => {
        this.metaData = err;
        this.currentStatus = "STATUS_FAILED_META";
        console.log(`Error: ${err}`);

      });

    },

    newPin(pin) {
      this.encryption_pin = pin;
      this.currentStatus = "STATUS_LOADING";
      this.getAtraRecordData(this.encryption_pin).catch(err => {
        this.currentStatus = "STATUS_FAILED_DECRYPT";
      });
      this.currentStatus = "STATUS_INITIAL";

    },

    reset() {
      // reset form to initial state
      this.currentStatus = "STATUS_INITIAL";
      this.uploadedFiles = [];
      this.uploadedCids = [];
      this.uploadError = null;
      this.metaData = "";
      this.encryption_pin = this.$encryption_pin;
    },

    save(formData) {
      upload(formData)
        .then(x => {
          this.uploadedFiles = [].concat(x);
          this.currentStatus = "STATUS_SUCCESS";
        })
        .catch(err => {
          this.uploadError = err.response;
          this.currentStatus = "STATUS_FAILED";
        });
    },

    async filesChange(fieldName, fileList) {
      // handle file changes

      // GENERATE CID
      const ipfs = await this.$ipfs;
      let cid = await ipfs.add(fileList[0], {
        onlyHash: true
      })
      this.uploadedCids = cid[0]; // NOTE - object, not just the hash

      // TODO: USE FOR MULTIPLE FILES ...
      // let cids = await fileList.map(file => ipfs.add(file, {
      //   onlyHash: true
      // }));
      // this.uploadedCids = await cids[0]; // NOTE - object, not just the hash
      // // console.log(cids);

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
    },

    shortenCID(val) {
      let short = val.substring(0, 3) + " ... " + val.substring(val.length - 7, val.length);
      return short
    },

    async checkImage() {
      console.log(this.knownCids);
      console.log(this.uploadedCids.hash);
      if (this.knownCids.includes(this.uploadedCids.hash)) {
        this.verifiedCID = true;
      };
      this.shortCID = this.shortenCID(this.uploadedCids.hash); //TODO fix for multiple files
      let cids = this.retrieveImageMetadata()[0];
    }
  },
  components: {
    pinDialog: pinDialog
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.img-card {
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
  outline: 2px dashed grey;
  /* the dash box */
  outline-offset: -10px;
  padding: 10px 10px;
  min-height: 30vh;
  /* minimum height */
  min-width: 40vh;
  /* minimum height */
  position: relative;
  cursor: pointer;
  text-align: center;
}

.dropbox:hover {
  background: #5487e8;
  /* when mouse over to the drop zone, change color */
}
</style>
