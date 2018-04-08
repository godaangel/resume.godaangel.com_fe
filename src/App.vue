<template>
  <div id="app">
    <div class="layout">
      <Layout :style="{minHeight: '100vh'}">
        <!-- <wau-header :header="wau_header"></wau-header> -->
        <Header v-if="true">
            <Menu mode="horizontal" theme="dark" active-name="1">
                <div class="layout-logo"></div>
                <div class="layout-nav">
                    <MenuItem name="1">
                        <Icon type="ios-navigate"></Icon>
                        Item 1
                    </MenuItem>
                    <MenuItem name="2">
                        <Icon type="ios-keypad"></Icon>
                        Item 2
                    </MenuItem>
                    <MenuItem name="3">
                        <Icon type="ios-analytics"></Icon>
                        Item 3
                    </MenuItem>
                    <MenuItem name="4">
                        <Icon type="ios-paper"></Icon>
                        Item 4
                    </MenuItem>
                </div>
            </Menu>
        </Header>
        <Layout>
            <Sider hide-trigger :style="{background: '#fff'}">
                <Menu :active-name="activeSidebar" theme="light" width="auto" :open-names="openSidebar" @on-select="changeMenu">
                    <Submenu name="resume">
                        <template slot="title">
                            <Icon type="ios-navigate"></Icon>
                            简历管理
                        </template>
                        <MenuItem name="resume-add">新增</MenuItem>
                        <MenuItem name="resume-list">查看列表</MenuItem>
                    </Submenu>
                    <Submenu name="2">
                        <template slot="title">
                            <Icon type="ios-keypad"></Icon>
                            系统设置
                        </template>
                        <MenuItem name="2-1">Option 1</MenuItem>
                        <MenuItem name="2-2">Option 2</MenuItem>
                    </Submenu>
                    <!-- <Submenu name="3">
                        <template slot="title">
                            <Icon type="ios-analytics"></Icon>
                            Item 3
                        </template>
                        <MenuItem name="3-1">Option 1</MenuItem>
                        <MenuItem name="3-2">Option 2</MenuItem>
                    </Submenu> -->
                </Menu>
            </Sider>
            <Layout :style="{padding: '0 24px 0px'}">
                <Breadcrumb :style="{margin: '24px 0'}" v-if="breadcrumb.length!=0">
                    <BreadcrumbItem :key="item" v-for="item in breadcrumb">{{item}}</BreadcrumbItem>
                    <!-- <BreadcrumbItem>Components</BreadcrumbItem> -->
                    <!-- <BreadcrumbItem>Layout</BreadcrumbItem> -->
                </Breadcrumb>
                <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                    <router-view class="view"></router-view>
                </Content>
            </Layout>
        </Layout>
        <Footer class="layout-footer-center" :style="{textAlign: 'center'}">
          京ICP备17073700号-1
          <br>
          Copyright &copy; 2018 Godaangel. All Rights Reserved
        </Footer>
      </Layout>
    </div>
    <!-- <router-view class="view"></router-view> -->
  </div>
</template>

<script>
// import router from './router/index.js'
export default {
  name: 'app',
  data () {
    let openSidebar = window.openSidebar.split('-')[0];
    return {
      activeSidebar: '',
      openSidebar: [openSidebar],
      breadcrumb: []
    }
  },
  mounted(){
    
  },
  watch: {
    '$route' (to, from) {
      // console.log(to)
      this.breadcrumb = to.meta.breadcrumb || []
      this.activeSidebar = to.name;
    }
  },
  methods: {
    changeMenu(res){
      this.$router.push({name: res})
    }
  }
}
</script>

<style>

</style>
