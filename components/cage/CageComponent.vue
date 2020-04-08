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
        <RowEditDialog :rows="rows" :cage="cage" :dialog="newRowDialog" @closed="newRowDialog = false"/>
    </div>

</template>
<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import Cage from "~/model/Cage";
    import RowListComponent from "~/components/row/RowList.vue";
    import RowEditDialog from "~/components/Dialogs/RowEditDialog.vue";
    import permissionHide from "~/commons/permissionHide";
    import Row from "~/model/Row";

    @Component({
        components: {
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

        mounted() {
            return this.$axios.get(`/data/row?cage=${this.cage.id}`).then(res => {
                this.rows = res.data.map(r => new Row(r));
            });
        }

        hiddenStyle = permissionHide.hiddenStyle;
    }

    export default CageComponent;
</script>
