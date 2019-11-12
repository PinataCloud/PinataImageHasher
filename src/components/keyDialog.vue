<template>
<div class="q-gutter-sm row items-center no-wrap">
  <q-btn no-caps label="Reporter PIN Select" color="primary" @click="persistent = true" />

  <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
    <q-card class="text-black" style="width: 44vw">
      <q-card-section class="bg-grey-4">
        <div class="text-center text-lg">Set the <b>Reporter PIN</b> to unlock the logbook for a specific <b>Reporter</b></div>
      </q-card-section>

      <q-card-section class="q-mt-md">
        <q-input label="Reporter PIN" v-model="key" clear-icon="format_clear" clearable class="text-center" rounded standout="bg-primary text-white">
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="around">
        <q-btn class="text-negative q-ml-sm" flat label="Cancel" @click="this.cancel" v-close-popup />
        <q-btn class="text-positive q-mr-sm" flat label="Set" @click="SetKey_RefreshData" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</div>
</template>

<script>
export default {
  name: 'keyDialog',
  data() {
    return {
      persistent: false,
      key: this.$encryption_key
    }
  },
  methods: {
    cancel() {
      this.key = this.$encryption_key;
    },
    SetKey_RefreshData() {
      this.$encryption_key = this.key;
      // TODO: get new atra data and decrypt
    }
  }
}
</script>
