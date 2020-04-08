<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="clickOutside()">
    <v-card :style="gradientStyle">
      <v-card-title class="headline">Edit Row "{{row.name}}"</v-card-title>
      <v-card-text>
        <span>Added to <p><v-icon small :color="cage.color">mdi-circle</v-icon> {{cage.name}}</p></span>
        <v-divider/>
        <v-text-field label="Name" v-model="editRow.name"/>
        <v-divider/>
        Background:
        <v-radio-group v-model="editRow.gradient" row>
          <v-radio label="Red to Blue" value="#ff000066, #00000000, #00000000, #0000ff66"></v-radio>
          <v-radio label="Blue to Red" value="#0000ff66, #00000000, #00000000, #ff000066"></v-radio>
          <v-radio label="None" value="transparent"/>
        </v-radio-group>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="clickOutside()">Cancel</v-btn>
        <v-spacer />
        <v-btn @click="saveRow()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Watch} from "vue-property-decorator";
  import Row from "../../model/Row";
  import Cage from "~/model/Cage";

  @Component({})
  class RowEditDialogComponent extends Vue {
    @Prop({
      default: false
    })
    dialog: boolean;

    @Prop({
      default: () => new Row()
    })
    row: Row;

    @Prop({
      default: () => new Cage()
    })
    cage: Cage;

    editRow: Row = new Row(this.row);

    @Watch('dialog')
    onDialogChange(val: boolean, oldValue: boolean){
      this.editRow = new Row(this.row);
      this.editRow.cage_id = this.cage.id;
    }

    @Watch('row')
    onRowChange(val: Row, oldVal: Row){
      this.editRow = new Row(val);
    }

    @Watch('cage')
    onCageChange(val: Cage, oldVal: Cage){
      this.editRow.cage_id = val.id;
    }

    saveRow() {
      if (this.editRow.name.length > 0) {
        if (this.editRow.id !== -1) {
          this.$axios
                  .put(`/data/row/${this.row.id}`, this.editRow)
                  .then((res) => {
                    const newRow = new Row(res.data);
                    this.clickOutside(newRow);
                  })
                  .catch(message => alert("Some Error Occured"));
        }else{
          this.$axios
          .post(`/data/row`, this.editRow)
          .then((res) => {
            const newRow = new Row(res.data);
            this.clickOutside(newRow);
          })
          .catch(err => alert("Some Error Occured"));
        }
      } else {
        alert("You are missing inputs");
      }
    }

    get gradientStyle() {
      if (this.editRow.gradient !== "transparent") {
        return `background-image: linear-gradient(${this.editRow.gradient});`;
      }
      return "";
    }

    set gradientStyle(value){
      console.log("NewGrad", value);
    }

    clickOutside(row: Row|null = null) {
      this.$emit("closed", row);
    }
  }

  export default RowEditDialogComponent;
</script>
