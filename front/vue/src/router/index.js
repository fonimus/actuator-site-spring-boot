import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home'
import Info from '@/components/pages/Info.vue'
import Health from '@/components/pages/Health.vue'
import Metrics from '@/components/pages/Metrics.vue'
import Env from '@/components/pages/Env.vue'
import Mappings from '@/components/pages/Mappings.vue'
import Beans from '@/components/pages/Beans.vue'
import ConfigProps from '@/components/pages/ConfigProps.vue'
import Loggers from '@/components/pages/Loggers.vue'
import ThreadDump from '@/components/pages/ThreadDump.vue'
import Conditions from '@/components/pages/Conditions.vue'
import HttpTrace from '@/components/pages/HttpTrace.vue'
import ScheduledTasks from '@/components/pages/ScheduledTasks.vue'
import AuditEvents from '@/components/pages/AuditEvents.vue'
import NotFound from '@/components/pages/NotFound.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', name: 'home', component: Home},
    {path: '/info', name: 'info', component: Info},
    {path: '/health', name: 'health', component: Health},
    {path: '/metrics', name: 'metrics', component: Metrics},
    {path: '/env', name: 'env', component: Env},
    {path: '/mappings', name: 'mappings', component: Mappings},
    {path: '/beans', name: 'beans', component: Beans},
    {path: '/configprops', name: 'configprops', component: ConfigProps},
    {path: '/loggers', name: 'loggers', component: Loggers},
    {path: '/threaddump', name: 'threaddump', component: ThreadDump},
    {path: '/conditions', name: 'conditions', component: Conditions},
    {path: '/httptrace', name: 'httptrace', component: HttpTrace},
    {path: '/scheduledtasks', name: 'scheduledtasks', component: ScheduledTasks},
    {path: '/auditevents', name: 'auditevents', component: AuditEvents},
    {path: '/404', name: 'notfound', component: NotFound},
    {path: '*', redirect: '/404'}

  ]
})
