<template>
  <div>
    <div class="search-bar">
      <Form v-if="!loading" :model="searchbar" :label-width="80" inline>
        <FormItem label="姓名">
          <Input v-model="searchbar.username" placeholder="输入姓名"></Input>
        </FormItem>
        <FormItem label="部门">
          <Input v-model="searchbar.department" placeholder="输入部门"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" icon="ios-search" @click="search">查询</Button>
          <Button type="default" icon="ios-loop" @click="clearSearch">清空</Button>
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

    <Modal v-model="showDetail" width="1000">
      <p slot="header" style="text-align:center">
          <span>个人详情 - {{userInfo.username}}</span>
      </p>
      <div>
        <Row>
          <Col span="24">
            <h3>基本信息</h3>
            <div class="split"></div>
          </Col>
        </Row>
        <Row class="detail-block">
          <Col span="8">姓名: {{userInfo.username}}</Col>
          <Col span="8">性别: {{(userInfo.sex && userInfo.sex == 'male') ? '男' : '女'}}</Col>
          <Col span="8">出生年月: {{userInfo.born}}</Col>
          <Col span="8">身份证号: {{userInfo.id_card}}</Col>
          <Col span="8">民族: {{userInfo.nation}}</Col>
        </Row>
        <Row>
          <Col span="24">
            <h3>学历信息</h3>
            <div class="split"></div>
          </Col>
        </Row>
        <Row class="detail-block">
          <Col span="8">毕业学校: {{userInfo.school}}</Col>
          <Col span="8">专业: {{userInfo.major}}</Col>
          <Col span="8">最高学历: {{userInfo.education}}</Col>
          <Col span="8">最高学位: {{userInfo.degree}}</Col>
          <Col span="8">政治面貌: {{userInfo.political}}</Col>
        </Row>
        <Row>
          <Col span="24">
            <h3>从业信息</h3>
            <div class="split"></div>
          </Col>
        </Row>
        <Row class="detail-block">
          <Col span="8">工作年限: {{userInfo.work_year}}年</Col>
          <Col span="8">职称: {{userInfo.title}}</Col>
          <Col span="8">当前职位: {{userInfo.position}}</Col>
          <Col span="8">所在部门: {{userInfo.department}}</Col>
        </Row>
        <Row>
          <Col span="24">
            <h3>项目信息</h3>
            <div class="split"></div>
          </Col>
        </Row>
        <Row class="detail-block">
          <Col span="24">
            <table class="detail-table">
              <thead>
                <th>项目名称</th>
                <th>项目周期</th>
                <th>项目内容</th>
                <th>担任职位</th>
                <th>项目备注</th>
              </thead>
              <tbody>
                <tr v-for="(item, index) in userInfo.program_list"
                    :key="index">
                  <td>{{item.name}}</td>
                  <td>{{item.startTime}}-{{item.endTime}}</td>
                  <td>{{item.position}}</td>
                  <td>{{item.content}}</td>
                  <td>{{item.mark}}</td> 
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <h3>教育经历</h3>
            <div class="split"></div>
          </Col>
        </Row>
        <Row class="detail-block">
          <Col span="24">
            <table class="detail-table">
              <thead>
                <th>学校或机构</th>
                <th>时间</th>
                <th>专业或内容</th>
              </thead>
              <tbody>
                <tr v-for="(item, index) in userInfo.education_list"
                    :key="index">
                  <td>{{item.school}}</td>
                  <td>{{item.startTime}}-{{item.endTime}}</td>
                  <td>{{item.content}}</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <h3>工作经历</h3>
            <div class="split"></div>
          </Col>
        </Row>
        <Row class="detail-block">
          <Col span="24">
            <table class="detail-table">
              <thead>
                <th>公司或机构</th>
                <th>时间</th>
                <th>工作内容</th>
                <th>担任职位</th>
              </thead>
              <tbody>
                <tr v-for="(item, index) in userInfo.work_list"
                    :key="index">
                  <td>{{item.name}}</td>
                  <td>{{item.startTime}}-{{item.endTime}}</td>
                  <td>{{item.position}}</td>
                  <td>{{item.content}}</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </div>
    </Modal>
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
        this.getDetail(id);
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
      search() {
        this.current_page = 1;
        this.loading = true;
        this.getList();
      },
      clearSearch(){
        this.searchbar.username = '';
        this.searchbar.department = '';
        this.current_page = 1;
        this.loading = true;
        this.getList();
      },
      getList() {
        let that = this;
        axios({
          method: 'post',
          url: '/resume/list',
          data: {
            current_page: that.current_page,
            page_size: that.page_size,
            username: that.searchbar.username,
            department: that.searchbar.department
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