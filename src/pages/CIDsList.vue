<template>
<q-page class="flex flex-center">

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
import {
  upload
} from '../plugins/upload';

export default {

  name: "CIDsList",
  data: function() {
    return {
      knownCids: [],
      knownDates:[],
      knownLocations:[],
    };
  },
  mounted: function() {
    this.fillCIDsVariable();
  },
  computed: {

  },
  methods: {
    async fillCIDsVariable() {
      [this.knownCids, this.knownDates, this.knownLocations] = await AtraAPI.GetCIDsLocationAndDates();
      console.log(this.knownDates)
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
