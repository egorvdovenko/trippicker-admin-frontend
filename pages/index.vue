<template>
  <app-wrapper
    filled
    inner-gap
  >
    <p>
      Здравствуйте!<br>
      Вы находитесь на главной странице административной панели сайта «Trippicker».<br>
      Слева от вас находится меню, отражающее структуру административной панели.
    </p>
  </app-wrapper>
</template>

<script>
import AppWrapper from '@/components/AppWrapper.vue'
import { UPDATE_ITEMS } from '@/store/breadcrumb.js'

export default {
  components: {
    AppWrapper
  },
  mounted () {
    this.$store.commit(`breadcrumb/${UPDATE_ITEMS}`, [
      { name: 'Административная панель' }
    ])
  }
}
</script>
