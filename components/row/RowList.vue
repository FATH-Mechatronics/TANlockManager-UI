<template>
    <v-layout column xs12>
        <RowComponent v-for="row in orderedRows" :cage="cage" :row="row" :rows="rows" :locks="locks"
                      v-bind:key="row.id"/>
    </v-layout>
</template>

<script lang="ts">
    import RowComponent from "./RowComponent.vue";
    import {Component, Vue, Prop} from "vue-property-decorator";
    import TanLock from "../../model/TanLock";
    import Cage from "../../model/Cage";
    import Row from "~/model/Row";

    @Component({
        components: {
            RowComponent: RowComponent
        }
    })
    class RowListComponent extends Vue {
        @Prop({
            default: () => {
                return new Cage();
            }
        })
        cage: Cage;

        @Prop({
            default: () => []
        })
        rows: Row[];

        locks: TanLock[] = [];

        mounted() {
            return this.$axios.get(`/data/lock`).then(res => {
                this.locks = res.data.map(l => new TanLock(l));
            });
        }

        get orderedRows() {
            return this.rows.sort((a, b) => {
                if (a.order === b.order)
                    return a.name < b.name ? -1 : a.name == b.name ? 0 : 1;
                return b.order - a.order;
            });
        }
    }

    export default RowListComponent;
</script>
