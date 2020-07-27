<template>
<q-page>

  <!--UPLOAD FORM-->
  <form class="absolute-center" enctype="multipart/form-data" novalidate v-if="isInitial">
    <q-card class="text-white" style="background: radial-gradient(circle, #4578e3 0%, #336699 100%)">
      <q-card-section>
        <div class="text-h5 text-center q-pb-md text-italic">Check Image CID</div>

        <div class="col-12 dropbox" color="secondary">
          <div class="row full-width absolute-center items-center content-end">
            <q-icon class="q-pa-sm col-12" name="add_a_photo" size="xl" />
            <div class="col-12">
              Drag your file here to begin <br> or click to browse
            </div>
          </div>
          <input type="file" :name="uploadFieldName" @change="filesChange($event.target.name, $event.target.files);
                fileCount = $event.target.files.length" accept="image/*" class="input-file absolute-center">
        </div>

      </q-card-section>
    </q-card>
  </form>

  <!--UPLOADED IMAGE DISPLAY-->
  <div v-if="!isInitial" class="flex justify-center q-py-xl">
    <q-card class="bg-blue-grey-2" align="center" >

      <!--UPLOADED IMAGE-->
      <img class="q-ma-md" id="imgSelected" :src="this.uploadedFile.url"
           :alt="this.uploadedFile.originalName"
           style="max-width: 90%;">

      <q-item>
        <q-item-section>
        <q-item-label>
          <b>Image CID</b>
        </q-item-label>
        <q-item-label >
          {{uploadedCids.hash}}
        </q-item-label >
        </q-item-section>
      </q-item>

      <!-- Actions under image -->
      <q-card-actions align="around" class="bg-blue-grey-2">
        <q-btn class="q-px-xl q-py-xs" color="blue-grey-9" icon-right="layers_clear" no-caps label="Reset" @click="reset()" />
      </q-card-actions>
    </q-card>

  </div>

</q-page>
</template>

<script>
import {
  upload
} from '../plugins/upload';

export default {

  name: "FileCheck",
  data: function() {
    return {
      currentStatus: "STATUS_INITIAL",
      uploadedFile: [],
      uploadedCids: [],
      uploadError: null,
      uploadFieldName: 'photos'
    };
  },
  mounted: function() {
    this.reset();
  },
  computed: {

    isInitial() {
      return this.currentStatus === "STATUS_INITIAL";
    }
  },
  methods: {

    reset() {
      // reset form to initial state
      this.currentStatus = "STATUS_INITIAL";
      this.uploadedFile = [];
      this.uploadedCids = [];
      this.uploadError = null;
    },

    save(formData) {
      upload(formData)
        .then(x => {
          this.uploadedFile = x[0]; //TODO get multi files?
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

  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
