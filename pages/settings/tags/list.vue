<template>
  <app-wrapper
    filled
    inner-gap
  >
    <a-button
      type="primary"
      icon="plus"
      @click="$router.push({ name: 'TagsEdit' })"
    >
      Добавить
    </a-button>
    <a-divider />
    <a-list
      item-layout="horizontal"
      size="large"
      :pagination="pagination"
      :data-source="tags"
      :loading="isGetTagsRequestPending"
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
              name: 'TagsEdit',
              params: { id: item.id }
            }"
          >
            Редактировать
          </nuxt-link>
          <a-menu slot="overlay">
            <a-menu-item @click="deleteTag(item)">
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
            name: 'TagsList',
            query: { page }
          })
        },
        defaultCurrent: this.page,
        pageSize: 10
      },
      isGetTagsRequestPending: false,
      tags: []
    }
  },
  watch: {
    '$route.query' () {
      this.getTagsList()
    }
  },
  mounted () {
    this.$store.commit(`breadcrumb/${UPDATE_ITEMS}`, [
      { name: 'Настройки' },
      { name: 'Тэги' }
    ])

    this.getTagsList()
  },
  methods: {
    getTagsList (page = this.page) {
      this.isGetTagsRequestPending = true
      this.$api.tagsController
        .getTagsList({
          page,
          pageSize: this.pagination.pageSize
        })
        .then(({ data: { totalItems, items } }) => {
          this.pagination.total = totalItems
          this.tags = items
        })
        .finally(() => {
          this.isGetTagsRequestPending = false
        })
    },
    deleteTag ({ id, name }) {
      this.$confirm({
        title: 'Удаление элемента',
        content: `Вы собираетесь удалить тэг «${name}». Вы уверены, что хотите это сделать?`,
        okText: 'Да',
        cancelText: 'Нет',
        onOk: () => {
          this.$api.tagsController
            .deleteTag(id)
            .then(() => {
              this.$message.success('Тэг успешно удалён')
              this.getTagsList()
            })
        }
      })
    }
  }
}
</script>
