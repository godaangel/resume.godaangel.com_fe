import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const IndexTpl = resolve => {
    require.ensure(['../views/resume/index.vue'], () => {
        resolve(require('../views/resume/index.vue'))
    })
}

const AddResumeTpl = resolve => {
    require.ensure(['../views/resume/add.vue'], () => {
        resolve(require('../views/resume/add.vue'))
    })
}

const ListResumeTpl = resolve => {
    require.ensure(['../views/resume/list.vue'], () => {
        resolve(require('../views/resume/list.vue'))
    })
}

export default new Router({
  routes: [
  	{
      path: '/',
      name: 'index',
      component: IndexTpl
    }, {
      path: '/resume/add',
      name: 'resume-add',
      meta: {
      	breadcrumb: ['简历管理', '新增']
      },
      component: AddResumeTpl
    }, {
      path: '/resume/list',
      name: 'resume-list',
      meta: {
      	breadcrumb: ['简历管理', '查看列表']
      },
      component: ListResumeTpl
    }
  ]
})
