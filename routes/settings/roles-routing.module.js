export default {
  path: 'roles',
  component: () => import('~/pages/settings/roles.vue').then(m => m.default || m),
  children: [
    {
      path: '',
      name: 'RolesList',
      props: ({ query }) => {
        if (query.page) {
          return { page: Number(query.page) }
        }
      },
      component: () => import('~/pages/settings/roles/list.vue').then(m => m.default || m)
    },
    {
      path: 'edit/:id?',
      name: 'RolesEdit',
      props: ({ params }) => {
        if (params.id) {
          return { id: Number(params.id) }
        }
      },
      component: () => import('~/pages/settings/roles/edit.vue').then(m => m.default || m)
    }
  ]
}
