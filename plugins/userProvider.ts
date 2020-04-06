import AuthUser from "../model/AuthUser";

const ACCESS_TOKEN = "ACCESS_TOKEN";

class UserProvider {
  get() {
    let token = localStorage.getItem(ACCESS_TOKEN);

    if (token == null) {
      return null;
    }
    let u = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    return new AuthUser(u)
  }
}

import {Plugin} from '@nuxt/types';

declare module '@nuxt/types' {
  interface Context {
    $user: UserProvider
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $user: UserProvider
  }
}

const userProvider: Plugin = (context, inject) => {
  inject('user', new UserProvider());
};

export default userProvider;
