import Vue from 'vue';
// "async" is optional
export default ({ /* app, router, Vue, ... */ }) => {
  Vue.prototype.$encryption_key = "your key";
}
