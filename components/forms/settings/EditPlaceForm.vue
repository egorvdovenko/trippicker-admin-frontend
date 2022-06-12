<template>
  <a-form-model
    ref="form"
    layout="vertical"
    :model="fields"
    :rules="rules"
    v-bind="{
      wrapperCol: { span: 8 },
    }"
    @submit.prevent="onSubmit"
  >
    <a-form-model-item
      has-feedback
      label="Название:"
      prop="name"
    >
      <a-input v-model="fields.name" />
    </a-form-model-item>
    <a-form-model-item
      has-feedback
      label="Описание:"
      prop="description"
    >
      <a-textarea
        v-model="fields.description"
        :rows="8"
      />
    </a-form-model-item>
    <a-form-model-item
      has-feedback
      label="Широта в десятичных градусах:"
      prop="latitude"
    >
      <a-input-number v-model="fields.latitude" />
    </a-form-model-item>
    <a-form-model-item
      has-feedback
      label="Долгота в десятичных градусах:"
      prop="longitude"
    >
      <a-input-number v-model="fields.longitude" />
    </a-form-model-item>
    <a-form-model-item
      has-feedback
      label="Тэги:"
      prop="tags"
    >
      <a-select
        v-if="tagsList.length"
        v-model="fields.tagsIds"
        mode="multiple"
        placeholder="Выберите тэги"
      >
        <a-select-option
          v-for="tagsListItem in tagsList"
          :key="tagsListItem.id"
          :value="tagsListItem.id"
        >
          {{ tagsListItem.text }}
        </a-select-option>
      </a-select>
      <a-alert
        v-else
        message="Список тэгов пуст. Необходимо заполнить соответствующий раздел"
        type="info"
        show-icon
      />
    </a-form-model-item>
    <a-form-model-item
      label="Галерея:"
      prop="images"
    >
      <app-image-cropper
        :auto-crop="true"
        :fixed="true"
        :fixed-number="[3, 2]"
        :full="true"
        :info-true="true"
        output-type="png"
        @crop="onImageCrop"
      >
        <template #upload="{ beforeUpload }">
          <app-image-previewer>
            <template #upload="{ handlePreview }">
              <a-upload
                list-type="picture-card"
                accept="image/jpeg, image/png"
                multiple
                :before-upload="beforeUpload"
                :file-list="fields.images"
                @preview="handlePreview"
                @change="onImageChange"
              >
                <a-icon :type="isUploadImageRequestPending ? 'loading' : 'plus'" />
              </a-upload>
            </template>
          </app-image-previewer>
        </template>
      </app-image-cropper>
      <a-alert
        message="Загрузите изображение в формате jpeg или png."
        type="info"
        show-icon
      />
    </a-form-model-item>
    <a-button
      type="primary"
      html-type="submit"
      :loading="isSubmitRequestPending"
    >
      Сохранить
    </a-button>
  </a-form-model>
</template>

<script>
import AppImageCropper from '@/components/AppImageCropper.vue'
import AppImagePreviewer from '@/components/AppImagePreviewer.vue'
import FileListItem from '@/core/classes/FileListItem.js'

export default {
  components: {
    AppImageCropper,
    AppImagePreviewer
  },
  props: {
    tagsList: {
      type: Array,
      default: () => []
    },
    id: {
      type: Number,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    tagsIds: {
      type: Array,
      default: () => []
    },
    images: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isSubmitRequestPending: false,
      isUploadImageRequestPending: false,
      fields: {
        name: null,
        description: null,
        latitude: null,
        longitude: null,
        tagsIds: [],
        images: []
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Поле является обязательным для заполнения',
            trigger: 'change'
          }
        ],
        description: [
          {
            required: true,
            message: 'Поле является обязательным для заполнения',
            trigger: 'change'
          }
        ],
        latitude: [
          {
            required: true,
            message: 'Поле является обязательным для заполнения',
            trigger: 'change'
          }
        ],
        longitude: [
          {
            required: true,
            message: 'Поле является обязательным для заполнения',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted () {
    this.fillDataFields()
  },
  methods: {
    fillDataFields () {
      for (const key in this.fields) {
        if (this[key] !== null && this[key] !== undefined) {
          this.fields[key] = this[key]
        }
      }

      if (this.fields.images.length) {
        this.fields.images = this.fields.images.map(
          image => new FileListItem(image)
        )
      }
    },
    onSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.id ? this.savePlace() : this.createPlace()
        } else {
          this.$message.warning('Некоторые поля заполнены неверно')
          return false
        }
      })
    },
    createPlace () {
      this.isSubmitRequestPending = true
      this.$api.placesController
        .createPlace({
          ...this.fields
        })
        .then(({ data: id }) => {
          this.$message.success('Место успешно создано')
          this.$emit('success', id)
        })
        .finally(() => {
          this.isSubmitRequestPending = false
        })
    },
    savePlace () {
      this.isSubmitRequestPending = true
      this.$api.placesController
        .savePlace({
          id: this.id,
          ...this.fields
        })
        .then(() => {
          this.$message.success('Место успешно сохранено')
          this.$emit('success')
        })
        .finally(() => {
          this.isSubmitRequestPending = false
        })
    },
    onImageCrop (file) {
      this.isUploadImageRequestPending = true
      this.$api.filesController
        .uploadFile(file)
        .then(({ data: image }) => {
          this.fields.images.push(new FileListItem(image))
        })
        .finally(() => {
          this.isUploadImageRequestPending = false
        })
    },
    onImageChange ({ file }) {
      if (file.status === 'removed') {
        this.fields.images.splice(
          this.fields.images.findIndex(image => image.uid === file.uid),
          1
        )
      }
    }
  }
}
</script>
