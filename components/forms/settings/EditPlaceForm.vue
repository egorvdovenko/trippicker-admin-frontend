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
export default {
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
    tagsIds: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isSubmitRequestPending: false,
      fields: {
        name: null,
        description: null,
        tagsIds: []
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
        .createPlace(this.fields)
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
    }
  }
}
</script>
