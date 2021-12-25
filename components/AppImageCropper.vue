<template>
  <fragment>
    <slot
      name="upload"
      :beforeUpload="beforeUpload"
    />
    <a-modal
      :visible="modalVisible"
      :title="modalTitle"
      :width="modalWidth"
      @cancel="closeModal"
    >
      <div
        :class="$style.cropperContainer"
        :style="{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`
        }"
      >
        <vue-cropper
          ref="cropper"
          :img="imageUrl"
          v-bind="$props"
          v-on="$listeners"
        />
      </div>
      <a-button-group :class="$style.cropperControls">
        <a-button @click="$refs.cropper.rotateLeft()">
          <a-icon type="undo" />
        </a-button>
        <a-button @click="$refs.cropper.rotateRight()">
          <a-icon type="redo" />
        </a-button>
      </a-button-group>
      <template slot="footer">
        <a-button
          type="primary"
          :loading="false"
          @click="() => {
            cropImage()
            closeModal()
          }"
        >
          Сохранить
        </a-button>
      </template>
    </a-modal>
  </fragment>
</template>

<script>
// https://github.com/xyxiao001/vue-cropper/blob/master/english.md
import { VueCropper } from 'vue-cropper'

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  components: {
    VueCropper
  },
  extends: VueCropper,
  props: {
    modalTitle: {
      type: String,
      default: 'Редактирование изображения'
    },
    modalWidth: {
      type: Number,
      default: 610
    },
    containerWidth: {
      type: Number,
      default: 520
    },
    containerHeight: {
      type: Number,
      default: 520
    }
  },
  data () {
    return {
      modalVisible: false,
      imageUrl: null,
      imageName: null,
      scale: null
    }
  },
  methods: {
    beforeUpload (image) {
      this.imageName = image.name

      getBase64(image, (imageUrl) => {
        this.imageUrl = imageUrl
        this.modalVisible = true
      })

      return false
    },
    cropImage () {
      this.$refs.cropper.getCropBlob((blob) => {
        this.$emit('crop', new File([blob], this.imageName))
      })
    },
    closeModal () {
      this.modalVisible = false
    }
  }
}
</script>

<style lang="less" module>
.cropperContainer {
  margin: auto;
  background-color: @normal-color;
}

.cropperControls {
  margin-top: @padding-lg;
  display: flex;
  justify-content: center;
}
</style>
