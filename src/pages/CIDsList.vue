<template>
<q-page class="flex flex-center">
  <q-item>
    metadata for following image: {{metaData}}
  </q-item>
  <img src="../assets/QmYS6y2phhtB1yDDUjhfcAEVp3WmT7tv24fkAR7FwcZQDC.jpg" id="imgTest">

  <q-list>
    <q-item v-for="(cid, i) in knownCids":key="i">
<!--      if you want to see it: https://gateway.pinata.cloud/ipfs/ + {{cid}}-->
      {{cid}} at {{knownDates[i]}} at {{knownLocations[i]}}
      <q-item-label>
      </q-item-label>
    </q-item>

  </q-list>

</q-page>
</template>

<script>
import AtraAPI from "../plugins/AtraAPI";
import ImageMetadata from "../plugins/ImageMetadata";

export default {

  name: "CIDsList",
  data: function() {
    return {
      knownCids: [],
      knownDates:[],
      knownLocations:[],
        metaData:"",

    };
  },
  mounted: function() {
    this.retrieveImageMetadata();
    this.getAtraRecordData();
  },
  computed: {

  },
  methods: {

      async retrieveImageMetadata(){
        let img = document.getElementById("imgTest");
        // Pass in image data to get metadata out
        const jsonData =  await ImageMetadata.GetMetadata(img);
        // get specific information: jsonData["purpose"], etc.
        this.metaData = jsonData;
    },

    async getAtraRecordData() {
      [this.knownCids, this.knownDates, this.knownLocations] = await AtraAPI.GetCIDsLocationAndDates();
      // console.log(this.knownDates)
    },

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
