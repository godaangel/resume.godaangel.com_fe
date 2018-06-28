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

const AddDataTpl = resolve => {
  require.ensure(['../views/data/add.vue'], () => {
    resolve(require('../views/data/add.vue'))
  })
}

const ListDataTpl = resolve => {
  require.ensure(['../views/data/list.vue'], () => {
    resolve(require('../views/data/list.vue'))
  })
}

// const BlankTpl = resolve => {
//   require.ensure(['../views/blank.vue'], () => {
//     resolve(require('../views/blank.vue'))
//   })
// }

export default new Router({
  routes: [{
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
  }, {
    path: '/resume/edit/:id',
    name: 'resume-edit',
    meta: {
      breadcrumb: ['简历管理', '修改']
    },
    component: AddResumeTpl
  }, {
    path: '/data/list',
    name: 'data-list',
    meta: {
      breadcrumb: ['资料管理', '资料列表']
    },
    component: ListDataTpl
  }, {
    path: '/data/add',
    name: 'data-add',
    meta: {
      breadcrumb: ['资料管理', '新增资料']
    },
    component: AddDataTpl
  }, {
    path: '/data/edit/:id',
    name: 'data-edit',
    meta: {
      breadcrumb: ['资料管理', '修改资料']
    },
    component: AddDataTpl
  }]
})