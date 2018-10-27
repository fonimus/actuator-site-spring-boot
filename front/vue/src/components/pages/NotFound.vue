<template>
  <actuator-card>
    <template slot="title">
      <span v-t="'not-found.title'"></span>
    </template>
    <template slot="actions">
      <span></span>
    </template>
    <template slot="content">
      <p>{{$t('not-found.content')}}</p>
    </template>
  </actuator-card>
</template>

<script>
  export default {
    name: 'User',
    data () {
      return {
        loading: false,
        user: {},
        error: null
      }
    },
    created () {
      this.refresh()
    },
    methods: {
      refresh () {
      }
    }
  }
</script>
