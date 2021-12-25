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
    id: {
      type: Number,
      default: null
    },
    name: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      isSubmitRequestPending: false,
      fields: {
        name: null
      },
      rules: {
        name: [
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
          this.id ? this.saveTag() : this.createTag()
        } else {
          this.$message.warning('Некоторые поля заполнены неверно')
          return false
        }
      })
    },
    createTag () {
      this.isSubmitRequestPending = true
      this.$api.tagsController
        .createTag(this.fields)
        .then(({ data: id }) => {
          this.$message.success('Тэг успешно создан')
          this.$emit('success', id)
        })
        .finally(() => {
          this.isSubmitRequestPending = false
        })
    },
    saveTag () {
      this.isSubmitRequestPending = true
      this.$api.tagsController
        .saveTag({
          id: this.id,
          ...this.fields
        })
        .then(() => {
          this.$message.success('Тэг успешно сохранён')
          this.$emit('success')
        })
        .finally(() => {
          this.isSubmitRequestPending = false
        })
    }
  }
}
</script>
