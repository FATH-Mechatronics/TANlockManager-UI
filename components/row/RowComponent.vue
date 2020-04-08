<template>
  <div>
    <v-card :style="gradientStyle">
      <v-card-title class="headline">
        {{row.name}}
        <v-spacer/>
        <v-btn
          @click.stop="editDialog=true"
          class="warning mr-2"
          small
          :style="hiddenStyle(this.$user.get(),'WRITE_ROW','row_'+row.id)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          @click.stop="deleteDialog = true"
          class="error mr-2"
          small
          :hidden="cabinets.length > 0"
          :style="hiddenStyle(this.$user.get(),'WRITE_ROW','row_'+row.id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn
          @click.stop="openAddDialog()"
          small
          :style="hiddenStyle(this.$user.get(),['WRITE_ROW','WRITE_CABINET'],null,'and')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div style="overflow-x:auto;  white-space: nowrap;">
          <CabinetComponent
            v-for="cabinet in orderedCabinets"
            v-bind:key="cabinet.id"
            :cabinet="cabinet"
            :locks="getLocksOfCabinet(cabinet)"
            style="display: inline-block;"
          />
        </div>
      </v-card-text>
    </v-card>
    <CabinetEditDialog
      :cabinet="addCabinet"
      :dialog="addDialog"
      :cage="cage"
      :rows="rows"
      :locks="locks"
      @closed="addDialog = false"
    />
    <RowEditDialog :cage="cage" :row="row" :dialog="editDialog" @closed="editDialog = false"/>
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Delete Row
          <b>{{row.name}}</b>
        </v-card-title>
        <v-card-text>
          <p>Really Delete the Row?</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click.stop="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click.stop="deleteRow()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
  import CabinetComponent from "../cage/Cabinet.vue";
  import CabinetEditDialog from "../Dialogs/CabinetEditDialog.vue";
  import RowEditDialog from "../Dialogs/RowEditDialog.vue";
  import Cabinet from "../../model/Cabinet";
  import {Component, Vue, Prop} from "vue-property-decorator";
  import permissionHide from "../../commons/permissionHide";
  import TanLock from "../../model/TanLock";
  import Row from "~/model/Row";
  import Cage from "~/model/Cage";

  @Component({
    components: {
      CabinetComponent,
      CabinetEditDialog,
      RowEditDialog
    },
    async mounted() {
      return this.$axios
        .get(`/data/cabinet?row=${this.row.id}`)
        .then(res => (this.cabinets = res.data));
    }
  })
  class RowComponent extends Vue {
    @Prop({
      default: new Cage
    })
    cage: Cage;

    @Prop({
      default: () => {
        return {name: "null", id: -1};
      }
    })
    row: Row;

    @Prop({
      default: () => {
        return [];
      }
    })
    rows: Row[];

    @Prop({
      default: () => {
        return [];
      }
    })
    locks: TanLock[];

    cabinets: Cabinet[] = [];

    addDialog = false;
    addCabinet: Cabinet = new Cabinet();

    deleteDialog = false;
    editDialog = false;

    deleteRow() {
      this.$axios
        .delete(`/data/row/${this.row.id}`)
        .then(res => {
          this.rows.splice(this.rows.findIndex(r=>r.id === this.row.id),1);
          this.deleteDialog = false;
        })
        .catch(err => {
          alert("Error Occured: " + err);
        });
    }

    openAddDialog() {
      this.addCabinet = new Cabinet();
      //this.addCabinet.cage = this.cage.id;
      this.addCabinet.name = "NEW Cabinet for " + this.row.name;
      this.addCabinet.row_id = this.row.id;
      this.addDialog = true;
    }

    get orderedCabinets() {
      return this.cabinets.sort((a, b) => {
        if (a.order === b.order)
          return a.name < b.name ? -1 : a.name == b.name ? 0 : 1;
        return a.order - b.order;
      });
    }

    filteredLock(exclude) {
      let filtered = this.locks.filter(l => l.ip !== exclude);
      filtered.push(new TanLock({name: "None", ip: "", id: -1}));
      return filtered;
    }

    hiddenStyle = permissionHide.hiddenStyle;

    get gradientStyle() {
      return `margin: 1em 0; background-image: linear-gradient(${this.row.gradient});`;
    }

    getLocksOfCabinet(cabinet: Cabinet) {
      let lockA = this.locks.find(l => l.id === cabinet.frontLock);
      let lockB = this.locks.find(l => l.id === cabinet.backLock);
      let cabLocks = [lockA];
      if (lockB) {
        cabLocks.push(lockB);
      } else {
        cabLocks.push(null);
      }
      return cabLocks;
    }
  }

  export default RowComponent;
</script>
