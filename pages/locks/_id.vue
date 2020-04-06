<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm12 md12>
      <CabinetSideDetailComponent :lock="lock"/>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import CabinetSideDetailComponent from "../../components/cage/CabinetSideDetail.vue";
  import {Component, Vue} from "vue-property-decorator";
  import TanLock from "../../model/TanLock";

  function fetchLock(lock, context) {
    const con = context;
    return new Promise(resolve => {
      con.app.$axios
        .get(`/data/lock/${lock}`)
        .then(data => {
          console.log(data.data);
          resolve(data.data);
        })
        .catch(err => console.error(err));
    });
  }

  @Component({
    async asyncData(context) {
      let lock:any = await fetchLock(context.params.id, context);
      return {
        lock: lock
      };
    },
    components: {
      // LockEdit,
      CabinetSideDetailComponent
    },
    head: {
      title: "Lock"
    }
  })
  class LockPage extends Vue {
    lock: TanLock = new TanLock();
  }

  export default LockPage;
</script>
