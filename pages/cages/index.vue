<template>
  <v-layout column xs12>
    <v-flex>
      <CageAdder/>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import CageAdder from "../../components/cage/CageAdder.vue";
  import {Component, Vue} from "vue-property-decorator";

  @Component({
    components: {
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
