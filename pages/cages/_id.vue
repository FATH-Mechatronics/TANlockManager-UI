<template>
    <v-layout column xs12>
        <v-flex>
            <CageComponent :cage="cage" />
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
    import CageComponent from "../../components/cage/CageComponent.vue"
    import RowList from "../../components/row/RowList.vue";
    import {Component, Vue} from "vue-property-decorator";
    import Cage from "~/model/Cage";

    function fetchCage(id, context) {
        const con = context;
        return new Promise(resolve => {
            con.app.$axios.get(`/data/cage/${id}`)
                .then(res => {
                    resolve(new Cage(res.data))
                });
        })
    }

    @Component({
        components: {
            CageComponent,
            RowList
        },
        head: {
            title: `Cage`
        },
        async asyncData(context) {
            const id = context.params.id;
            let cage = await fetchCage(id, context);
            return {
                cage
            };
        }
    })
    class CagesPage extends Vue {
        cage = new Cage();
    }

    export default CagesPage;
</script>
