import tagsRoutingModule from './settings/tags-routing.module.js'

export default [
  {
    path: '/settings',
    component: () => import('~/pages/settings.vue').then(m => m.default || m),
    children: [
      tagsRoutingModule
    ]
  }
]
