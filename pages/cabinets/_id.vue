<template>
    <div>
        <v-layout column xs12>
            <v-flex>
                <v-card>
                    <v-card-title class="headline">
                        <b>{{cabinet.name}}</b>
                        <v-spacer/>
                        <v-btn class="mr-2" @click.stop="goUp">Back</v-btn>
                        <v-btn :style="hiddenStyle(this.$user.get(),`WRITE_CABINET`,'cabinet_'+cabinet.id)"
                               class="warning"
                               @click.stop="editDialog = true">Edit
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
        <CabinetEditDialog :cabinet="cabinet" :rows="rows" :locks="locks" :dialog="editDialog" @closed="closedEditDialog"/>
    </div>
</template>

<script lang="ts">
    import axios from "axios";
    import LogViewComponent from "../../components/cage/LogView.vue";
    import CabinetComponent from "../../components/cage/Cabinet.vue";
    import CabinetSideDetailComponent from "../../components/cage/CabinetSideDetail.vue";
    import CabinetEditDialog from "../../components/Dialogs/CabinetEditDialog.vue";
    import {Component, Vue} from "vue-property-decorator";
    import Cabinet from "../../model/Cabinet";
    import TanLock from "../../model/TanLock";
    import permissionHide from "../../commons/permissionHide";
    import Row from "~/model/Row";

    function fetchCabinet(id, context) {
        const con = context;
        return new Promise<Cabinet>(resolve => {
            con.app.$axios.get(`/data/cabinet/${id}`).then(res => {
                resolve(new Cabinet(res.data));
            });
        });
    }

    function fetchRow(cabinet: Cabinet, context) {
        const con = context;
        return new Promise<Row>(resolve => {
            con.app.$axios.get(`/data/row/${cabinet.row_id}`).then(res => {
                resolve(new Row(res.data));
            })
        })
    }

    function fetchRows(row: Row, context) {
        const con = context;
        return new Promise<Row[]>(resolve => {
            con.app.$axios.get(`/data/row?cage=${row.cage_id}`).then(res => {
                resolve(res.data.map(r => new Row(r)));
            })
        })
    }

    function fetchCabinetLocks(cabinet: Cabinet, context) {
        const con = context;
        return new Promise<{ front: TanLock, back: TanLock | null }>(resolve => {
            if (cabinet.backLock != null) {
                axios
                    .all([
                        con.app.$axios.get(`/data/lock/${cabinet.frontLock}`),
                        con.app.$axios.get(`/data/lock/${cabinet.backLock}`)
                    ])
                    .then(
                        axios.spread((front, back) => {
                            console.log(front.data, back.data);
                            resolve({front: new TanLock(front.data), back: new TanLock(back.data)});
                        })
                    )
                    .catch(err => console.error(err));
            } else {
                con.app.$axios.get(`/data/lock/${cabinet.frontLock}`).then(res => {
                    resolve({front: new TanLock(res.data), back: null});
                });
            }
        });
    }

    function fetchLocks(context) {
        const con = context;
        return new Promise<TanLock[]>(resolve => {
            con.app.$axios.get("/data/lock")
                .then(res => {
                    resolve(res.data.map(l => new TanLock(l)));
                });
        })
    }

    @Component({
        async asyncData(context) {
            let cabinet: Cabinet = await fetchCabinet(context.params.id, context);
            let row: Row = await fetchRow(cabinet, context);
            let rows: Row[] = await fetchRows(row, context);
            let cabinetLocks: { front: TanLock, back: TanLock | null } = await fetchCabinetLocks(cabinet, context);
            let locks: TanLock[] = await fetchLocks(context);
            return {
                cabinet,
                row,
                rows,
                locks,
                frontLock: cabinetLocks.front,
                backLock: cabinetLocks.back
            };
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
        cabinet: Cabinet;
        row: Row;
        rows: Row[];
        locks: TanLock[];
        frontLock: TanLock;
        backLock: TanLock;

        editDialog: boolean = false;

        closedEditDialog(newCabinet: Cabinet){
            this.editDialog = false;
            if(newCabinet !== null) {
                console.log(newCabinet);
                this.cabinet = newCabinet;
                this.frontLock = this.locks.find(l=>l.id === newCabinet.frontLock);
                this.backLock = this.locks.find(l=>l.id === newCabinet.backLock) || null;
            }
        }

        hiddenStyle = permissionHide.hiddenStyle;

        goUp() {
            this.$router.back();
        }
    }

    export default CagePage;
</script>
