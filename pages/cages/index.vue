<template>
    <v-layout column xs12>
        <v-flex>
            <CageEditDialog :dialog="true" @closed="dialogClosed"/>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
    import CageEditDialog from "../../components/Dialogs/CageEditDialog.vue";
    import {Component, Vue} from "vue-property-decorator";
    import Cage from "~/model/Cage";

    @Component({
        components: {
            CageEditDialog
        },
        head: {
            title: "Cages"
        }
    })
    class CagesPage extends Vue {
        dialogClosed(newCage: Cage) {
            if (newCage !== null) {
                location.reload();
            } else {
                this.$router.push("/");
            }
        }
    }

    export default CagesPage;
</script>
