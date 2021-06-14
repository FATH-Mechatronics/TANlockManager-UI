<template>
  <v-layout style="margin: 1em 0;" row>
    <v-card>
      <v-card-title>
        <div class="flex-grow-1"></div>
        <v-text-field
          v-model="searchLeft"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-text>
        <v-data-table
          show-select
          :item-key="value"
          class="mr-3"
          :headers="headerLeft"
          :items="choosenOptions"
          v-model="selectedLeft"
          :search="searchLeft"
          dense
        ></v-data-table>
      </v-card-text>
    </v-card>
    <div style="display: inline-box;">
      <v-btn block @click.stop="add()">ADD</v-btn>
      <br/>
      <v-btn block @click.stop="remove()">REMOVE</v-btn>
    </div>
    <v-card>
      <v-card-title>
        <div class="flex-grow-1"></div>
        <v-text-field
          v-model="searchRight"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-text>
        <v-data-table
          show-select
          :item-key="value"
          class="ml-3"
          :headers="headerRight"
          :items="filteredOptions"
          v-model="selectedRight"
          :search="searchRight"
          dense
        ></v-data-table>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";

  @Component({})
  class PickListComponent extends Vue {
    @Prop({
      default: () => {
        return [];
      }
    })
    options!: any[];

    @Prop({
      default: () => {
        return [];
      }
    })
    choosenOptions!: any[];

    @Prop({
      default: () => {
        return "Value";
      }
    })
    titleLeft!: string;

    @Prop({
      default: () => {
        return "Options";
      }
    })
    titleRight!: string;

    @Prop({
      default: () => {
        return "val";
      }
    })
    value!: string;

    @Prop({
      default: () => {
        return "on-selected";
      }
    })
    event: string;

    headerLeft = [
      {
        text: this.titleLeft,
        value: this.value
      }
    ];

    headerRight = [
      {
        text: this.titleRight,
        value: this.value
      }
    ];

    searchLeft: string = "";
    searchRight: string = "";

    selectedLeft: any[] = [];
    selectedRight: any[] = [];

    get filteredOptions() {
      return this.options.filter(
        o =>
          !this.choosenOptions
            .map(copt => copt[this.value])
            .includes(o[this.value])
      );
    }

    add() {
      console.log("Adding: " + this.selectedRight.length);
      this.selectedRight.forEach(e => {
        this.choosenOptions.push(e);
      });
      this.selectedRight.splice(0);

      this.$emit(this.event, this.choosenOptions);
    }

    remove() {
      for (let i = this.choosenOptions.length - 1; i >= 0; i--) {
        if (this.selectedLeft.indexOf(this.choosenOptions[i]) >= 0) {
          console.log("NEEDS REMOVE: " + i + this.choosenOptions[i]);
          this.choosenOptions.splice(i, 1);
        }
      }

      this.selectedLeft.splice(0);
      this.$emit(this.event, this.choosenOptions);
    }
  }

  export default PickListComponent;
</script>
