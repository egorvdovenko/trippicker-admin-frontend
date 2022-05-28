<template>
  <app-wrapper
    filled
    inner-gap
  >
    <h2 :class="$style.title">
      <template v-if="id">
        Редактирование места
      </template>
      <template v-else>
        Создание места
      </template>
    </h2>
    <a-spin v-if="isGetPlaceRequestPending" />
    <edit-place-form
      v-else
      v-bind="place"
      :tags-list="tagsList"
      @success="onSuccess"
    />
  </app-wrapper>
</template>

<script>
import AppWrapper from '@/components/AppWrapper.vue'
import EditPlaceForm from '@/components/forms/settings/EditPlaceForm.vue'
import { UPDATE_ITEMS } from '@/store/breadcrumb.js'

export default {
  components: {
    AppWrapper,
    EditPlaceForm
  },
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isGetPlaceRequestPending: false,
      place: null,
      tagsList: []
    }
  },
  mounted () {
    this.$store.commit(`breadcrumb/${UPDATE_ITEMS}`, [
      { name: 'Настройки' },
      { name: 'Места', link: '/settings/places' },
      { name: this.id ? 'Редактирование' : 'Создание' }
    ])

    if (this.id) {
      this.getPlace()
    }

    this.getTagsListItems()
  },
  methods: {
    getPlace () {
      this.isGetPlaceRequestPending = true
      this.$api.placesController
        .getPlace(this.id)
        .then(({ data: place }) => {
          this.place = place
        })
        .finally(() => {
          this.isGetPlaceRequestPending = false
        })
    },
    getTagsListItems () {
      this.$api.tagsController
        .getTagsListItems()
        .then(({ data: tagsList }) => {
          this.tagsList = tagsList
        })
    },
    onSuccess (id) {
      if (id) {
        this.$router.push({
          name: 'PlacesEdit',
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
