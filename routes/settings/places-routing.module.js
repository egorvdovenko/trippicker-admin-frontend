export default {
  path: 'places',
  component: () => import('~/pages/settings/places.vue').then(m => m.default || m),
  children: [
    {
      path: '',
      name: 'PlacesList',
      props: ({ query }) => {
        if (query.page) {
          return { page: Number(query.page) }
        }
      },
      component: () => import('~/pages/settings/places/list.vue').then(m => m.default || m)
    },
    {
      path: 'edit/:id?',
      name: 'PlacesEdit',
      props: ({ params }) => {
        if (params.id) {
          return { id: Number(params.id) }
        }
      },
      component: () => import('~/pages/settings/places/edit.vue').then(m => m.default || m)
    }
  ]
}
