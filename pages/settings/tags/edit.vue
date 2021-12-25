<template>
  <app-wrapper
    filled
    inner-gap
  >
    <h2 :class="$style.title">
      <template v-if="id">
        Редактирование тэга
      </template>
      <template v-else>
        Создание тэга
      </template>
    </h2>
    <a-spin v-if="isGetTagRequestPending" />
    <edit-tag-form
      v-else
      v-bind="tag"
      @success="onSuccess"
    />
  </app-wrapper>
</template>

<script>
import AppWrapper from '@/components/AppWrapper.vue'
import EditTagForm from '@/components/forms/settings/EditTagForm.vue'
import { UPDATE_ITEMS } from '@/store/breadcrumb.js'

export default {
  components: {
    AppWrapper,
    EditTagForm
  },
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isGetTagRequestPending: false,
      tag: null
    }
  },
  mounted () {
    this.$store.commit(`breadcrumb/${UPDATE_ITEMS}`, [
      { name: 'Настройки' },
      { name: 'Тэги', link: '/settings/tags' },
      { name: this.id ? 'Редактирование' : 'Создание' }
    ])

    if (this.id) {
      this.getTag()
    }
  },
  methods: {
    getTag () {
      this.isGetTagRequestPending = true
      this.$api.tagsController
        .getTag(this.id)
        .then(({ data: tag }) => {
          this.tag = tag
        })
        .finally(() => {
          this.isGetTagRequestPending = false
        })
    },
    onSuccess (id) {
      if (id) {
        this.$router.push({
          name: 'TagsEdit',
          params: { id }
        })
      }
    }
  }
}
</script>

<style lang="less" module>
.title {
  margin-bottom: @padding-lg;
}
</style>
