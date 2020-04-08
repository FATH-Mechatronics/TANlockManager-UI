<template>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="clickOutside()">
        <v-card>
            <v-card-title class="headline">Edit Cabinet {{ cabinet.name }}</v-card-title>
            <v-card-text>
                <v-text-field v-model="cabinetToEdit.name" label="Cabinet Name"/>
                <v-select
                        v-model="cabinetToEdit.row_id"
                        :items="rows"
                        item-value="id"
                        item-text="name"
                        label="Assigned Row"
                />
                <v-text-field v-model="cabinetToEdit.order" label="Order"/>
                <v-divider/>
                <v-select
                        v-model="cabinetToEdit.frontLock"
                        :items="filteredLock(cabinetToEdit.backLock, false)"
                        item-value="id"
                        item-text="name"
                        label="First Lock"
                />
                <v-divider/>
                <v-select
                        v-model="cabinetToEdit.backLock"
                        :items="filteredLock(cabinetToEdit.frontLock)"
                        item-value="id"
                        item-text="name"
                        label="Second Lock"
                />
            </v-card-text>
            <v-card-actions>
                <v-btn :style="hideNew" @click.stop="deleteCabinet()" color="error">Delete</v-btn>
                <v-spacer/>
                <v-btn @click.stop="clickOutside()" color="warning">Cancel</v-btn>
                <v-btn @click.stop="submitCabinet()" color="primary">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from "nuxt-property-decorator";
    import TanLock from "../../model/TanLock";
    import Cabinet from "../../model/Cabinet";
    import Row from "~/model/Row";

    const dummyLock = new TanLock({name: "None", id: -1});

    @Component
    class CabinetEditDialogComponent extends Vue {
        @Prop({default: () => new Cabinet()})
        cabinet: Cabinet;

        @Prop({
            default: () => false
        })
        dialog: boolean;

        @Prop({
            default: () => []
        })
        rows: Row[];

        @Prop({
            default: () => []
        })
        locks: TanLock[];

        cabinetToEdit: Cabinet = new Cabinet();

        @Watch('dialog')
        onDialogChange(value: boolean, oldValue: boolean) {
            this.cabinetToEdit = new Cabinet(this.cabinet);
        }

        filteredLock(exclude, addDummy = true) {
            let filtered = this.locks.filter(l => l.id !== exclude);
            if (addDummy) {
                filtered.push(dummyLock);
            }
            return filtered;
        }

        clickOutside(cabinet: Cabinet | null = null) {
            this.$emit("closed", cabinet);
        }

        submitCabinet() {
            console.log(this.cabinetToEdit);
            if (this.cabinetToEdit.backLock == -1) {
                this.cabinetToEdit.backLock = null;
            }
            if (this.cabinetToEdit.frontLock < 0) {
                alert("First Lock can't be NULL");
                return;
            }
            if (this.cabinetToEdit.id == null || this.cabinetToEdit.id < 0) {
                this.$axios
                    .post(
                        `/data/cabinet`,
                        this.cabinetToEdit
                    )
                    .then(res => {
                        this.clickOutside(new Cabinet(res.data));
                        //location.reload();
                    })
                    .catch(err => {
                        alert("Error Occured: " + err);
                    });
            } else {
                this.$axios
                    .put(
                        `/data/cabinet/${this.cabinetToEdit.id}`,
                        this.cabinetToEdit
                    )
                    .then(res => {
                        this.clickOutside(new Cabinet(res.data));
                        //location.reload();
                    })
                    .catch(err => {
                        alert("Error Occured: " + err);
                    });
            }
        }

        deleteCabinet() {
            if (this.cabinetToEdit.id != null || this.cabinetToEdit.id >= 0) {
                this.$axios
                    .delete(
                        `/data/cabinet/${this.cabinetToEdit.id}`
                    )
                    .then(res => {
                        this.clickOutside();
                        this.$router.back();
                    });
            } else {
                alert("Cannot Delete New Cabinet!");
                this.clickOutside();
            }
        }

        get hideNew() {
            if (this.cabinetToEdit.id == null || this.cabinetToEdit.id < 0) return "display:hidden";
            return "";
        }
    }

    export default CabinetEditDialogComponent;
</script>
