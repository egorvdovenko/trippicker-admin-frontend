<template>
  <app-wrapper
    filled
    inner-gap
  >
    <a-button
      type="primary"
      icon="plus"
      @click="$router.push({ name: 'PlacesEdit' })"
    >
      Добавить
    </a-button>
    <a-divider />
    <a-list
      item-layout="horizontal"
      size="large"
      :pagination="pagination"
      :data-source="places"
      :loading="isGetPlacesRequestPending"
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
              name: 'PlacesEdit',
              params: { id: item.id }
            }"
          >
            Редактировать
          </nuxt-link>
          <a-menu slot="overlay">
            <a-menu-item @click="deletePlace(item)">
              Удалить
            </a-menu-item>
          </a-menu>
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
            name: 'PlacesList',
            query: { page }
          })
        },
        defaultCurrent: this.page,
        pageSize: 10
      },
      isGetPlacesRequestPending: false,
      places: []
    }
  },
  watch: {
    '$route.query' () {
      this.getPlaces()
    }
  },
  mounted () {
    this.$store.commit(`breadcrumb/${UPDATE_ITEMS}`, [
      { name: 'Настройки' },
      { name: 'Места' }
    ])

    this.getPlaces()
  },
  methods: {
    getPlaces (page = this.page) {
      this.isGetPlacesRequestPending = true
      this.$api.placesController
        .getPlaces({
          page,
          pageSize: this.pagination.pageSize
        })
        .then(({ data: { totalItems, items } }) => {
          this.pagination.total = totalItems
          this.places = items
        })
        .finally(() => {
          this.isGetPlacesRequestPending = false
        })
    },
    deletePlace ({ id, name }) {
      this.$confirm({
        title: 'Удаление элемента',
        content: `Вы собираетесь удалить место «${name}». Вы уверены, что хотите это сделать?`,
        okText: 'Да',
        cancelText: 'Нет',
        onOk: () => {
          this.$api.placesController
            .deletePlace(id)
            .then(() => {
              this.$message.success('Место успешно удалено')
              this.getPlaces()
            })
        }
      })
    }
  }
}
</script>
