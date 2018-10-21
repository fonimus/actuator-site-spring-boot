<template>
  <div class="card card-page">
    <div class="card-header d-flex">Not Found</div>
    <div class="card-body">
      Sorry, the page you requested does not exist
    </div>
  </div>
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
