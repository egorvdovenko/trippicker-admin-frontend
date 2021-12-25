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
      <a-input
        v-model="fields.name"
        disabled
      />
    </a-form-model-item>
    <a-form-model-item
      has-feedback
      label="Разрешения:"
      prop="permissions"
    >
      <a-select
        v-if="permissionsList.length"
        v-model="fields.permissions"
        mode="multiple"
        :filter-option="filterPermissionsList"
        option-label-prop="label"
        placeholder="Выберите разрешения"
      >
        <a-select-option
          v-for="permissionsListItem in permissionsList"
          :key="permissionsListItem.id"
          :value="permissionsListItem.id"
          :label="permissionsListItem.text"
        >
          {{ permissionsListItem.text }}
        </a-select-option>
      </a-select>
      <a-alert
        v-else
        message="Список разрешений пуст"
        type="info"
        show-icon
      />
    </a-form-model-item>
    <a-form-model-item
      has-feedback
      label="Подкатегории:"
      prop="subcategoriesIds"
    >
      <a-select
        v-if="subcategoriesList.length"
        v-model="fields.subcategoriesIds"
        mode="multiple"
        :filter-option="filterSubcategoriesList"
        option-label-prop="label"
        placeholder="Выберите подкатегории"
      >
        <a-select-option
          v-for="subcategoriesListItem in subcategoriesList"
          :key="subcategoriesListItem.id"
          :value="subcategoriesListItem.id"
          :label="subcategoriesListItem.text"
        >
          <a-row
            type="flex"
            justify="space-between"
          >
            <a-col>{{ subcategoriesListItem.text }}</a-col>
            <a-col>
              <a-badge
                v-if="!subcategoriesListItem.isPublished"
                status="warning"
              >
                <a-tooltip title="Не опубликован">
                  <a-icon type="eye-invisible" />
                </a-tooltip>
              </a-badge>
              <template v-if="subcategoriesListItem.localizationMissing">
                <a-divider type="vertical" />
                <a-badge status="warning">
                  <a-tooltip title="Не указана локализация">
                    <a-icon type="global" />
                  </a-tooltip>
                </a-badge>
              </template>
            </a-col>
          </a-row>
        </a-select-option>
      </a-select>
      <a-alert
        v-else
        message="Список подкатегорий пуст. Необходимо заполнить соответствующий раздел"
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
    permissionsList: {
      type: Array,
      default: () => []
    },
    subcategoriesList: {
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
    subcategoriesIds: {
      type: Array,
      default: () => []
    },
    permissions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isSubmitRequestPending: false,
      fields: {
        name: null,
        subcategoriesIds: [],
        permissions: []
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
          this.id ? this.saveRole() : this.createRole()
        } else {
          this.$message.warning('Некоторые поля заполнены неверно')
          return false
        }
      })
    },
    createRole () {
      this.isSubmitRequestPending = true
      this.$api.rolesController
        .createRole(this.fields)
        .then(({ data: id }) => {
          this.$message.success('Роль успешно создана')
          this.$emit('success', id)
        })
        .finally(() => {
          this.isSubmitRequestPending = false
        })
    },
    saveRole () {
      this.isSubmitRequestPending = true
      this.$api.rolesController
        .saveRole({
          id: this.id,
          ...this.fields
        })
        .then(() => {
          this.$message.success('Роль успешно сохранена')
          this.$emit('success')
        })
        .finally(() => {
          this.isSubmitRequestPending = false
        })
    },
    filterPermissionsList (input, { key }) {
      const item = this.permissionsList.find(
        permissionsListItem => permissionsListItem.id === key
      )

      return item.text.toLowerCase().includes(input.toLowerCase())
    },
    filterSubcategoriesList (input, { key }) {
      const item = this.subcategoriesList.find(
        subcategoriesListItem => subcategoriesListItem.id === key
      )

      return item.text.toLowerCase().includes(input.toLowerCase())
    }
  }
}
</script>
