<template>
  <v-layout column xs12>
    <CageComponent v-for="cage in orderedCages" :cage="cage" :cages="cages" :locks="locks" v-bind:key="cage.id"/>
  </v-layout>
</template>

<script lang="ts">
  import CageComponent from "./Cage.vue";
  import {Component, Vue, Prop} from "vue-property-decorator";
  import TanLock from "../../model/TanLock";
  import Cage from "../../model/Cage";

  @Component({
    components: {
      CageComponent
    },
    async mounted() {
      return this.$axios.get(`/data/cage`).then(res => {
        this.$axios.get(`/data/lock`).then(resLock => {
          this.locks = resLock.data;
          this.cages = res.data;
        });
      });
    }
  })
  class CageListComponent extends Vue {
    cages: Cage[] = [];
    locks: TanLock[] = [];

    get orderedCages() {
      return this.cages.sort((a, b) => {
        if (a.order === b.order)
          return a.name < b.name ? -1 : a.name == b.name ? 0 : 1;
        return b.order - a.order;
      });
    }
  }

  export default CageListComponent;
</script>
