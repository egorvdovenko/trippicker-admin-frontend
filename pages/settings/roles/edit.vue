<template>
  <app-wrapper
    filled
    inner-gap
  >
    <h2 :class="$style.title">
      <template v-if="id">
        Редактирование роли
      </template>
      <template v-else>
        Создание роли
      </template>
    </h2>
    <a-spin v-if="isGetRoleRequestPending" />
    <edit-role-form
      v-else
      v-bind="role"
      :subcategories-list="subcategoriesList"
      :permissions-list="permissionsList"
    />
  </app-wrapper>
</template>

<script>
import AppWrapper from '@/components/AppWrapper.vue'
import EditRoleForm from '@/components/forms/settings/EditRoleForm.vue'
import { UPDATE_ITEMS } from '@/store/breadcrumb.js'

export default {
  components: {
    AppWrapper,
    EditRoleForm
  },
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isGetRoleRequestPending: false,
      role: null,
      subcategoriesList: [],
      permissionsList: []
    }
  },
  mounted () {
    this.$store.commit(`breadcrumb/${UPDATE_ITEMS}`, [
      { name: 'Настройки' },
      { name: 'Роли', link: '/settings/roles' },
      { name: this.id ? 'Редактирование' : 'Создание' }
    ])

    if (this.id) {
      this.getRole()
    }

    this.getSubcategoriesList()
    this.getPermissionsList()
  },
  methods: {
    getRole () {
      this.isGetRoleRequestPending = true
      this.$api.rolesController
        .getRole(this.id)
        .then(({ data: role }) => {
          this.role = role
        })
        .finally(() => {
          this.isGetRoleRequestPending = false
        })
    },
    getSubcategoriesList () {
      this.$api.subcategoriesController
        .getSubcategoriesList()
        .then(({ data: subcategoriesList }) => {
          this.subcategoriesList = subcategoriesList
        })
    },
    getPermissionsList () {
      this.$api.permissionsController
        .getPermissionsList()
        .then(({ data: permissionsList }) => {
          this.permissionsList = permissionsList
        })
    }
  }
}
</script>

<style lang="less" module>
.title {
  margin-bottom: @padding-lg;
}
</style>
