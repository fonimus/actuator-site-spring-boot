import Admin from './Admin.vue'
import AdminHome from './AdminHome.vue'
import info from './Info.vue'
import health from './Health.vue'
import metrics from './Metrics.vue'
import env from './Env.vue'
import mappings from './Mappings.vue'
import beans from './Beans.vue'
import configprops from './ConfigProps.vue'
import loggers from './Loggers.vue'
import threaddump from './Dump.vue'
import conditions from './Conditions.vue'
import httptrace from './Trace.vue'
import scheduledtasks from './ScheduledTasks.vue'
import auditevents from './Audit.vue'

export default [
    {
        path: '/admin',
        component: Admin,
        children: [
            {path: '', name: 'AdminHome', component: AdminHome},
            {path: 'info', name: 'info', component: info},
            {path: 'health', name: 'health', component: health},
            {path: 'metrics', name: 'metrics', component: metrics},
            {path: 'env', name: 'env', component: env},
            {path: 'mappings', name: 'mappings', component: mappings},
            {path: 'beans', name: 'beans', component: beans},
            {path: 'configprops', name: 'configprops', component: configprops},
            {path: 'loggers', name: 'loggers', component: loggers},
            {path: 'threaddump', name: 'threaddump', component: threaddump},
            {path: 'conditions', name: 'conditions', component: conditions},
            {path: 'httptrace', name: 'httptrace', component: httptrace},
            {path: 'scheduledtasks', name: 'scheduledtasks', component: scheduledtasks},
            {path: 'auditevents', name: 'auditevents', component: auditevents}
        ]
    }
]
