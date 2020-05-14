<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="clickOutside">
    <v-card>
      <v-card-title class="headline">Open {{lock.name}}</v-card-title>

      <v-card-text>
        <v-radio-group v-model="openType" :mandatory="false" row small>
          <v-radio
            label="Prepare Open"
            value="prepareopen"
            :style="hiddenStyle(this.$user.get(), 'PREPAREOPEN_LOCK', 'lock_'+lock.id)"
          ></v-radio>
          <v-radio
            label="Input"
            value="input"
            :style="hiddenStyle(this.$user.get(), 'INPUT_LOCK', 'lock_'+lock.id)"
          ></v-radio>
        </v-radio-group>
        <v-text-field v-model="openReason" label="Reason" />
        <v-text-field v-model="openPin" label="PIN" type="password"/>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="warning" @click.stop="clickOutside()">Cancel</v-btn>
        <v-btn @click.stop="submitOpen()">Unlock</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";

  import TanLock from "../../model/TanLock";
  import permissionHide from "../../commons/permissionHide";

  @Component({
    components: {},
    async mounted() {
      if (
        permissionHide.hasPermission(this.$user.get(), `PREPAREOPEN_LOCK`, "lock_" + this.lock.id)
      ) {
        this.openType = "prepareopen";
      } else if (
        permissionHide.hasPermission(this.$user.get(), `INPUT_LOCK`, "lock_" + this.lock.id)
      ) {
        this.openType = "input";
      }
      this.$axios.get(`/config`).then(res => {
        let settings = [];
        res.data.forEach(element => {
          settings[element.name] = element.value;
        });
        this.defaultType = settings["openDefaultMethod"]
        this.openType = this.defaultType;
        this.defaultPin = settings["openDefaultPin"]
        this.openPin= this.defaultPin;
      });
    },
    beforeMount() {
    }
  })
  class UnlockDialogComponent extends Vue {
    openType = "";
    openPin = "";
    defaultType = "";
    defaultPin = "";
    openReason = "";

    @Prop({
      default: () => {
        return new TanLock();
      }
    })
    lock: TanLock;

    @Prop({
      default: () => {
        return false;
      }
    })
    dialog: boolean;

    submitOpen() {
      this.$axios
        .post(`/data/lock/${this.lock.id}/open`, {
          pin: this.openPin,
          type: this.openType,
          reason: this.openReason
        })
        .then(resp => {
          this.$emit("closed", resp.data);
          this.openType = "prepareopen";
          console.log(resp.data);
        })
        .catch(err => {
        })
        .finally(() => {
          this.openPin = this.defaultPin;
          this.openType = this.defaultType;
          this.openReason = "";
        });
    }

    clickOutside() {
      this.$emit("closed", null);
    }

    hiddenStyle = permissionHide.hiddenStyle;
  }

  export default UnlockDialogComponent;
</script>
