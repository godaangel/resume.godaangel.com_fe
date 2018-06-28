<template>
  <div>
    <div class="search-bar">
      <Form :model="searchbar" :label-width="80" inline>
        <FormItem label="标题">
          <Input v-model="searchbar.title" placeholder="输入标题"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" icon="ios-search" @click="search">查询</Button>
          <Button type="default" icon="ios-loop" @click="clearSearch">清空</Button>
        </FormItem>
      </Form>
    </div>
    <Table :data="articleListData" :loading="loading" :columns="articleListTemplate" stripe @on-selection-change="choosedOne"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" :current="current_page" :page-size="page_size" @on-change="changePage"></Page>
      </div>
    </div>

    <div class="chosed-list" v-if="chosedList.length!=0">
      <p>
        <span>已选择: </span>
        <Tag v-for="item in chosedList" :key="item.id">{{item.title}}</Tag>
      </p>
    </div>

  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      chosedList: [],
      searchbar: {
        username: '',
        department: ''
      },
      userInfo: {
        username: '',
        sex: '',
        born: '',
        id_card: '',
        nation: '',
        school: '',
        major: '',
        education: '',
        degree: '',
        political: '',
        work_year: 0,
        title: '',
        position: '',
        department: '',
        program_list: [],
        education_list: [],
        work_list: []
      },
      showDetail: false,
      loading: true,
      downloadLoading: false,
      current_page: 1,
      page_size: 20,
      total: 0,
      articleListData: [],
      articleListTemplate: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '名称',
          key: 'title'
        }, {        
          title: '最后更新时间',
          key: 'update_time',
          render: (h, params) => {
            return h('div', this.formatDate(params.row.update_time));
          }
        }, {
          title: 'Action',
          key: 'id',
          width: 240,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'default',
                  size: 'small',
                  icon: 'ionic'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.row.id);
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'edit'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edit(params.row.id);
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'trash-a',
                  loading: params.row.deleteLoading
                },
                on: {
                  click: () => {
                    this.remove(params.row.id, params.index);
                  }
                }
              }, '删除')
            ]);
          }
        }]
      }
    },
    mounted() {
      let that = this;
      axios.interceptors.request.use(function(config) {
        if(config.url == '/resume/list'){
          that.loading = true;
        }
        return config;
      }, function(error) {
        return Promise.reject(error);
      });
      that.getList();
    },
    methods: {
      show(id){
        // this.getDetail(id);
      },
      getDetail(id){
        let that = this;
        that.loading = true;
        axios({
          method: 'post',
          url: '/resume/detail',
          data: {
            id: id
          },
          timeout: 10000,
        }).then(res => {
          that.loading = false;
          that.showDetail = true;
          let resData = res.data;
          if(resData.code == 200){
            resData.data.program_list = eval(resData.data.program_list)||[];
            resData.data.education_list = eval(resData.data.education_list)||[];
            resData.data.work_list = eval(resData.data.work_list)||[];
            that.userInfo = resData.data;
          }else{
            that.$Message.error(resData.msg);
          }
        }).catch(res => {
          console.warn(res);
          that.$Message.error('网络错误');
        });
      },
      remove(id, index){
        let that = this;
        that.articleListData[index].deleteLoading = true;
        axios({
          method: 'post',
          url: '/resume/delete',
          data: {
            id: id,
          },
          timeout: 10000,
        }).then(res => {
          let resData = res.data;
          that.articleListData[index].deleteLoading = false;
          if (resData.code == 200) {
            that.$Message.success('删除成功');
            that.getList();
          } else {
            that.$Message.error(resData.msg);
          }
        }).catch(res => {
          console.warn(res);
          that.articleListData[index].deleteLoading = false;
          that.$Message.error('网络错误');
        });
      },
      edit(id){
        this.$router.push({name: 'data-edit', params: {id: id}})
      },
      search() {
        this.current_page = 1;
        this.loading = true;
        this.getList();
      },
      clearSearch(){
        this.searchbar.title = '';
        // this.searchbar.department = '';
        this.current_page = 1;
        this.loading = true;
        this.getList();
      },
      getList() {
        let that = this;
        axios({
          method: 'post',
          url: '/article/list',
          data: {
            current_page: that.current_page,
            page_size: that.page_size,
            title: that.searchbar.title
          },
          timeout: 10000,
        }).then(res => {
          let resData = res.data;
          that.loading = false;
          if (resData.code == 200) {
            /**
             * 给每个列都加入删除按钮的loading，作为删除时加载的标识切换
             * @Author   Warrenyang
             * @DateTime 2018-04-14
             */
            for(let i in resData.data.list){
              resData.data.list[i].deleteLoading = false;
            }

            that.articleListData = resData.data.list;
            that.current_page = resData.data.pagination.current_page;
            that.total = resData.data.pagination.total;
            that.page_size = resData.data.pagination.page_size;
          } else {
            that.$Message.error(resData.msg);
          }
        }).catch(res => {
          that.loading = false;
          console.warn(res);
          that.$Message.error('网络错误');
        });
      },
      changePage(res) {
        let that = this;
        that.current_page = res;
        that.getList();
      },
      choosedOne(res) {
        this.chosedList = res;
      },
      download(){
        let that = this;
        if(this.chosedList.length == 0){
          this.$Message.warning('请选择要下载的条目');
          return false;
        }
        let idList = [];
        for(let i in this.chosedList){
          idList.push(this.chosedList[i].id);
        }
        this.downloadLoading = true;
        axios({
          method: 'post',
          url: '/resume/export/word',
          data: {
            id: idList.join(','),
          },
          timeout: 10000,
        }).then(res => {
          let resData = res.data;
          this.downloadLoading = false;
          if (resData.code == 200) {
            let newPage = window.open('_blank');
            newPage.location = `/${resData.data.url}`;
          } else {
            that.$Message.error(resData.msg);
          }
        }).catch(res => {
          this.downloadLoading = false;
          console.warn(res);
          that.$Message.error('网络错误');
        });
        
      },
      formatDate(timestamp) {
        timestamp = timestamp * 1;
        let date = new Date(timestamp);
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
      },
    }
  }
</script>
<style lang="less">
  .split{
    height: 1px;
    width: 100%;
    border-bottom: 1px solid #e5e8ef;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .detail-block{
    margin-bottom: 15px;
    .ivu-col{
      margin-top: 5px;
      margin-bottom: 5px;
    }
    .detail-table{
      width: 100%;
      text-align: left;
      thead{
        background-color: #f8f8f9;
        th{
          padding: 3px 0;
        }
        th:nth-child(1){
          width: 180px;
        }
        th:nth-child(2){
          width: 120px;
        }
      }
      tbody{
        td{
          padding: 3px 0;
        }
        tr:nth-child(2n){
          background-color: #f8f8f9;
        }
      }
    }
  }
</style>