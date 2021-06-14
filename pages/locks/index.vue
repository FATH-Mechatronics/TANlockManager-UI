<template>
  <v-layout column>
    <v-flex xs12>
      <LockList :locks="locks"/>
      <LockAdd/>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import LockList from "../../components/LockList.vue";
  import LockAdd from "../../components/LockAdd.vue";

  import {Component, Vue, Prop} from "vue-property-decorator";
  import TanLock from "../../model/TanLock";

  @Component({
    components: {
      LockList,
      LockAdd
    },
    async mounted() {
      return this.$axios.get(`/data/lock`).then(res => {
        this.locks = res.data;
      });
    },
    beforeMount() {
      this.$socketio.socket.on("tanlockEvent", msg => {
        if (msg != undefined) {
          let l: TanLock = this.locks.find(obj => obj.id === msg.id);
          if (l != undefined) {
            l.name = msg.name;
            l.ip = msg.ip;
            l.accepted = msg.accepted;
            l.state = msg.state;
            l.door_1 = msg.door_1;
            l.useDoor_1 = msg.useDoor_1;
            l.door_2 = msg.door_2;
            l.useDoor_2 = msg.useDoor_2;
            console.log("Modded Lock");
          } else {
            this.locks.push(msg);
            console.log("New Lock");
          }
          this.$forceUpdate();
        }
      });
    },
    head: {
      title: "Locks"
    }
  })
  class LocksPage extends Vue {
    locks: TanLock[] = [];
  }

  export default LocksPage;
</script>
