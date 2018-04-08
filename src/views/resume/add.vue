<template>
    <Form :model="formItem" :label-width="120">
      <Row>
        <Col span="8">
          <FormItem label="姓名">
              <Input v-model="formItem.username" placeholder="输入姓名"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="性别">
            <RadioGroup v-model="formItem.sex">
              <Radio label="male">男</Radio>
              <Radio label="female">女</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="出生年月">
            <DatePicker type="date" placeholder="选择出生年月" v-model="formItem.born"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="身份证号">
              <Input v-model="formItem.id_card" placeholder="输入身份证号"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="民族">
              <Input v-model="formItem.nation" placeholder="输入民族"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="毕业学校">
              <Input v-model="formItem.school" placeholder="输入毕业学校"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="专业">
              <Input v-model="formItem.major" placeholder="输入所学专业"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="最高学历">
              <Input v-model="formItem.education" placeholder="输入最高学历"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="最高学位">
              <Input v-model="formItem.degree" placeholder="输入最高学位"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="政治面貌">
            <Select v-model="formItem.political">
              <Option value="少先队员">少先队员</Option>
              <Option value="共青团员">共青团员</Option>
              <Option value="中共党员">中共党员（含预备党员）</Option>
              <Option value="群众">群众</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="从业年限">
            <Col span="20">
              <Slider v-model="formItem.work_year" :max="50"></Slider>
            </Col>
            <Col span="4" :style="{textAlign: 'center'}">
              {{formItem.work_year}}年
            </Col>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="职称">
            <Input v-model="formItem.title" placeholder="输入职称"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="当前职位">
            <Input v-model="formItem.position" placeholder="输入当前职位"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="现在所在部门">
            <Input v-model="formItem.department" placeholder="输入现在所在部门"></Input>
          </FormItem>
        </Col>
        <!-- <Col span="8">
          <FormItem label="计划投入服务时间">
            <InputNumber :max="60" :min="1" v-model="formItem.service_time"></InputNumber>
            个月
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="拟在本项目中任职">
            <Input v-model="formItem.now_position" placeholder="输入拟在本项目中任职"></Input>
          </FormItem>
        </Col> -->
      </Row>
      <Row>
        <Col span="24">
          <h3>项目信息</h3>
          <div class="split"></div>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <FormItem
            v-for="(item, index) in formItem.program_list"
            :key="index"
            :label="'参加的项目' + (index+1)">
            <Row>
              <Col span="4">
                <Input type="text" v-model="item.name" placeholder="输入项目名称" icon="home"></Input>
              </Col>
              <Col span="4" :style="{textAlign: 'center'}">
                <DatePicker type="date" placeholder="选择开始日期" v-model="item.startTime"></DatePicker>
              </Col>
              <Col span="4">
                <DatePicker type="date" placeholder="选择结束日期" v-model="item.endTime"></DatePicker>
              </Col>
              <Col span="4">
                <Input type="text" v-model="item.position" placeholder="输入担任职位" icon="briefcase"></Input>
              </Col>
              <Col span="4" offset="1">
                <Button type="error" @click="removePrograme(index)">删除</Button>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="项目内容" label-position="top" :label-width="60">
                  <Input v-model="item.content" type="textarea" :rows="5" :autosize="{minRows: 5,maxRows: 5}" placeholder="输入项目内容"></Input>
                </FormItem>
              </Col>
              <Col span="7" offset="1">
                <FormItem label="项目备注" label-position="top" :label-width="60">
                  <Input v-model="item.remark" type="textarea" :rows="5" :autosize="{minRows: 5,maxRows: 5}" placeholder="输入项目备注"></Input>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
        </Col>
      </Row>
      <FormItem>
        <Row>
          <Col span="4">
            <Button type="primary" @click="addPrograme" icon="plus-round">添加项目信息</Button>
          </Col>
        </Row>
      </FormItem>
      <Row>
        <Col span="24">
          <h3>教育经历</h3>
          <div class="split"></div>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <FormItem
            v-for="(item, index) in formItem.education_list"
            :key="index"
            :label="'教育经历' + (index+1)">
            <Row>
              <Col span="4">
                <Input type="text" v-model="item.school" placeholder="输入学校或机构" icon="monitor"></Input>
              </Col>
              <Col span="4" :style="{textAlign: 'center'}">
                <DatePicker type="date" placeholder="选择开始日期" v-model="item.startTime"></DatePicker>
              </Col>
              <Col span="4">
                <DatePicker type="date" placeholder="选择结束日期" v-model="item.endTime"></DatePicker>
              </Col>
              <Col span="4">
                <Input type="text" v-model="item.content" placeholder="输入专业或内容" icon="university"></Input>
              </Col>
              <Col span="4" offset="1">
                <Button type="error" @click="removeEducation(index)">删除</Button>
              </Col>
            </Row>
          </FormItem>
        </Col>
      </Row>
      <FormItem>
        <Row>
          <Col span="4">
            <Button type="primary" @click="addEducation" icon="plus-round">添加教育经历</Button>
          </Col>
        </Row>
      </FormItem>

      <Row>
        <Col span="24">
          <h3>工作经历</h3>
          <div class="split"></div>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <FormItem
            v-for="(item, index) in formItem.work_list"
            :key="index"
            :label="'工作经历' + (index+1)">
            <Row>
              <Col span="4">
                <Input type="text" v-model="item.company" placeholder="输入公司或机构" icon="ios-compose-outline"></Input>
              </Col>
              <Col span="4" :style="{textAlign: 'center'}">
                <DatePicker type="date" placeholder="选择开始日期" v-model="item.startTime"></DatePicker>
              </Col>
              <Col span="4">
                <DatePicker type="date" placeholder="选择结束日期" v-model="item.endTime"></DatePicker>
              </Col>
              <Col span="4">
                <Input type="text" v-model="item.position" placeholder="输入职位" icon="person-stalker"></Input>
              </Col>
              <Col span="4" offset="1">
                <Button type="error" @click="removeWork(index)">删除</Button>
              </Col>
            </Row>
            <Row>
              <Col span="16">
                <FormItem label="工作内容" label-position="top" :label-width="60">
                  <Input v-model="item.content" type="textarea" :rows="5" :autosize="{minRows: 5,maxRows: 5}" placeholder="输入工作内容"></Input>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
        </Col>
      </Row>
      <FormItem>
        <Row>
          <Col span="4">
            <Button type="primary" @click="addWork" icon="plus-round">添加工作经历</Button>
          </Col>
        </Row>
      </FormItem>
      <Row>
        <Col span="24">
          <div class="split"></div>
        </Col>
      </Row>
      <FormItem>
          <Button type="primary" @click="submit">提交</Button>
          <Button type="ghost" style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
</template>
<script>
  export default {
    data() {
      return {
        formItem: {
          username: '',
          sex: 'male',
          bon: '',
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
          program_list: [{
            name: '测试',
            startTime: '',
            endTime: '',
            position: '主管',
            remark: '',
            content: '项目内容'
          }],
          education_list: [{
            startTime: '',
            endTime: '',
            school: '',
            content: ''
          }],
          work_list: [{
            startTime: '',
            endTime: '',
            company: '',
            content: '',
            position: ''
          }]
        }
      }
    },
    methods: {
      addPrograme() {
        this.formItem.program_list.push({
          name: '',
          startTime: '',
          endTime: '',
          position: '',
          remark: '',
          content: ''
        });
      },
      removePrograme(index) {
        this.formItem.program_list.splice(index, 1);
      },
      addEducation() {
        this.formItem.education_list.push({
          startTime: '',
          endTime: '',
          school: '',
          content: ''
        });
      },
      removeEducation(index) {
        this.formItem.education_list.splice(index, 1);
      },
      addWork() {
        this.formItem.work_list.push({
          startTime: '',
          endTime: '',
          company: '',
          content: '',
          position: ''
        });
      },
      removeWork(index) {
        this.formItem.work_list.splice(index, 1);
      },
      submit(){
        console.log(this.formItem);
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
</style>
