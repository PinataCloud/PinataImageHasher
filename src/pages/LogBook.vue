<template>
  <q-page class="flex flex-center">
    <q-input class="GPL__toolbar-input" dense standout="bg-primary" v-model="filter" placeholder="Search (CID, Dates, Locations, ...)">
      <template v-slot:append>
        <q-icon v-if="filter === ''" name="search" />
        <q-icon v-else name="clear" class="cursor-pointer" @click="filter = ''" />
      </template>
    </q-input>

    <q-table
      name="cidTable"
      row-key="cid"
      no-data-label="No Data Found. Have you selected a Log to read from?"
      loading-label="Gathering Log Data..."
      :data="tableData"
      :columns="columns"
      :filter="filter"
      :pagination.sync="pagination"
      table-style="max-height: 67vh;"
      style="width: 80vw;"
      class="my-sticky-header-column-table ahhhhh"
      virtual-scroll
      :virtual-scroll-slice-size="25"
    />

  </q-page>
</template>

<script>
import AtraAPI from "../plugins/AtraAPI";
import ImageMetadata from "../plugins/ImageMetadata";

// TABLE DATA GENERATION
let tableData = [
  {
    cid: "QmYS6y2phhtB1yDDUjhfcAEVp3WmT7tv24fkAR7FwcZQDC",
    logT: "NONE",
    fileT: "NONE",
    location: "(-104.990251, 39.7392358)",
    purpose: "fun",
    device_model: "iPhone9,1",
    device_id: "7428023F-46AC-4DD1-99C9-3EAD40A2E458",
    department: "Los Angeles Police Deparment",
    user_name: "Ian P"
  }
]

for (let i = 0; i < 50; i++) {
  tableData.push(tableData[0])
}

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
          sortBy: 'logT',
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
          field: row => row.cid,
          format: val => `${val}`,
          classes: 'ellipsis',
          style: 'max-width: 150px;'
        },
        { name: 'logT', label: 'Log Timestamp', field: 'logT', align: 'center', sortable: true },
        { name: 'fileT', label: 'File Timestamp', field: 'fileT', align: 'center', sortable: true },
        { name: 'location', label: 'Location (lat,long)', field: 'location', align: 'center', sortable: true },
        { name: 'purpose', label: 'Purpose', field: 'purpose', align: 'center', sortable: true },
        { name: 'device_model', label: 'Device Model', field: 'device_model', align: 'center', sortable: true },
        { name: 'device_id', label: 'Device ID', field: 'device_id', align: 'center', sortable: true },
        { name: 'department', label: 'Department', field: 'department', align: 'center', sortable: true },
        { name: 'user_name', label: 'Logged by User', field: 'user_name', align: 'center', sortable: true }
      ]
    }
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
<style lang="sass">
.my-sticky-header-column-table

  background-color: #336699

  td
    /* bg color is important for td; just specify one */
    background-color: #eee
  td:first-child
    /* bg color is important for td; just specify one */
    background-color: #4578e3 !important

  tr th
    background: #336699 !important
    opacity: 1 !important

    position: sticky
    /* higher than z-index for td below */
    z-index: 2

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
