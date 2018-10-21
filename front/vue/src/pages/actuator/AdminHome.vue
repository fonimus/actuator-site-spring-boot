<template>
  <div class="card card-page">
    <div class="card-header d-flex">Admin</div>
    <div class="card-body">
      <ul>
        <li v-for="link of links" v-if="link.path !== ''">
          <router-link :to="{ path: '/admin/' + link.path }">{{link.name}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import ActuatorRoutes from './actuator'

  export default {
    name: 'AdminHome',
    data () {
      return {
        links: ActuatorRoutes[0].children
      }
    }
  }
</script>
