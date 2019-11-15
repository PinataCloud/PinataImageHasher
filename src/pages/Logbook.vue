<template>
<q-page>

  <!-- LOADING -->
  <div v-if="isLoading" class="absolute-center text-center text-bold text-italic">
    <h5>Loading Logs...</h5>
    <q-spinner-pie color="primary" size="40%" />
  </div>

  <!-- TABLE VIEW (STATUS_TABLE) -->
  <div v-if="isTable" class="flex flex-center">
    <q-input class="q-py-lg q-mr-xl" style="width: 55vw" dense standout="bg-primary" v-model="filter" placeholder="Search (CID, Dates, Locations, ...)">
      <template v-slot:append>
        <q-icon v-if="filter === ''" name="search" />
        <q-icon v-else name="clear" class="cursor-pointer" @click="filter = ''" />
      </template>
    </q-input>

    <pinDialog @new_pin="newPin"></pinDialog>

    <q-table name="cidTable" row-key="cid" no-data-label="No Log Data Available. Have you input the correct Reporter PIN?" loading-label="Gathering Log Data..." :loading="loading" :data="tableData" :columns="columns" :filter="filter"
      :pagination.sync="pagination" table-style="max-height: 67vh;" style="width: 80vw;" class="my-sticky-header-column-table" virtual-scroll :virtual-scroll-slice-size="25">
      <template v-slot:body-cell="props">
        <q-td :props="props" @click.native="selectCID(props.row)" class="cursor-pointer">
          <div>{{ props.value }}</div>
        </q-td>
      </template>
    </q-table>
  </div>

  <!-- IMAGE CARD VIEW (STATUS_IMG) -->
  <div v-if="currentRow.cid && !isFailedDecrypt" class="flex justify-center q-py-xl">
    <q-card class="bg-blue-grey-2" align="center" style="max-width: 90vw;">

      <!-- LOGBOOK IMAGE-->
      <img class="q-ma-md" id="imgSelected" :src="imgURL" style="max-width: 90vh" :alt="currentRow.cid">

      <!-- READING METADATA (displayed under image) -->
      <div v-if="isReading" class="text-center">
        <q-spinner-pie class="q-mt-lg" color="primary" size="13%" />
        <p class="text-italic q-pa-sm" style="font-size:150%;">Extracting Metadata... Checking Fingerprint</p>
      </div>

      <!-- METADATA (displayed under image) , check vs. logs-->
      <div v-if="metaData" class="q-pa-md">
        <q-list dense bordered class="q-ma-sm rounded-borders bg-blue-grey-2">

          <q-item class="justify-center">
            <p style="font-size:150%" class="q-pt-md">Image Metadata:</p>
          </q-item>

          <q-separator inset />

          <q-item>
            <q-item-section>
              <b>Fingerprint (CID)</b>
            </q-item-section>
            <q-item-section>
              {{currentRow.cid}}
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

          <q-separator spaced inset />

          <q-item class="justify-center">
            <p style="font-size:150%" class="q-pt-sm">Logbook data:</p>
          </q-item>

          <q-separator inset />

          <q-item v-for="(value, key) in currentRow">
            <q-item-section>
              <b>{{ key }}</b>
            </q-item-section>
            <q-item-section>
              {{value}}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Action buttons under image -->
      <q-card-actions align="around" class="bg-blue-grey-2">
        <q-btn class="q-px-xl q-py-xs" color="blue-grey-9" icon-right="layers_clear" no-caps label="Reset" @click="reset()" />
        <q-btn color="blue-grey-9" no-caps label="Generate Report" icon-right="image_search" @click="retrieveImageMetadata()" />
      </q-card-actions>
    </q-card>
    </q-card>

  </div>

  <!--FAILED-->
  <div v-if="isFailedDecrypt" class="flex absolute-center object-center text-center">
    <q-card class="bg-warning" style="width: 80%">

      <h2>Unable to Decrypt Data.</h2>
      <h5><em>Enter a new PIN</em></h5>
      <pinDialog class="justify-center q-mb-xl" @new_pin="newPin"></pinDialog>
      <q-btn class="q-mb-lg" size="lg" rounded color="primary" stacked no-caps label="Reset the Page" @click="reset()" />
    </q-card>
  </div>

  <div v-if="isFailedAtra" class="flex absolute-center object-center text-center">
    <q-card class="bg-warning" style="width: 80%">

      <h2>Unable to get Data from Server.</h2>
      <h5><em>Try refreshing the page.</em></h5>
    </q-card>
  </div>

</q-page>
</template>

<script>
import pinDialog from "../components/pinDialog";
import AtraAPI from "../plugins/AtraAPI";
import ImageMetadata from "../plugins/ImageMetadata";


// TABLE DATA GENERATION
export default {
  name: "Logbook",
  data: function() {
    return {
      filter: '',
      loading: true,
      encryption_pin: this.$encryption_pin,
      tableData: [],
      currentStatus: "STATUS_LOADING",
      currentRow: [],
      shortCID: "",
      imgURL: "",
      knownCids: [],
      knownDates: [],
      knownBlockTimes: [],
      knownStorageLocations: [],
      knownLocations: [],
      metaData: "",
      pagination: {
        sortBy: 'logT',
        descending: false,
        page: 1,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      },
      columns: [{
          name: 'cidTable',
          required: true,
          label: 'Fingerprint (CID)',
          field: row => row.cid,
          format: val => this.shortenCID(val),
          classes: 'ellipsis'
        },
        // { name: 'logT', label: 'Log Timestamp', field: 'logT', align: 'center', sortable: true },
        {
          name: 'fileT',
          label: 'Capture Time',
          field: 'fileT',
          align: 'center',
          sortable: true
        },
        {
          name: 'blockT',
          label: 'Logged Time',
          field: 'blockT',
          align: 'center',
          sortable: true
        },
        {
          name: 'location',
          label: 'Location (lat,long)',
          field: 'location',
          align: 'center',
          sortable: true
        },
        {
          name: 'StorageLocation',
          label: 'Storage',
          field: 'StorageLocation',
          align: 'center',
          sortable: true
        }
      ]
    }
  },
  mounted: function() {
    this.reset();
  },
  computed: {
    isTable() {
      return this.currentStatus === "STATUS_TABLE";
    },
    isImg() {
      return this.currentStatus === "STATUS_IMG";
    },
    isLoading() {
      return this.currentStatus === "STATUS_LOADING";
    },
    isReading() {
      return this.currentStatus === "STATUS_READING";
    },
    isFailedDecrypt() {
      return this.currentStatus === "STATUS_FAILED_DECRYPT";
    },
    isFailedAtra() {
        return this.currentStatus === "STATUS_FAILED_ATRA";
    }
  },
  methods: {

    shortenCID(val) {
      let short = val.substring(0, 3) + " ... " + val.substring(val.length - 7, val.length);
      return short
    },

    async retrieveImageMetadata() {
      let img;
      img = document.getElementById("imgSelected");

      this.currentStatus = "STATUS_READING";
      await ImageMetadata.GetMetadata(img).then(response => {
        // get specific information: jsonData["purpose"], etc.
        this.metaData = response;
      }).catch(err => {
        this.metaData = err;
        console.log("error reading metadata: " + err);
      });

      this.currentStatus = "STATUS_IMG";
    },

    async getAtraRecordData(pin) {
      this.tableData = [];
      this.currentStatus = "STATUS_LOADING";

      [this.knownCids, this.knownDates, this.knownLocations, this.knownBlockTimes, this.knownStorageLocations] = await AtraAPI.GetCIDsLocationAndDates(pin);

      for (let i = 0; i < this.knownCids.length; i++) {
        let newTableEntry = {
          cid: this.knownCids[i],
          fileT: this.knownDates[i],
          location: this.knownLocations[i],
          blockT: this.knownBlockTimes[i],
          StorageLocation: this.knownStorageLocations[i],
        };
        this.tableData.push(newTableEntry);
      }
      this.currentStatus = "STATUS_TABLE";
    },

    async selectCID(rowCID) {
      console.log(rowCID);
      this.currentRow = rowCID;
      this.shortCID = this.shortenCID(this.currentRow.cid);
      // NOTE: if you use a gateway you MUST enable XHR in browser else this fails silently!
      this.imgURL = 'https://gateway.pinata.cloud/ipfs/' + this.currentRow.cid;
      this.currentStatus = "STATUS_IMG";
    },

    reset() {
      this.newPin(this.$encryption_pin)
    },

    newPin(pin) {
      this.encryption_pin = pin;
      this.currentRow = [];
      this.metaData = "";
      this.currentStatus = "STATUS_LOADING";
      this.getAtraRecordData(this.encryption_pin).catch(err => {
          if (err instanceof SyntaxError) {
              console.log("Syntax error getting atra data: " + err);
              this.currentStatus = "STATUS_FAILED_ATRA";

          } else {
              console.log("error getting atra data: " + err);
              this.currentStatus = "STATUS_FAILED_DECRYPT";
          }
      });
    },
  },
  components: {
    pinDialog: pinDialog
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
