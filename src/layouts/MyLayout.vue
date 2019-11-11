<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        />

        <q-toolbar-title v-if="$q.screen.gt.sm" shrink class="row items-center no-wrap">
          <img src="~assets/corroborator.png"  height="20">
            <span class="q-ml-sm"><strong>Corro</strong>borator Auditor</span>
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <!-- <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn> -->
            <q-btn label="Encryption pin" color="primary" @click="persistent = true" />

            <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
              <q-card class="bg-secondary text-black" style="width: 40vw">
                <q-card-section>
                  <div class="text-center text-h5">Set the Reporter PIN to decrypt the logbook data</div>
                </q-card-section>

                <q-card-section>
                  <p class="text-center">{{encryption_key}}</p>
                </q-card-section>

                <q-card-actions align="right" class="bg-white text-positive">
                  <q-btn flat label="Set" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      behavior="mobile"
      @click="leftDrawerOpen = false"
    >
      <q-scroll-area class="fit">
        <q-toolbar class="GPL__toolbar">
          <q-toolbar-title class="row items-center text-grey-8">
            <img src="~assets/corroborator.png" height="20">
            <span class="q-ml-sm"><strong>Corro</strong>borator Auditor</span>
          </q-toolbar-title>
        </q-toolbar>

        <q-list padding>
          <q-item v-for="link in links1" :key="link.text" clickable class="GPL__drawer-item" :to="link.to">
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <!-- <q-item v-for="link in links2" :key="link.text" clickable class="GPL__drawer-item" :to="link.to">
            <q-item-section avatar >
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item> -->

          <q-separator class="q-my-md" />

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="GPL__page-container">
      <router-view />

      <q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
        <div class="fit q-pt-xl q-px-sm column">
          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn"
          to="/">
            <q-icon size="22px" name="library_books" />
            <div class="GPL__side-btn__label">Logbook</div>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn"
          to="/FileCheck">
            <q-icon size="22px" name="image_search" />
            <div class="GPL__side-btn__label">File Check</div>
          </q-btn>

          <!-- <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn"
          to="IpfsInfo">
            <q-icon size="22px" name="assistant" />
            <div class="GPL__side-btn__label">Logbook Creator</div>
          </q-btn> -->

        </div>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>
import key from "../config/env.js";
console.log(key);

export default {
  name: 'CorroboratorLayout',

  data () {
    return {
      encryption_key: "",
      persistent: false,
      leftDrawerOpen: false,
      links1: [
        { icon: 'library_books', text: 'Logbook', to: '/' },
        { icon: 'image_search', text: 'File Check', to: 'FileCheck' },
        // { icon: 'assistant', text: 'Logbook Creator', to: 'IpfsInfo' }
      ],
      // links2: [
      //   { icon: 'settings', text: 'Settings', to: '/' },
      //   { icon: 'get_app', text: 'App Downloads', to: '/' }
      //   { icon: 'help', text: 'Help & Feedback', to: '/' },
      // ]
    }
  }  ,
  mounted: function() {
    this.getKey();
  },
  methods: {
    async getKey() {
      this.encryption_key = key;
      console.log(this.encryption_key)
    }
  }
}
</script>

<style lang="sass">
.GPL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 55%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368

    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px

  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500

  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px
</style>
