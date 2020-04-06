<template>
  <v-layout column xs12>
    <v-flex>
      <UserList @on-users-selected="onUserSelected" @on-new-user="onNewUser"/>
      <ModifyUser :user="user" @on-edit-user="onUserEdit"/>
      <UserEditDialog :user="user" :dialog="userEditDialog" @closed="userEditDialog = false"/>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue} from 'nuxt-property-decorator'
  import UserList from '../components/Permission/UserList.vue'
  import ModifyUser from '../components/Permission/ModifyUser.vue'
  import UserEditDialog from '../components/Dialogs/UserEditDialog.vue'
  import User from '../model/User'

  @Component({
    components: {
      UserList,
      ModifyUser,
      UserEditDialog
    },
    head: {
      title: "Users"
    }
  })
  class UsersPage extends Vue {
    user: User = null;
    userEditDialog: boolean = false;

    onUserSelected(arg: User[]) {
      if (arg.length === 1) {
        this.user = new User(arg[0]).clone()
      } else {
        this.user = null
      }
    }

    onNewUser() {
      this.user = new User()
      this.userEditDialog = true
    }

    onUserEdit() {
      this.userEditDialog = true
    }
  }

  export default UsersPage
</script>
