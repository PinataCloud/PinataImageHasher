<template>
  <q-page class="flex flex-center">
  <!-- <q-item>
    metadata for following image: {{metaData}}
  </q-item>
  <img src="../assets/QmYS6y2phhtB1yDDUjhfcAEVp3WmT7tv24fkAR7FwcZQDC.jpg" id="imgTest"> -->
  <!--      if you want to see it: https://gateway.pinata.cloud/ipfs/ + {{cid}}-->
    <q-input class="GPL__toolbar-input" dense standout="bg-primary" v-model="filter" placeholder="Search (CID, Dates, Locations, ...)">
      <template v-slot:append>
        <q-icon v-if="filter === ''" name="search" />
        <q-icon v-else name="clear" class="cursor-pointer" @click="filter = ''" />
      </template>
    </q-input>

    <q-table
      name="CIDTable"
      row-key="cidTable"
      class="my-sticky-header-column-table"
      color="black"
      :data="tableData"
      :columns="columns"
      :filter="filter"
      :pagination.sync="pagination"
      style="width: 80vw;"
    />
    <!-- <q-item v-for="(cid, i) in knownCids":key="i">
      {{cid}} at {{knownDates[i]}} at {{knownLocations[i]}}
      <q-item-label>
      </q-item-label>
    </q-item> -->

  </q-page>
</template>

<script>
import AtraAPI from "../plugins/AtraAPI";
import ImageMetadata from "../plugins/ImageMetadata";

// TABLE DATA GENERATION
let tableData = [
  {
    name: 'Frozen Yogurt',
    loc: 159
  }
]

// we are not going to change this array,
// so why not freeze it to avoid Vue adding overhead
// with state change detection
Object.freeze(tableData)

export default {

  name: "CIDsList",
  data: function() {
    return {
      tableData,
      knownCids: [],
      knownDates:[],
      knownLocations:[],
      metaData:"",
        filter: '',
        pagination: {
          sortBy: 'name',
          descending: false,
          page: 1,
          rowsPerPage: 10
          // rowsNumber: xx if getting data from a server
        },
        columns: [
        {
          name: 'cidTable',
          required: true,
          label: 'Fingerprint (CID)',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: false,
          headerClasses: 'bg-blue text-white',
          classes: 'bg-grey-2 ellipsis',
          style: 'max-width: 150px'
        },
        { name: 'logT', label: 'Log Timestamp', field: 'logT', align: 'center', sortable: true },
        { name: 'fileT', label: 'File Timestamp', field: 'fileT', align: 'center', sortable: true },
        { name: 'loc', label: 'Loation (lat,long)', field: 'loc', align: 'center', sortable: true },
      ]
    }
  },
  mounted: function() {
    // this.retrieveImageMetadata();
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
<style lang="sass" scoped>
.my-sticky-header-column-table

  td:first-child
    /* bg color is important for td; just specify one */
    background-color: #c1f4cd !important

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #fff

  tr:first-child th
    top: 0
  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
</style>
