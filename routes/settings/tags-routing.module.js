export default {
  path: 'tags',
  component: () => import('~/pages/settings/tags.vue').then(m => m.default || m),
  children: [
    {
      path: '',
      name: 'TagsList',
      props: ({ query }) => {
        if (query.page) {
          return { page: Number(query.page) }
        }
      },
      component: () => import('~/pages/settings/tags/list.vue').then(m => m.default || m)
    },
    {
      path: 'edit/:id?',
      name: 'TagsEdit',
      props: ({ params }) => {
        if (params.id) {
          return { id: Number(params.id) }
        }
      },
      component: () => import('~/pages/settings/tags/edit.vue').then(m => m.default || m)
    }
  ]
}
