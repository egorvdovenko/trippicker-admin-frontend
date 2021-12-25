import BaseController from '@/api/controllers/Base.controller.js'

class PlacesController extends BaseController {
  static prefix = '/api/Places';

  getPlaces (payload) {
    return this.axios({
      method: 'get',
      url: `${PlacesController.prefix}`,
      params: payload
    })
  }

  getPlacesList () {
    return this.axios({
      method: 'get',
      url: `${PlacesController.prefix}/listItems`
    })
  }

  getPlace (id) {
    return this.axios({
      method: 'get',
      url: `${PlacesController.prefix}/${id}`
    })
  }

  createPlace (payload) {
    return this.axios({
      method: 'post',
      data: payload,
      url: `${PlacesController.prefix}`
    })
  }

  savePlace (payload) {
    const { id } = payload

    return this.axios({
      method: 'put',
      data: payload,
      url: `${PlacesController.prefix}/${id}`
    })
  }

  deletePlace (id) {
    return this.axios({
      method: 'delete',
      url: `${PlacesController.prefix}/${id}`
    })
  }
}

export default PlacesController
