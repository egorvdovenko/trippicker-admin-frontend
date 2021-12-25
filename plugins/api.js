import qs from 'qs'
import AccountController from '@/api/controllers/Account.controller.js'
import FilesController from '@/api/controllers/Files.controller.js'
import RolesController from '@/api/controllers/Roles.controller.js'

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
    rolesController: new RolesController($axios, $config)
  }

  inject('api', api)
}
