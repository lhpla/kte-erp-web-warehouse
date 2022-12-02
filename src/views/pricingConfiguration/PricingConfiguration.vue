<template>
  
  <div id="PricingConfiguration">
      <div class="PricingConfiguration_title">
        <span>计价配置</span>
      </div>
      <div class="card-header">
          <span style="font-size:16px">配置信息：</span>
          <div>
            <el-button type="primary" size="small" v-if="editFlag" @click="onSubmit">保存</el-button>
            <el-button type="primary" size="small" v-else @click="onEdit">修改</el-button>
          </div>
      </div>
      <div style="padding:35px">
        <el-form :model="pricingConfigurationData" :rules="rules" class="demo-form-inline" size="small" label-width="160px" @submit.prevent>
          <div class="container">
            <div>
              <el-form-item prop="country">
                <template #label>
                  <span>平台费<el-tooltip class="item" effect="dark" content="以85%(1-15%)计算成本，售价*0.15*汇率" placement="top">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                  ：</span>
                </template>
              <el-input v-if="editFlag" style="width:310px" v-model="pricingConfigurationData.country" placeholder="请输入" />
              <span class="text_width" v-else>{{pricingConfigurationData.country}}</span>
              </el-form-item>
              <el-form-item prop="country">
                <template #label>
                  <span>抛重
                  <el-tooltip class="item" effect="dark" content="长(cm)X宽(cm)X高(cm)/6000 以公斤为单位的体积重量" placement="top">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                  ：</span>
                </template>
              <el-input v-if="editFlag" style="width:310px" v-model="pricingConfigurationData.country" placeholder="请输入" />
              <span class="text_width" v-else>{{pricingConfigurationData.country}}</span>
              </el-form-item>
              <el-form-item required>
                <template #label>
                  <span>海运头程费
                  <el-tooltip class="item" effect="dark" content="海运根据立方米体积计算，实际体积m³x海运费" placement="top">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                  ：</span>
                </template>
                <template v-if="editFlag">
                  <el-form size="small" :model="form" :rules="rules" :inline="true" class="demo-form-inline">
                    <div v-for="(item, index) in pricingConfigurationData.list1" :key="item.id">
                      <el-form-item :prop="'list1.'+index+'.country'" :rules="rules.country">
                        <el-input style="width:100px; margin-right:10px" v-model="item.country" placeholder="请输入" />
                      </el-form-item>
                    <el-form-item :prop="'list1.'+index+'.value'" :rules="rules.value">
                      <el-input style="width:200px" v-model="item.value" placeholder="请输入" />
                      <el-button v-if="index === 0" style="margin-left:5px" type="text" @click="onAdd">增加</el-button>
                      <el-button v-if="index !== 0" style="margin-left:5px" type="text" @click="onDelete(item.id)">删除</el-button>
                    </el-form-item>
                    </div>
                  </el-form>
                </template>
                <template v-else>
                  <div v-for="item in pricingConfigurationData.list1" :key="item.id">
                    <span class="text_width">{{item.country}}</span>
                    <span class="text_width">{{item.value}}</span>
                  </div>
                </template>
              </el-form-item>
              <el-form-item required>
                <template #label>
                  <span>空运头程费
                  <el-tooltip class="item" effect="dark" content="空运体积重(抛重6000)和实重取最大值来计算" placement="top">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                  ：</span>
                </template>
                <template v-if="editFlag">
                  <el-form size="small" :model="form" :rules="rules" :inline="true" class="demo-form-inline">
                    <div v-for="(item, index) in pricingConfigurationData.list2" :key="item.id">
                      <el-form-item :prop="'list2.'+index+'.country'" :rules="rules.country">
                        <el-input style="width:100px; margin-right:10px" v-model="item.country" placeholder="请输入" />
                      </el-form-item>
                    <el-form-item :prop="'list2.'+index+'.value'" :rules="rules.value">
                      <el-input style="width:200px" v-model="item.value" placeholder="请输入" />
                      <el-button v-if="index === 0" style="margin-left:5px" type="text" @click="onAdd">增加</el-button>
                      <el-button v-if="index !== 0" style="margin-left:5px" type="text" @click="onDelete(item.id)">删除</el-button>
                    </el-form-item>
                    </div>
                  </el-form>
                </template>
                <template v-else>
                  <div v-for="item in pricingConfigurationData.list2" :key="item.id">
                    <span class="text_width">{{item.country}}</span>
                    <span class="text_width">{{item.value}}</span>
                  </div>
                </template>
              </el-form-item>
              <el-form-item required>
                <template #label>
                  <span>增值税
                  <el-tooltip class="item" effect="dark" content="英国及欧洲国家 ：(建议售价-建议售价/1.2)*汇率；150欧 135英镑以上不收税" placement="top">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                  ：</span>
                </template>
                <template v-if="editFlag">
                  <el-form size="small" :model="form" :rules="rules" :inline="true" class="demo-form-inline">
                    <div v-for="(item, index) in pricingConfigurationData.list3" :key="item.id">
                      <el-form-item :prop="'list3.'+index+'.country'" :rules="rules.country">
                        <el-input style="width:100px; margin-right:10px" v-model="item.country" placeholder="请输入" />
                      </el-form-item>
                    <el-form-item :prop="'list3.'+index+'.value'" :rules="rules.value">
                      <el-input style="width:200px" v-model="item.value" placeholder="请输入" />
                      <el-button v-if="index === 0" style="margin-left:5px" type="text" @click="onAdd">增加</el-button>
                      <el-button v-if="index !== 0" style="margin-left:5px" type="text" @click="onDelete(item.id)">删除</el-button>
                    </el-form-item>
                    </div>
                  </el-form>
                </template>
                <template v-else>
                  <div v-for="item in pricingConfigurationData.list3" :key="item.id">
                    <span class="text_width">{{item.country}}</span>
                    <span class="text_width">{{item.value}}</span>
                  </div>
                </template>
              </el-form-item>
            </div>
            <div>
              <el-form-item required>
                <template #label>
                  <span>关税
                  <el-tooltip class="item" effect="dark" content="产品成本 * 目的地国家关税" placement="top">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                  ：</span>
                </template>
                <template v-if="editFlag">
                  <el-form size="small" :model="form" :rules="rules" :inline="true" class="demo-form-inline">
                    <div v-for="(item, index) in pricingConfigurationData.list4" :key="item.id">
                      <el-form-item :prop="'list4.'+index+'.country'" :rules="rules.country">
                        <el-input style="width:100px; margin-right:10px" v-model="item.country" placeholder="请输入" />
                      </el-form-item>
                    <el-form-item :prop="'list4.'+index+'.value'" :rules="rules.value">
                      <el-input style="width:200px" v-model="item.value" placeholder="请输入" />
                      <el-button v-if="index === 0" style="margin-left:5px" type="text" @click="onAdd">增加</el-button>
                      <el-button v-if="index !== 0" style="margin-left:5px" type="text" @click="onDelete(item.id)">删除</el-button>
                    </el-form-item>
                    </div>
                  </el-form>
                </template>
                <template v-else>
                  <div v-for="item in pricingConfigurationData.list4" :key="item.id">
                    <span class="text_width">{{item.country}}</span>
                    <span class="text_width">{{item.value}}</span>
                  </div>
                </template>
              </el-form-item>
              <el-form-item required>
                <template #label>
                  <span>尾程费
                  <el-tooltip class="item" effect="dark" content="即海外派送费，体积重(抛重)和实重取最大值来计算" placement="top">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                  ：</span>
                </template>
                <template v-if="editFlag">
                  <el-form size="small" :model="form" :rules="rules" :inline="true" class="demo-form-inline">
                    <div v-for="(item, index) in pricingConfigurationData.list5" :key="item.id">
                      <el-form-item :prop="'list5.'+index+'.country'" :rules="rules.country">
                        <el-input style="width:100px; margin-right:10px" v-model="item.country" placeholder="请输入" />
                      </el-form-item>
                    <el-form-item :prop="'list5.'+index+'.value'" :rules="rules.value">
                      <el-input style="width:200px" v-model="item.value" placeholder="请输入" />
                      <el-button v-if="index === 0" style="margin-left:5px" type="text" @click="onAdd">增加</el-button>
                      <el-button v-if="index !== 0" style="margin-left:5px" type="text" @click="onDelete(item.id)">删除</el-button>
                    </el-form-item>
                    </div>
                  </el-form>
                </template>
                <template v-else>
                  <div v-for="item in pricingConfigurationData.list5" :key="item.id">
                    <span class="text_width">{{item.country}}</span>
                    <span class="text_width">{{item.value}}</span>
                  </div>
                </template>
              </el-form-item>
              <el-form-item required>
                <template #label>
                  <span>燃油费
                  <el-tooltip class="item" effect="dark" content="尾程费*10%" placement="top">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                  ：</span>
                </template>
                <template v-if="editFlag">
                  <el-form size="small" :model="form" :rules="rules" :inline="true" class="demo-form-inline">
                    <div v-for="(item, index) in pricingConfigurationData.list4" :key="item.id">
                      <el-form-item :prop="'list4.'+index+'.country'" :rules="rules.country">
                        <el-input style="width:100px; margin-right:10px" v-model="item.country" placeholder="请输入" />
                      </el-form-item>
                    <el-form-item :prop="'list4.'+index+'.value'" :rules="rules.value">
                      <el-input style="width:200px" v-model="item.value" placeholder="请输入" />
                      <el-button v-if="index === 0" style="margin-left:5px" type="text" @click="onAdd">增加</el-button>
                      <el-button v-if="index !== 0" style="margin-left:5px" type="text" @click="onDelete(item.id)">删除</el-button>
                    </el-form-item>
                    </div>
                  </el-form>
                </template>
                <template v-else>
                  <div v-for="item in pricingConfigurationData.list4" :key="item.id">
                    <span class="text_width">{{item.country}}</span>
                    <span class="text_width">{{item.value}}</span>
                  </div>
                </template>
              </el-form-item>
            </div>
          </div>
      </el-form>
      </div>
  </div>
</template>

<script setup>
import {
  reactive,
  onMounted,
  ref,
  getCurrentInstance,
  computed,
  watch,
  defineProps,
} from "vue";
import { ElMessage } from 'element-plus'
import { useTableHeight } from "@/compositionApi/useTableHeight";
import authorButtons from "@/compositionApi/authorButtons";
const { proxy: vue } = getCurrentInstance()
const api = vue.$http
const { BUTTONS } = authorButtons();
const buttonAuthor = BUTTONS.value;
const { tableHeight } = useTableHeight(330);

const pricingConfigurationData = ref({list1:[{id:1, country:'美国', value:'2500/m³'}, {id:2, country:'澳洲', value:'2500/m³'}],
                  list2:[{id:1, country:'捷克', value:'56/KG'}, {id:2, country:'澳洲', value:'67/KG'},{id:3, country:'捷克', value:'56/KG'}, {id:4, country:'澳洲', value:'67/KG'}],
                  list3:[{id:1, country:'美国', value:'1.2'}, {id:2, country:'英国', value:'1.2'}],
                  list4:[{id:1, country:'美国', value:'5%'}, {id:2, country:'欧盟', value:'19%'},{id:3, country:'美国', value:'5%'}, {id:4, country:'欧盟', value:'19%'}],
                  list5:[{id:1, country:'美国', value:'cm³/5000'}, {id:2, country:'澳洲', value:'cm³/5000'},{id:3, country:'美国', value:'cm³/5000'}, {id:4, country:'澳洲', value:'cm³/5000'}]
  })

const rules = {
        country: [
          { required: true, message: "请输入国家", trigger: "blur" },
        ],
        value: [
          { required: true, message: "请输入值", trigger: "blur" },
        ],
      }

const editFlag = ref(false)
const onAdd = ()=>{
  const id = pricingConfigurationData.value.list1[pricingConfigurationData.value.list1.length-1].id + 1
  pricingConfigurationData.value.list1.push({id:id, country:'', value:''})
}

const onDelete = (id)=>{
const index = pricingConfigurationData.value.list1.findIndex(item=>{
  return item.id === id
})
pricingConfigurationData.value.list1.splice(index,1)
}

const onSubmit = ()=>{
  editFlag.value = !editFlag.value
}

const onEdit = ()=>{
  editFlag.value = !editFlag.value
}
</script>

<style lang="scss">
#PricingConfiguration {
  padding:30px 50px;
  .card-header {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  }
  .container{
    display: grid;
    grid-template-columns: 50% 50%;
  }
  .PricingConfiguration_title {
    display: flex;
    align-items: center;
    padding: 10px 0;
    margin-bottom: 20px;

    span:nth-child(1) {
      font-size: 18px;
      font-weight: 700;
    }

    border-bottom: 1px solid #ddd;
  }

  .text_width{
    display: inline-block;
    width: 100px;
    text-align: center;
  }
}
</style>