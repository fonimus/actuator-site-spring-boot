<template>
  <div v-resize="onResize">

    <v-tooltip bottom v-if="raw">
      <v-btn icon slot="activator" @click="dialog = true">
        <v-icon>remove_red_eye</v-icon>
      </v-btn>
      <span>{{ $t('raw.see-details')}}</span>
    </v-tooltip>

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="headline">
          <span v-t="'raw.default.title'"></span>
        </v-card-title>

        <v-card-text>
          <highlight-code v-bind:style="{ maxHeight: (height - 225) + 'px' }" lang="javascript" :code="code"
                          class="highlight-code"></highlight-code>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat="flat" v-clipboard:copy="code" v-clipboard:success="success" v-clipboard:error="error">
            <span v-t="'raw.default.button.copy'"></span>
          </v-btn>
          <v-btn flat="flat" @click="dialog = false">
            <span v-t="'raw.default.button.close'"></span>
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        height: 700
      }
    },
    updated () {
      this.onResize()
    },
    props: {
      size: {
        default: 'modal-lg'
      },
      raw: {
        default: null
      },
      mode: {
        default: 'text/javascript'
      },
      showCopy: {
        default: true
      }
    },
    methods: {
      success () {
        this.$snack.success(this.$t('raw.copy.success'))
      },
      error () {
        this.$snack.error(this.$t('raw.copy.error'))
      },
      show () {
        this.$refs.rawModalRef.show()
        setTimeout(() => this.$refs.editor.refresh(), 1)
      },
      close () {
        this.$refs.rawModalRef.hide()
      },
      onResize () {
        this.height = window.innerHeight
      }
    },
    computed: {
      code () {
        return JSON.stringify(this.raw, null, 2)
      }
    }
  }
</script>

<style scoped>
  .highlight-code {
    overflow-y: auto;
    max-height: 500px;
  }
</style>

