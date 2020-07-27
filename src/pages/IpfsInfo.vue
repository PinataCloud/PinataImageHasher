<template>
<q-page class="flex fit row wrap justify-center text-center">
  <img class="q-pt-lg" alt="Corroborator Logo" src="../assets/pinata.png" style="height: 7rem" />
  <h4 class="col-12 text-center"><b>{{ status }}</b></h4>
  <h5 class="col-12">Your Node ID: {{ id }}</h5>
  <h5 class="col-12">IPFS Agent version: {{ agentVersion }}</h5>
</q-page>
</template>

<script>
export default {
  name: "IpfsInfo",
  data: function() {
    return {
      status: "Connecting to IPFS...",
      id: "",
      agentVersion: ""
    };
  },
  mounted: function() {
    this.getIpfsNodeInfo();
  },
  methods: {
    async getIpfsNodeInfo() {
      try {
        const ipfs = await this.$ipfs;

        // Return the identity of the Peer.
        const {
          agentVersion,
          id
        } = await ipfs.id();
        this.agentVersion = agentVersion;
        this.id = id;
        // Set successful status text.
        this.status = "Connected to IPFS";
      } catch (err) {
        // Set error status text.
        this.status = `Error: ${err}`;
      }
    }
  }
};
</script>

<style scoped>
</style>
