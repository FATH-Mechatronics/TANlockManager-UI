<template>
    <div>
        <v-layout column xs12>
            <v-flex>
                <v-card>
                    <v-card-title class="headline">
                        <v-icon small :color="cage.color">mdi-circle</v-icon>
                        {{cage.name}}
                        <v-spacer/>
                        <v-btn :style="hiddenStyle(this.$user.get(),`WRITE_CAGE`,'cage'+cage.id)" class="warning mr-2"
                               @click.stop="editDialog=true">Edit
                        </v-btn>
                        <v-btn :style="hiddenStyle(this.$user.get(),`WRITE_CAGE`,'cage'+cage.id)"
                               :hidden="rows.length > 0" class="error mr-2"
                               @click.stop="deleteDialog = true">Delete
                        </v-btn>
                        <v-btn :style="hiddenStyle(this.$user.get(),'WRITE_ROW')"
                               @click.stop="newRowDialog=true" class="success">Add Row
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <RowListComponent :cage="cage" :rows="rows"/>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        <CageEditDialog :cage="cage" :dialog="editDialog" @closed="closedEditDialog"/>
        <RowEditDialog :rows="rows" :cage="cage" :dialog="newRowDialog" @closed="closedNewRowDialog"/>
        <v-dialog v-model="deleteDialog" max-width="500px">
            <v-card>
                <v-card-title class="headline">
                    Delete Cage <b>{{cage.name}}</b>
                </v-card-title>
                <v-card-text>
                    <p>Really Delete the Cage?</p>
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
    import {Component, Prop, Vue} from "vue-property-decorator";
    import Cage from "~/model/Cage";
    import RowListComponent from "~/components/row/RowList.vue";
    import RowEditDialog from "~/components/Dialogs/RowEditDialog.vue";
    import permissionHide from "~/commons/permissionHide";
    import Row from "~/model/Row";
    import CageEditDialog from "~/components/Dialogs/CageEditDialog.vue";

    @Component({
        components: {
            CageEditDialog,
            RowListComponent,
            RowEditDialog
        }
    })
    class CageComponent extends Vue {
        @Prop(
            {
                default: new Cage()
            }
        )
        cage: Cage;

        rows: Row[] = [];

        editDialog: boolean = false;
        newRowDialog: boolean = false;
        deleteDialog: boolean = false;

        mounted() {
            return this.$axios.get(`/data/row?cage=${this.cage.id}`).then(res => {
                this.rows = res.data.map(r => new Row(r));
            });
        }

        closedNewRowDialog(newRow: Row) {
            this.newRowDialog = false;
            if (newRow != null) {
                this.rows.push(newRow);
            }
        }

        closedEditDialog(newCage: Cage) {
            this.editDialog = false;
            if (newCage != null) {
                this.cage = newCage;
            }
        }

        deleteCage() {
            this.$axios.delete(`/data/cage/${this.cage.id}`)
                .then((res) => {
                    this.deleteDialog = false;
                    location.href = "/";
                });
        }

        hiddenStyle = permissionHide.hiddenStyle;
    }

    export default CageComponent;
</script>
