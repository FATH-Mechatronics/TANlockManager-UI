<template>
  <v-layout column>
    <v-flex xs12>
      <lockList :locks="locks" suffix="/unknown" title="NewLock List"/>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import LockList from "../components/LockList.vue";
  import {Component, Vue} from "vue-property-decorator";
  import TanLock from "../model/TanLock";

  @Component({
    components: {
      LockList
    },
    async mounted() {
      return this.$axios
        .get(`/data/lock/unknown`)
        .then(res => {
          this.locks = res.data;
        });
    },
    head: {
      title: "New Locks"
    }
  })
  class NewLockPage extends Vue {
    locks: TanLock[] = [];
  }

  export default NewLockPage;
</script>
