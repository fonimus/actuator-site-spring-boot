<template>
  <v-card>
    <v-card-actions>

      <v-btn flat>
        <slot name="title"></slot>
      </v-btn>

      <slot name="actions">

        <v-spacer></v-spacer>

        <raw :raw="source"></raw>

        <v-tooltip bottom v-if="refresh">
          <v-btn icon slot="activator" @click="refresh">
            <v-icon>refresh</v-icon>
          </v-btn>
          <span>{{ $t('refresh.data')}}</span>
        </v-tooltip>

        <v-tooltip bottom v-if="url">
          <v-btn icon slot="activator">
            <a class="a-inherit" target="_blank" rel="noopener noreferrer" :href="'..' + url">
              <v-icon>launch</v-icon>
            </a>
          </v-btn>
          <span>{{ $t('go.to')}}</span>
        </v-tooltip>

      </slot>

    </v-card-actions>

    <v-card-text>
      <slot name="content"></slot>
    </v-card-text>

  </v-card>
</template>

<script>
  export default {
    props: {
      source: null,
      refresh: null,
      url: null
    }
  }
</script>

<style scoped>
  .a-inherit {
    color: inherit;
    text-decoration: inherit;
  }
</style>
