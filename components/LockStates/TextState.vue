<template>
  <div style="color: white">
    <div
      :class="getDoorBG(lock,1)"
      :style="'width:3em; height: 100%; padding: .1em; float:left;' + getDoorStyle(lock,1)"
    >DC1
    </div>
    <div
      :class="getDoorBG(lock,2)"
      :style="'width:3em; height: 100%; padding: .1em; float:right;' + getDoorStyle(lock,2)"
    >DC2
    </div>
    <div :class="getLockBgColor(lock) + ' '+classsuffix" style="padding: .1em;">
      <b>{{toolTipText}}</b>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import TanLock from "../../model/TanLock";

  @Component
  class TextStateComponent extends Vue {
    components = {};
    @Prop({default: () => new TanLock()})
    lock: TanLock;
    @Prop({default: ""})
    classsuffix: string;

    get toolTipText() {
      if (this.lock == null || this.lock.state === "hidden") return "\u00A0";
      return this.lock.state;
    }

    getLockBgColor(lock) {
      if (lock == null) {
        return "";
      }
      switch (lock.state) {
        case "open":
          return "error";
        case "unlocked":
          return "warning";
        case "pin":
          return "primary";
        case "locked":
          return "success";
        case "hidden":
          return "";
      }
      return "error";
    }

    getDoorBG(lock: TanLock, dc: number) {
      if (lock == null) {
        return "transparent";
      }
      if (dc == 1 && !lock.useDoor_1) {
        return "transparent";
      } else if (dc == 2 && !lock.useDoor_2) {
        return "transparent";
      }
      if (dc == 1 && lock.door_1) {
        return "success";
      } else if (dc == 2 && lock.door_2) {
        return "success";
      } else {
        return "error";
      }
    }

    getDoorStyle(lock: TanLock, dc: number) {
      if (lock == null) {
        return "color: rgba(0,0,0,0);";
      }
      if (dc == 1 && !lock.useDoor_1) {
        return "color: rgba(0,0,0,0);";
      } else if (dc == 2 && !lock.useDoor_2) {
        return "color: rgba(0,0,0,0);";
      }
      return "";
    }
  }

  export default TextStateComponent;
</script>
