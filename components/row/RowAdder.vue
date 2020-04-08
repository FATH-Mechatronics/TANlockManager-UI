<template>
  <v-card :style="hiddenStyle(this.$user.get(),'WRITE_CAGE') + gradientStyle">
    <v-card-title class="headline">New Cabinet Row</v-card-title>
    <v-card-text>
      <v-text-field label="Name" v-model="name"/>
      <v-divider/>
      Background:
      <v-radio-group v-model="gradient" row>
        <v-radio label="Red to Blue" value="#ff000066, #00000000, #00000000, #0000ff66"></v-radio>
        <v-radio label="Blue to Red" value="#0000ff66, #00000000, #00000000, #ff000066"></v-radio>
        <v-radio label="None" value=""/>
      </v-radio-group>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="addRow()">New Row</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import permissionHide from "../../commons/permissionHide";
  import Row from "~/model/Row";

  @Component
  class RowAdder extends Vue {
    editRow: Row = new Row();

    addRow() {
      if (this.editRow.name.length > 0) {
        this.$axios
          .post(`/data/row`, this.editRow)
          .then(() => {
            location.reload();
          })
          .catch(message => alert("Somm Error Occured"));
      } else {
        alert("You are missing inputs");
      }
    }

    get gradientStyle() {
      if (this.editRow.gradient.length > 0)
        return `background-image: linear-gradient(${this.editRow.gradient});`;
      return "";
    }

    hiddenStyle = permissionHide.hiddenStyle;
  }

  export default RowAdder;
</script>
