<template>
<q-page class="flex flex-center">
  <!--UPLOAD FORM-->
  <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
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
  <div v-if="isSuccess">
    <div v-for="item in uploadedFiles">
      <q-card class="" >
      <img :src="item.url" class="img-card" :alt="item.originalName" max-height="75vh">
      <q-card-actions align="around" style="background: radial-gradient(circle, #4578e3 0%, #336699 100%)">
        <q-btn flat round color="blue-grey-9" icon="layers_clear" stacked no-caps label="Reset" @click="reset()"/>
        <q-btn flat round color="blue-grey-9" stacked no-caps label="Report" icon="image_search" @click="genCIDs()" />
      </q-card-actions>
      </q-card>

    </div>
  </div>

  <!--FAILED-->
  <div v-if="isFailed">
    <h2>Error... Fail.</h2>
    <p>
      <a href="javascript:void(0)" @click="reset()">Try again</a>
    </p>
    <pre>{{ uploadError }}</pre>
  </div>

</q-page>
</template>

<script>
import AtraAPI from "../plugins/AtraAPI";
import {
  upload
} from '../plugins/upload';

export default {

  name: "FileCheck",
  data: function() {
    return {
      knowCids: [],
      uploadedFiles: [],
      uploadedCids: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: 'photos'
    };
  },
  mounted: function() {
    //this.fillCIDsVariable();
    // this.genCID();
    this.reset();
  },
  computed: {
    isInitial() {
      return this.currentStatus === "STATUS_INITIAL";
    },
    isSaving() {
      return this.currentStatus === "STATUS_SAVING";
    },
    isSuccess() {
      return this.currentStatus === "STATUS_SUCCESS";
    },
    isFailed() {
      return this.currentStatus === "STATUS_FAILED";
    }
  },
  methods: {
    async fillCIDsVariable() {
      this.knowCids = await AtraAPI.GetCIDs();
      console.log(this.knowCids)
    },
    async genCIDs() {
      try {
        // const fReader = new FileReader();
        // Await for ipfs node instance.
        const ipfs = await this.$ipfs;
        const cids = this.uploadedFiles.map(file => ipfs.add(file.url, { onlyHash: true }));
        this.uploadedCids = cids; // NOTE - object, not just the hash
        // this.uploadedCids = cids.map(item => item.hash);
        console.log(this.uploadedCids);
      } catch (err) {
        // Set error status text.
        console.log(`Error: ${err}`);
      }
    },
    reset() {
      // reset form to initial state
      this.currentStatus = "STATUS_INITIAL";
      this.uploadedFiles = [];
      this.uploadError = null;
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
