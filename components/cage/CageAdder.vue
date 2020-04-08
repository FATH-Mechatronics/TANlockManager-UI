<template>
  <v-card :style="hiddenStyle(this.$user.get(),'WRITE_CAGE')">
    <v-card-title class="headline">New Cage</v-card-title>
    <v-card-text>
      <v-text-field label="Name" v-model="name"/>
      <v-divider/>
      Color:
      <v-color-picker :hide-inputs="true" :hide-canvas="true" v-model="color" :show-swatches="true" width="100%"></v-color-picker>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="addCage()">New Cage</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import permissionHide from "../../commons/permissionHide";

  @Component
  class CageAdderComponent extends Vue {
    name: string = "";
    color: string = "#FFFFFF";

    addCage() {
      if (this.name.length > 0) {
        this.$axios
          .post(`/data/cage`, {
            name: this.name,
            color: this.color
          })
          .then(() => {
            location.reload();
          })
          .catch(message => alert("Somm Error Occured"));
      } else {
        alert("You are missing inputs");
      }
    }

    hiddenStyle = permissionHide.hiddenStyle;
  }

  export default CageAdderComponent;
</script>
