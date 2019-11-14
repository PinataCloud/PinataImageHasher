<template>
<div class="fixed-center text-center">
  <img src="~assets/sad.svg" style="width:30vw;max-width:150px;">
  <p class="text-faded">Sorry, nothing here...<strong>(404)</strong></p>
  <q-btn color="secondary" style="width:300px;" to="/" label="Go back" />
</div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>
