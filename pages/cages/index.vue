<template>
  <v-layout column xs12>
    <v-flex>
      <CageList/>
      <CageAdder/>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import CageList from "../../components/cage/CageList.vue";
  import CageAdder from "../../components/cage/CageAdder.vue";
  import {Component, Vue} from "vue-property-decorator";

  @Component({
    components: {
      CageList,
      CageAdder
    },
    head:{
      title: "Cages"
    }
  })
  class CagesPage extends Vue {
  }

  export default CagesPage;
</script>
