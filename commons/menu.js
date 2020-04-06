export default {
  sideMenu: () => [
    {
      'title': 'Dashboard',
      'icon': 'mdi-view-dashboard',
      'link': '/',
      'hidden': false,
      'permission': 'SYSTEM_AUTH'
    },
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
      'title': 'Cages',
      'icon': 'mdi-group',
      'link': '/cages',
      'hidden': false,
      'permission': 'SYSTEM_AUTH'
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
      'title': 'Einstellungen',
      'link': '/settings',
      'hidden': false,
      'permission': 'READ_SYSTEM_CONFIG'
    },
    {
      'title': 'About',
      'link': '/about',
      'hidden': false,
      'permission': 'SYSTEM_AUTH'
    }
  ]
}
