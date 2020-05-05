export default {
  /*
      {
      'title': 'Dashboard',
      'icon': 'mdi-view-dashboard',
      'link': '/',
      'hidden': false,
      'permission': 'SYSTEM_AUTH'
    },
      {
      'title': 'Cages',
      'icon': 'mdi-group',
      'link': '/cages',
      'hidden': false,
      'type': 'group',
      'children': 'cages',
      'permission': 'SYSTEM_AUTH'
    },
   */
  sideMenu: () => [
    {
      'title': 'Locks',
      'icon': 'mdi-lock',
      'link': '/locks',
      'hidden': false,
      'permission': 'SYSTEM_AUTH'
    },
    {
      'title': 'NEW Locks',
      'icon': 'mdi-new-box',
      'link': '/newlocks',
      'hidden': false,
      'permission': 'READ_UNACCEPTED'
    },
    {
      'title': 'Users',
      'icon': 'mdi-account',
      'link': '/users',
      'hidden': false,
      'permission': 'READ_SYSTEM_USER'
    },
    {
      'title': 'Roles',
      'icon': 'mdi-shield-check',
      'link': '/roles',
      'hidden': false,
      'permission': 'READ_SYSTEM_ROLE'
    }
  ],
  actionMenu: () => [
    {
      'title': 'Settings',
      'icon': 'mdi-cog',
      'link': '/settings',
      'hidden': false,
      'permission': 'READ_SYSTEM_CONFIG'
    },
    {
      'title': 'About',
      'icon': 'mdi-information',
      'link': '/about',
      'hidden': false,
      'permission': 'SYSTEM_AUTH'
    }
  ]
}
