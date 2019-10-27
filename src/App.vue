<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import IpfsInfo from "./components/IpfsInfo.vue";

export default {
  name: "Corroborator Auditor",
  components: {
    IpfsInfo
  }
};
</script>
