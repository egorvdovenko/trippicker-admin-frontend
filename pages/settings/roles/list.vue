<template>
  <app-wrapper
    filled
    inner-gap
  >
    <a-list
      item-layout="horizontal"
      size="large"
      :pagination="pagination"
      :data-source="roles"
      :loading="isGetRolesRequestPending"
      :locale="{
        emptyText: 'Список пуст'
      }"
      bordered
    >
      <a-list-item
        slot="renderItem"
        slot-scope="item"
      >
        <a-list-item-meta
          description="Название"
          :title="item.name"
        />
        <a-dropdown-button
          slot="actions"
          :trigger="['click']"
        >
          <nuxt-link
            :to="{
              name: 'RolesEdit',
              params: { id: item.id }
            }"
          >
            Редактировать
          </nuxt-link>
        </a-dropdown-button>
      </a-list-item>
    </a-list>
  </app-wrapper>
</template>

<script>
import AppWrapper from '@/components/AppWrapper.vue'
import { UPDATE_ITEMS } from '@/store/breadcrumb.js'

export default {
  components: {
    AppWrapper
  },
  props: {
    page: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      pagination: {
        onChange: (page) => {
          this.$router.push({
            name: 'RolesList',
            query: { page }
          })
        },
        defaultCurrent: this.page,
        pageSize: 10
      },
      isGetRolesRequestPending: false,
      roles: []
    }
  },
  watch: {
    '$route.query' () {
      this.getRoles()
    }
  },
  mounted () {
    this.$store.commit(`breadcrumb/${UPDATE_ITEMS}`, [
      { name: 'Настройки' },
      { name: 'Роли' }
    ])

    this.getRoles()
  },
  methods: {
    getRoles (page = this.page) {
      this.isGetRolesRequestPending = true
      this.$api.rolesController
        .getRoles({
          page,
          pageSize: this.pagination.pageSize
        })
        .then(({ data: { totalItems, items } }) => {
          this.pagination.total = totalItems
          this.roles = items
        })
        .finally(() => {
          this.isGetRolesRequestPending = false
        })
    }
  }
}
</script>
