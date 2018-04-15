<template>
  <div>
    <div class="search-bar">
      <Form v-if="!loading" :model="searchbar" :label-width="80" inline>
        <FormItem label="姓名">
          <Input v-model="searchbar.username" placeholder="输入姓名"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" icon="ios-search">查询</Button>
          <Button type="success" icon="ios-cloud-download" :loading="downloadLoading" @click="download">下载</Button>
        </FormItem>
      </Form>
    </div>
    <Table :data="resumeListData" :loading="loading" :columns="resumeListTemplate" stripe @on-selection-change="choosedOne"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" :current="current_page" :page-size="page_size" @on-change="changePage"></Page>
      </div>
    </div>

    <div class="chosed-list" v-if="chosedList.length!=0">
      <p>
        <span>已选择: </span>
        <Tag v-for="item in chosedList" :key="item.id">{{item.username}} {{item.department}}</Tag>
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
        username: ''
      },
      loading: true,
      downloadLoading: false,
      current_page: 1,
      page_size: 20,
      total: 0,
      resumeListData: [],
      resumeListTemplate: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '姓名',
          key: 'username'
        }, {
          title: '工作年限',
          key: 'work_year'
        }, {
          title: '职称',
          key: 'title'
        }, {
          title: '职位',
          key: 'position'
        }, {
          title: '部门',
          key: 'department'
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
        console.log(id)
      },
      remove(id, index){
        let that = this;
        that.resumeListData[index].deleteLoading = true;
        axios({
          method: 'post',
          url: '/resume/delete',
          data: {
            id: id,
          },
          timeout: 10000,
        }).then(res => {
          let resData = res.data;
          that.resumeListData[index].deleteLoading = false;
          if (resData.code == 200) {
            that.$Message.success('删除成功');
            that.getList();
          } else {
            that.$Message.error(resData.msg);
          }
        }).catch(res => {
          console.warn(res);
          that.resumeListData[index].deleteLoading = false;
          that.$Message.error('网络错误');
        });
      },
      edit(id){
        this.$router.push({name: 'resume-edit', params: {id: id}})
      },
      getList() {
        let that = this;
        axios({
          method: 'post',
          url: '/resume/list',
          data: {
            current_page: that.current_page,
            page_size: that.page_size
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

            that.resumeListData = resData.data.list;
            that.current_page = resData.data.pagination.current_page;
            that.total = resData.data.pagination.total;
            that.page_size = resData.data.pagination.page_size;
          } else {
            that.$Message.error(resData.msg);
          }
        }).catch(res => {
          that.loading = false;
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
            let newPage = window.open();
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