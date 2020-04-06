<template>
  <div>
    <v-card :style="gradientStyle">
      <v-card-title class="headline">
        {{cage.name}}
        <v-spacer/>
        <v-btn
          @click.stop="editDialog=true"
          class="warning mr-2"
          small
          :style="hiddenStyle(this.$user.get(),'WRITE_CAGE','cage_'+cage.id)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          @click.stop="deleteDialog = true"
          class="error mr-2"
          small
          :hidden="cabinets.length > 0"
          :style="hiddenStyle(this.$user.get(),'WRITE_CAGE','cage_'+cage.id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn
          @click.stop="openAddDialog()"
          small
          :style="hiddenStyle(this.$user.get(),['WRITE_CAGE','WRITE_CABINET'],null,'and')"
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
      :cages="cages"
      :locks="locks"
      @closed="addDialog = false"
    />
    <CageEditDialog :cage="cage" :dialog="editDialog" @closed="editDialog = false"/>
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Delete Row
          <b>{{cage.name}}</b>
        </v-card-title>
        <v-card-text>
          <p>Really Delete the Row?</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click.stop="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click.stop="deleteCage()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
  import CabinetComponent from "./Cabinet.vue";
  import CabinetEditDialog from "../Dialogs/CabinetEditDialog.vue";
  import CageEditDialog from "../Dialogs/CageEditDialog.vue";
  import Cabinet from "../../model/Cabinet";
  import {Component, Vue, Prop} from "vue-property-decorator";
  import permissionHide from "../../commons/permissionHide";
  import TanLock from "../../model/TanLock";

  @Component({
    components: {
      CabinetComponent,
      CabinetEditDialog,
      CageEditDialog
    },
    async mounted() {
      return this.$axios
        .get(`/data/cage/${this.cage.id}/cabinet`)
        .then(res => (this.cabinets = res.data));
    }
  })
  class CageComponent extends Vue {
    @Prop({
      default: () => {
        return {name: "null", id: -1};
      }
    })
    cage: any;

    @Prop({
      default: () => {
        return [];
      }
    })
    locks: TanLock[];

    @Prop({
      default: () => {
        return [];
      }
    })
    cages: any[];

    cabinets: Cabinet[] = [];

    addDialog = false;
    addCabinet: Cabinet = new Cabinet();

    deleteDialog = false;
    editDialog = false;

    deleteCage() {
      this.$axios
        .delete(`/data/cage/${this.cage.id}`)
        .then(res => {
          location.reload();
        })
        .catch(err => {
          alert("Error Occured: " + err);
        });
    }

    openAddDialog() {
      this.addCabinet = new Cabinet();
      //this.addCabinet.cage = this.cage.id;
      this.addCabinet.name = "New Cabinet for " + this.cage.name;
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
      return `margin: 1em 0; background-image: linear-gradient(${this.cage.gradient});`;
    }

    getLocksOfCabinet(cabinet: Cabinet) {
      let lockA = this.locks.find(l => l.id === cabinet.frontLock);
      let lockB = this.locks.find(l => l.id === cabinet.backLock);
      let locks = [lockA];
      if (lockB) {
        locks.push(lockB);
      } else {
        locks.push(null);
      }
      return locks;
    }
  }

  export default CageComponent;
</script>
