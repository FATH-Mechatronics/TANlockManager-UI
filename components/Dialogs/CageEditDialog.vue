<template>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="clickOutside()">
        <v-card>
            <v-card-title class="headline">New Cage</v-card-title>
            <v-card-text>
                <v-text-field label="Name" v-model="editCage.name"/>
                <v-divider/>
                Color:
                <v-color-picker :hide-inputs="true" :hide-canvas="true" v-model="editCage.color" :show-swatches="true"
                                width="100%"></v-color-picker>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="clickOutside()">Cancel</v-btn>
                <v-spacer/>
                <v-btn @click="saveCage()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import permissionHide from "../../commons/permissionHide";
    import Row from "~/model/Row";
    import Cage from "~/model/Cage";

    @Component
    class CageEditDialog extends Vue {
        @Prop({
            default: false
        })
        dialog: boolean;

        @Prop({
            default: () => new Cage()
        })
        cage: Cage;

        editCage: Cage = new Cage(this.cage);

        @Watch('cage')
        onCageChange(val: Cage, oldVal: Cage) {
            this.editCage = new Cage(val);
        }

        saveCage() {
            if (this.editCage.name.length > 0) {
                if (this.editCage.id >= 0) {
                    this.$axios
                        .put(`/data/cage/${this.cage.id}`, this.editCage)
                        .then((res) => {
                            const newCage = new Cage(res.data);
                            this.clickOutside(newCage);
                        })
                        .catch(message => alert("Some Error Occured"));
                } else {
                    this.$axios
                        .post(`/data/cage`, this.editCage)
                        .then((res) => {
                            const newCage = new Cage(res.data);
                            this.clickOutside(newCage);
                        })
                        .catch(message => alert("Some Error Occured"));
                }
            } else {
                alert("You are missing inputs");
            }
        }

        clickOutside(cage: Cage | null = null) {
            this.$emit("closed", cage);
        }
    }

    export default CageEditDialog;
</script>
