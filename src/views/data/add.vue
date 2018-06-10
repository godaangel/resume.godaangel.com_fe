<template>
    <Form v-if="!loading" :model="formItem" :label-width="120">
      <Tree :data="tree" :render="renderContent"></Tree>
      <Row>
        <Col span="24">
          <div class="split"></div>
        </Col>
      </Row>
      <FormItem>
          <Button type="primary" :loading="submiting" @click="submit">
            <span v-if="!submiting">提交</span>
            <span v-else>提交中...</span>
          </Button>
          <Button type="ghost" style="margin-left: 8px">取消</Button>
      </FormItem>

      <Modal v-model="showAdd" width="600">
        <p slot="header" style="text-align:center">
            <Icon type="information-circled"></Icon>
            <span>添加内容</span>
        </p>
        <div style="text-align:center">
          <Form>
            <FormItem label="标题">
                <Input v-model="addTitle" placeholder="输入标题"></Input>
            </FormItem>
            <FormItem label="内容">
                <Input class="model-textarea" type="textarea" v-model="addContent" placeholder="输入内容"></Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
            <Button type="primary" size="large" long @click="addArticle">添加</Button>
        </div>
      </Modal>
    </Form>
    <Spin v-else-if="!isNew && loading">数据加载中...</Spin>
</template>
<script>
  import $ from 'jquery';
  import axios from 'axios';

  export default {
    data() {
      let isNew = true;
      if(this.$route.params.id){
        isNew = false;
      }
      return {
        id: this.$route.params.id,
        isNew: isNew,
        submiting: false,
        loading: false,
        formItem: {
          username: '',
          sex: 'male',
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
        showAdd: false,
        addTitle: '',
        addContent: '',
        thisNode: null,
        tree: [{
          title: '添加文章段',
          expand: true,
          render: (h, {
            root,
            node,
            data
          }) => {
            return h('span', {
              style: {
                display: 'inline-block',
                width: '100%'
              }
            }, [
              h('span', [
                h('Icon', {
                  props: {
                    type: 'ios-folder-outline'
                  },
                  style: {
                    marginRight: '8px'
                  }
                }),
                h('span', data.title)
              ]),
              h('span', {
                style: {
                  display: 'inline-block',
                  float: 'right',
                  marginRight: '32px'
                }
              }, [
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-plus-empty',
                    type: 'primary'
                  }),
                  style: {
                    width: '52px'
                  },
                  on: {
                    click: () => {
                      this.append(data)
                    }
                  }
                })
              ])
            ]);
          },
          children: []
        }],
        buttonProps: {
          type: 'ghost',
          size: 'small'
        }
      }
    },
    watch: {
      "$route": function(to,from){
        // console.log(to, from);
        let that = this;
        if(to.name == 'resume-add'){
          that.formItem = {
            username: '',
            sex: 'male',
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
          }
        }else if(to.name == 'resume-edit'){
          that.isNew = false;
          that.getDetail(that.id);
        }
      }
    },
    mounted(){
      let that = this;
      axios.interceptors.request.use(function (config) {
        if(config.url != '/resume/detail'){
          that.submiting = true;
        }
        return config;
      }, function (error) {
        return Promise.reject(error);
      });

      if(!that.isNew){
        that.getDetail(that.id);
      }
    },
    methods: {
      transToBr(content, h) {
        if (!content) {
          return false;
        }
        content = content.split('￥￥');
        let arr = [];
        for(let i in content){
          arr.push(h('p', content[i]));
        }
        return arr;
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
          let resData = res.data;
          if(resData.code == 200){
            resData.data.program_list = eval(resData.data.program_list)||[];
            resData.data.education_list = eval(resData.data.education_list)||[];
            resData.data.work_list = eval(resData.data.work_list)||[];
            that.formItem = resData.data;
          }else{
            that.$Message.error(resData.msg);
          }
        }).catch(res => {
          console.warn(res);
          that.$Message.error('网络错误');
        });
      },
      submit(){
        let that = this;
        let params = $.extend(true, {}, that.formItem);
        params.program_list = JSON.stringify(params.program_list);
        params.education_list = JSON.stringify(params.education_list);
        params.work_list = JSON.stringify(params.work_list);
        // console.log(params);
        // return false;
        let url = '/resume/add';
        if(!that.isNew){
          params.id = that.id;
          url = '/resume/update';
        }

        axios({
          method: 'post',
          url: url,
          data: params,
          timeout: 10000,
        }).then(res => {
          let resData = res.data;
          that.submiting = false;
          if(resData.code == 200){
            that.$Message.success('保存成功!');
          }else{
            that.$Message.error(resData.msg);
          }
        }).catch(res => {
          that.submiting = false;
          that.$Message.error('网络错误');
        });
      },
      renderContent(h, {
          root,
          node,
          data
        }) {
          return h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            }
          }, [
            h('span', [
              data.title ? h('Icon', {
                props: {
                  type: 'ios-paper-outline'
                },
                style: {
                  marginRight: '8px'
                }
              }) : '',
              data.title ? h('span', data.title) : '',
              data.content ? h('p', this.transToBr(data.content, h)) : ''
            ]),
            h('span', {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
              }
            }, [
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'ios-plus-empty'
                }),
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.append(data)
                  }
                }
              }),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'ios-minus-empty'
                }),
                on: {
                  click: () => {
                    this.remove(root, node, data)
                  }
                }
              })
            ])
          ]);
        },
        append(data) {
          this.thisNode = data;
          this.showAdd = true;
        },
        addArticle() {
          let data = this.thisNode;
          const children = data.children || [];
          children.push({
            title: this.addTitle,
            expand: true,
            content: this.addContent ? this.addContent.replace(/\n/g, '￥￥') : ''
          });
          this.$set(data, 'children', children);
          this.showAdd = false;
          this.addTitle = '';
          this.addContent = '';
        },
        remove(root, node, data) {
          const parentKey = root.find(el => el === node).parent;
          const parent = root.find(el => el.nodeKey === parentKey).node;
          const index = parent.children.indexOf(data);
          parent.children.splice(index, 1);
        }
    }
  }
</script>

<style lang="less">
  .split{
    height: 1px;
    width: 100%;
    border-bottom: 1px solid #e5e8ef;
    margin-top: 5px;
    margin-bottom: 25px;
  }
  .form-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  .model-textarea{
    textarea{
      resize: none;
      height: 300px;
    }
  }
</style>
