<template>
  <div column style="text-align: center; display: inline-block; white-space: wrap;">
    <v-layout>
      <v-card class="secondary lighten-2">
        <v-card-title>
          {{lock.name}}
          <v-spacer/>
          <v-btn
            :style="hiddenStyle($user.get(),'WRITE_LOCK','lock_'+lock.id)"
            class="warning"
            @click.stop="editDialog = true"
          >Edit
          </v-btn>
        </v-card-title>
        <v-card-text>
          <ImgState :lock="lock" css="height: 10em;"/>
          <div>
            <WebCam :style="hiddenStyle($user.get(),'LIVE_CAM_LOCK','lock_'+lock.id)" :lock="lock"/>
            <v-btn
              :style="hiddenStyle($user.get(),['PREPAREOPEN_LOCK','INPUT_LOCK'],'lock_'+lock.id,'or')"
              @click.stop="unlockDialog = true"
            >Open
            </v-btn>
            <v-btn
              :style="hiddenStyle($user.get(), 'READ_TAN','lock_'+lock.id)"
              @click.stop="tanDialog = true"
            >TAN
            </v-btn>
          </div>
          <v-layout>
            <DoorContact :lock="lock" style="display:inline-box;" class="mr-3"/>
            <SensorValues :lock="lock" style="display:inline-box;"/>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-layout>
    <UnlockDialog :lock="lock" :dialog="unlockDialog" @closed="unlockDialog = false"/>
    <LockEditDialog :lock="lock" :dialog="editDialog" @closed="editDialog = false"/>
    <TanCreationDialog :lock="lock" :dialog="tanDialog" @closed="tanDialog = false"/>
  </div>
</template>
<script lang="ts">
  import WebCam from "./WebCam.vue";
  import SensorValues from "./SensorValues.vue";
  import DoorContact from "./DoorContact.vue";
  import ImgState from "../LockStates/ImgState.vue";
  import UnlockDialog from "../Dialogs/UnlockDialog.vue";
  import LockEditDialog from "../Dialogs/LockEditDialog.vue";
  import TanCreationDialog from "../Dialogs/TanCreationDialog.vue";
  import {Component, Vue, Prop} from "vue-property-decorator";

  import TanLock from "../../model/TanLock";
  import permissionHide from "../../commons/permissionHide";

  @Component({
    components: {
      WebCam,
      ImgState,
      SensorValues,
      UnlockDialog,
      LockEditDialog,
      DoorContact,
      TanCreationDialog
    },
    async mounted() {
    },
    beforeMount() {
      this.$socketio.on("tanlockEvent", msg => {
        if (msg != undefined && msg.accepted === true) {
          if (this.lock.id == msg.id) {
            this.lock.state = msg.state;
            this.$forceUpdate();
          }
        }
      });
    }
  })
  class CageSideDetailComponent extends Vue {
    @Prop({
      default: () => {
        return new TanLock();
      }
    })
    lock: TanLock;

    unlockDialog = false;
    editDialog = false;
    tanDialog = false;

    hiddenStyle = permissionHide.hiddenStyle;
  }

  export default CageSideDetailComponent;
</script>
