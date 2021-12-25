import BaseController from '@/api/controllers/Base.controller.js'

class TagsController extends BaseController {
  static prefix = '/api/Tags';

  getTags (payload) {
    return this.axios({
      method: 'get',
      url: `${TagsController.prefix}`,
      params: payload
    })
  }

  getTagsList () {
    return this.axios({
      method: 'get',
      url: `${TagsController.prefix}/listItems`
    })
  }

  getTag (id) {
    return this.axios({
      method: 'get',
      url: `${TagsController.prefix}/${id}`
    })
  }

  createTag (payload) {
    return this.axios({
      method: 'post',
      data: payload,
      url: `${TagsController.prefix}`
    })
  }

  saveTag (payload) {
    const { id } = payload

    return this.axios({
      method: 'put',
      data: payload,
      url: `${TagsController.prefix}/${id}`
    })
  }

  deleteTag (id) {
    return this.axios({
      method: 'delete',
      url: `${TagsController.prefix}/${id}`
    })
  }
}

export default TagsController
