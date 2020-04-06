<template>
  <div>
    <v-layout column xs12>
      <v-flex>
        <v-card>
          <v-card-title class="headline">
            <b>{{cabinet.name}}</b>
            <v-spacer/>
            <v-btn class="mr-2" @click.stop="goUp">Back</v-btn>
            <v-btn :style="hiddenStyle(this.$user.get(),`WRITE_CABINET`,'cabinet_'+cabinet.id)" class="warning"
                   @click.stop="editDialog=true">Edit
            </v-btn>
          </v-card-title>
          <v-card-text>
            <CabinetSideDetailComponent :lock="frontLock"/>
            <CabinetSideDetailComponent :lock="backLock" v-if="backLock != null"/>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <LogViewComponent :cabinet="cabinet"/>
    <CabinetEditDialog :cabinet="cabinet" :dialog="editDialog" @closed="editDialog = false"/>
  </div>
</template>

<script lang="ts">
  import axios from "axios";
  import LogViewComponent from "../../../components/cage/LogView.vue";
  import CabinetComponent from "../../../components/cage/Cabinet.vue";
  import CabinetSideDetailComponent from "../../../components/cage/CabinetSideDetail.vue";
  import CabinetEditDialog from "../../../components/Dialogs/CabinetEditDialog.vue";
  import {Component, Vue} from "vue-property-decorator";
  import Cabinet from "../../../model/Cabinet";
  import TanLock from "../../../model/TanLock";
  import permissionHide from "../../../commons/permissionHide";

  function fetchCabinet(id, context) {
    const con = context;
    return new Promise(resolve => {
      con.app.$axios.get(`/data/cage/0/cabinet/${id}`).then(res => {
        resolve(new Cabinet(res.data));
      });
    });
  }

  function fetchLocks(cabinet, context) {
    const con = context;
    return new Promise(resolve => {
      if (cabinet.backLock != null) {
        axios
          .all([
            con.app.$axios.get(`/data/lock/${cabinet.frontLock}`),
            con.app.$axios.get(`/data/lock/${cabinet.backLock}`)
          ])
          .then(
            axios.spread((front, back) => {
              console.log(front.data, back.data);
              resolve({front: front.data, back: back.data});
            })
          )
          .catch(err => console.error(err));
      } else {
        con.app.$axios.get(`/data/lock/${cabinet.frontLock}`).then(res => {
          resolve({front: res.data, back: null});
        });
      }
    });
  }

  @Component({
    async asyncData(context) {
      let cabinet = await fetchCabinet(context.params.id, context);
      let locks: any = await fetchLocks(cabinet, context);
      return {
        cabinet,
        cabinetId: context.params.id,
        frontLock: locks.front,
        backLock: locks.back
      };
    },
    async mounted() {
    },
    components: {
      CabinetComponent,
      CabinetSideDetailComponent,
      CabinetEditDialog,
      LogViewComponent
    },
    head: {
      title: "Cabinet"
    }
  })
  class CagePage extends Vue {
    cabinetId: any;
    cabinet: Cabinet = new Cabinet();

    frontLock: TanLock = new TanLock();
    backLock: TanLock = new TanLock();

    editDialog: boolean = false;

    hiddenStyle = permissionHide.hiddenStyle;

    goUp() {
      this.$router.back();
    }
  }

  export default CagePage;
</script>
