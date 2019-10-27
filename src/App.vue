<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import IpfsInfo from "./pages/IpfsInfo.vue";

export default {
  name: "Corroborator Auditor",
  pages: {
    IpfsInfo
  }
};
</script>
