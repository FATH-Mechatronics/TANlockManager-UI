<template>
    <v-btn @click.stop="openWindow()" :disabled="disabled()">Live Cam</v-btn>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";
    import TanLock from "../../model/TanLock";

    @Component({
        components: {},
        async mounted() {
            this.$axios
                .get(`/data/lock/${this.lock.id}/camera/url`)
                .then(res => (this.camUrl = res.data))
                .catch(err => (this.camUrl = null));
        }
    })
    class WebCamComponent extends Vue {
        @Prop({
            default: () => {
                id: -1;
            }
        })
        lock: TanLock;
        camUrl = "";

        openWindow() {
            if (this.camUrl != null) {
                window.open(this.camUrl);
            }
        }

        disabled(): boolean {
            if (
                (this.lock.useDoor_1 && this.lock.door_1 == false) ||
                (this.lock.useDoor_2 && this.lock.door_2 == false)
            ) {
                return (
                    this.camUrl === "" || this.camUrl === undefined || this.camUrl === null
                );
            } else {
                return true;
            }
        }
    }

    export default WebCamComponent;
</script>
