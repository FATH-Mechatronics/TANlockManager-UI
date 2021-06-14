<template>
  <div>
    <v-card style="margin: 1em 0;">
      <v-card-title class="headline">
        {{title}}
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-text>
        <div hidden>
          <v-btn small>Upgrade Selected</v-btn>
          <v-btn small>Reset Selected</v-btn>
        </div>
        <v-data-table
          :headers="headers"
          :items="locks"
          :search="search"
          :sort-by="sortOrder"
          :custom-sort="customSorter"
          :multi-sort="true"
          item-key="id"
        >
          <!--show-select
          v-model="selected"-->
          <template v-slot:item.name="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon small v-on="on">{{newLockIcon(item)}}</v-icon>
              </template>
              <span>NEW Unaccepted Lock</span>
            </v-tooltip>
            <v-btn :to="lockLink(item)" text small class="text-none">{{item.name}}</v-btn>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon small color="error" v-on="on">{{lockIcon(item)}}</v-icon>
              </template>
              <span>Insecure HTTP</span>
            </v-tooltip>
          </template>
          <template v-slot:item.state="{ item }">
            <LedState v-if="useLedState" :lock="item" :style="showLedStyle"/>
            <ImgState v-if="useImgState" :lock="item" :style="showImgStyle"/>
            <TextState v-if="useTextState" :lock="item" :style="showTextStyle"/>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              small
              class="mr-2"
              :style="hiddenStyle($user.get(),['PREPAREOPEN_LOCK','INPUT_LOCK'],'lock_'+item.id,'or')"
              @click.stop="open(item)"
            >mdi-lock-open
            </v-icon>
            <v-icon small class="mr-2" style="display: none;">mdi-lock-reset</v-icon>
            <v-icon
              small
              class="mr-2"
              :style="hiddenStyle($user.get(),'LOG_LOCK','lock_'+item.id)"
              @click.stop="log(item)"
            >mdi-notebook
            </v-icon>
            <v-icon small @click="refresh(item)">mdi-sync</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <UnlockDialog :lock="openItem" :dialog="openDialog" @closed="openDialog = false"/>
    <!--USE OPEN DIALOG COMPONENT-->
    <v-dialog v-model="logDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Log of {{openItem.name}}</v-card-title>

        <v-card-text>
          <v-data-table
            :headers="logHeaders"
            :items="logItems"
            :sort-desc="true"
            :loading="logLoading"
          >
            <template
              v-slot:item.timestamp="{ item }"
            >{{ new Date(item.timestamp * 1000).toLocaleString() }}
            </template>
          </v-data-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="warning" @click.stop="logDialog=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import LedState from "./LockStates/LedState.vue";
  import ImgState from "./LockStates/ImgState.vue";
  import TextState from "./LockStates/TextState.vue";
  import UnlockDialog from "./Dialogs/UnlockDialog.vue";
  import permissionHide from "../commons/permissionHide";
  import TanLock from "../model/TanLock";

  @Component({
    async mounted() {
      /*return this.$axios
        .get(`/data/lock${this.suffix}`)
        .then(res => {
          this.locks = res.data;
        });*/
    },
    beforeMount() {
      /*this.$socketio.socket.on("tanlockEvent", msg => {
        if (msg != undefined) {
          if (
            (this.suffix === "" && msg.accepted === true) ||
            (this.suffix === "/unknown" && msg.accepted === false)
          ) {
            let l = this.locks.find(obj => obj.ip === msg.ip);
            if (l != undefined) {
              l.name = msg.name;
              l.state = msg.state;
              console.log("Modded Lock");
            } else {
              this.locks.push(msg);
              console.log("New Lock");
            }
            this.$forceUpdate();
          }
        }
      });*/
    },
    components: {
      LedState,
      ImgState,
      TextState,
      UnlockDialog
    }
  })
  class LockList extends Vue {
    @Prop({default: () => []})
    locks: TanLock[];

    @Prop({default: ""})
    suffix: string;

    @Prop({default: "Lock List"})
    title: string;

    search: string = "";
    selected: any[] = [];

    openDialog: boolean = false;
    openItem: any = {name: "undefined"};
    openPin: string = "";
    openType: string = "";

    logDialog: boolean = false;
    logLoading: boolean = true;
    logItems: any[] = [];

    get logHeaders() {
      return [
        {text: "Timestamp", value: "timestamp"},
        {text: "Message", value: "messsage"}
      ];
    }

    sortOrder: string[] = ["state", "name"];
    stateOrder: string[] = [
      "error",
      "offline",
      "open",
      "unlocked",
      "unknown",
      "pin",
      "locked"
    ];

    customSorter(
      locks: TanLock[],
      index: string[],
      isDescending: boolean[]
    ): TanLock[] {
      let sorted = locks.sort((a, b) => {
        for (let key in index) {
          let keyIndex = index[key];
          let comp = this.elementCompare(a, b, keyIndex, (isDescending[key] || false));
          if (comp !== 0) {
            return comp;
          }
        }
        return 0;
      });
      console.log("Sorted", sorted);
      return sorted;
    }

    elementCompare(a, b, index, isDescending = false) {
      switch (index) {
        case "state":
          let aState = a[index];
          if ((a.useDoor_1 && !a.door_1) || (a.useDoor_2 && !a.door_2)) {
            aState = "open";
          }
          let bState = b[index];
          if ((b.useDoor_1 && !b.door_1) || (b.useDoor_2 && !b.door_2)) {
            bState = "open";
          }
          if (isDescending) {
            return (
              this.stateOrder.indexOf(bState) - this.stateOrder.indexOf(aState)
            );
          }
          return (
            this.stateOrder.indexOf(aState) - this.stateOrder.indexOf(bState)
          );
        default:
          if (isDescending) {
            return a[index] < b[index] ? 1 : a[index] == b[index] ? 0 : -1;
          }
          return a[index] > b[index] ? 1 : a[index] == b[index] ? 0 : -1;
      }
    }

    get headers() {
      return [
        {text: "Name", value: "name"},
        {
          text: "State",
          value: "state",
          align: "center"
        },
        {text: "Action", value: "action"}
      ];
    }

    useImgState: boolean = false;
    useLedState: boolean = false;
    useTextState: boolean = true;

    get showLedStyle() {
      if (this.useLedState) {
        return "display: inline-block; vertical-align: top; margin-top: 115px;";
      }
      return "display: none";
    }

    get showImgStyle() {
      if (this.useImgState) {
        return "display: inline-block;";
      }
      return "display: none;";
    }

    get showTextStyle() {
      if (this.useTextState) {
        return "";
      } else {
        return "display: none;";
      }
    }

    lockLink(item) {
      return "/locks/" + item.id;
    }

    lockIcon(item) {
      if (!item.https) {
        return "mdi-lock-open";
      }
    }

    newLockIcon(item) {
      if (!item.accepted) {
        return "mdi-new-box";
      }
    }

    open(item) {
      this.openItem = item;
      this.openDialog = true;
    }

    refresh(item) {
      this.$axios.get(`/data/lock/${item.id}/real`);
    }

    log(item) {
      this.openItem = item;
      this.logLoading = true;
      this.$axios.get(`/data/lock/${item.id}/log`).then(res => {
        this.logItems = res.data;
        this.logLoading = false;
      });
      this.logDialog = true;
    }

    hiddenStyle = permissionHide.hiddenStyle;

    /*addRnd() {
      this.locks[this.locks.length] = {
        ip: Math.random(),
        name: Math.random(),
        state: "open"
      };

      this.locks.push({
        ip: Math.random(),
        name: Math.random(),
        state: "closed"
      });
      console.log(this.locks);
    }*/
  }

  export default LockList;
</script>
