import BaseController from '@/api/controllers/Base.controller.js'

class RolesController extends BaseController {
  static prefix = '/api/Roles';

  getRoles (payload) {
    return this.axios({
      method: 'get',
      url: `${RolesController.prefix}`,
      params: payload
    })
  }

  getRolesList () {
    return this.axios({
      method: 'get',
      url: `${RolesController.prefix}/listItems`
    })
  }

  getRole (id) {
    return this.axios({
      method: 'get',
      url: `${RolesController.prefix}/${id}`
    })
  }

  saveRole (payload) {
    const { id } = payload

    return this.axios({
      method: 'put',
      data: payload,
      url: `${RolesController.prefix}/${id}`
    })
  }
}

export default RolesController
