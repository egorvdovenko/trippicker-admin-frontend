import qs from 'qs'
import AccountController from '@/api/controllers/Account.controller.js'
import FilesController from '@/api/controllers/Files.controller.js'
import TagsController from '@/api/controllers/Tags.controller.js'
import PlacesController from '@/api/controllers/Places.controller.js'

export default function ({ $axios, $config }, inject) {
  $axios.defaults.paramsSerializer = params =>
    qs.stringify(params, {
      skipNulls: true,
      allowDots: true,
      encode: true
    })

  const api = {
    accountController: new AccountController($axios, $config),
    filesController: new FilesController($axios, $config),
    tagsController: new TagsController($axios, $config),
    placesController: new PlacesController($axios, $config)
  }

  inject('api', api)
}
