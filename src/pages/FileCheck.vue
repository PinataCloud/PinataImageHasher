<template>
  <q-page class="flex flex-center">
      <q-uploader
        url="http://localhost:4444/upload"
        label="Restricted to images"
        multiple
        accept=".jpg, image/*"
        style="max-width: 600px"
      />  </q-page>
</template>

<script>
import AtraAPI from "../components/AtraAPI";
export default {

  name: "FileCheck",
  data: function() {
    return {
      status: "Connecting to IPFS...",
      id: "",
      agentVersion: "",
      cidList:[],
  };
  },
  mounted: function() {
    this.getIpfsNodeInfo();
    this.fillCIDsVariable();
  },
  methods: {
    async fillCIDsVariable() {
        this.cidList = await AtraAPI.GetCIDs();
        // console.log(this.cidList)
      },
    async getIpfsNodeInfo() {
      try {
        // Await for ipfs node instance.
        const ipfs = await this.$ipfs;
        // Call ipfs `id` method.
        // Returns the identity of the Peer.
        const { agentVersion, id } = await ipfs.id();
        this.agentVersion = agentVersion;
        this.id = id;
        // Set successful status text.
        this.status = "Connected to IPFS =)";
      } catch (err) {
        // Set error status text.
        this.status = `Error: ${err}`;
      }
    }
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
