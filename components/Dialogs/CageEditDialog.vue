<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="clickOutside">
    <v-card :style="gradientStyle">
      <v-card-title class="headline">Edit Cage Row "{{cage.name}}"</v-card-title>
      <v-card-text>
        <v-text-field label="Name" v-model="cageName"/>
        <v-divider/>
        Background:
        <v-radio-group v-model="gradient" row>
          <v-radio label="Red to Blue" value="#ff000066, #00000000, #00000000, #0000ff66"></v-radio>
          <v-radio label="Blue to Red" value="#0000ff66, #00000000, #00000000, #ff000066"></v-radio>
          <v-radio label="None" value=""/>
        </v-radio-group>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="saveCage()">Save Row</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import Cage from "../../model/Cage";

  @Component({})
  class CageEditDialogComponent extends Vue {
    @Prop({
      default: () => new Cage()
    })
    cage: Cage;

    @Prop({
      default: false
    })
    dialog: boolean;

    editCageName: string = null;

    get cageName(): string {
      if (this.editCageName == null) {
        return this.cage.name;
      } else {
        return this.editCageName;
      }
    }

    set cageName(cageName: string) {
      this.editCageName = cageName;
    }

    editGradient: string = null;

    get gradient() {
      if (this.editGradient == null) {
        return this.cage.gradient;
      } else {
        return this.editGradient;
      }
    }

    set gradient(gradient: string) {
      this.editGradient = gradient;
    }

    saveCage() {
      if (this.cageName.length > 0) {
        this.$axios
          .put(`/data/cage/${this.cage.id}`, {
            name: this.cageName,
            gradient: this.gradient || ""
          })
          .then(() => {
            location.reload();
          })
          .catch(message => alert("Somm Error Occured"));
      } else {
        alert("You are missing inputs");
      }
    }

    get gradientStyle() {
      if (this.gradient != undefined && this.gradient.length > 0)
        return `background-image: linear-gradient(${this.gradient});`;
      return "";
    }

    clickOutside() {
      this.$emit("closed", null);
    }
  }

  export default CageEditDialogComponent;
</script>
