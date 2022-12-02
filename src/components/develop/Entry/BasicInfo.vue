<!-- 基础信息 -->
<template>
  <div>
    <!--表单编辑状态 start -->
    <div v-if="type == 3 && isDetail">
      <el-form
        :disabled="disabled"
        :model="ruleForm"
        :rules="rules"
        ref="productForm"
        size="mini"
        label-width="145px"
        class="demo-ruleForm"
      >
        <!-- 开发二录新增供应商 -->
        <div style="width: 100%; display: flex">
          <el-form-item label="供应商:" prop="supplierName" style="width: 45%">
            <div class="content-el-select" style="display: flex" ref="scroolContent">
              <SupplierPublic ref="SupplierPublic" @handChange="handChange"></SupplierPublic>
              <el-button
                type="text"
                class="supplier"
                style="margin-left: 10px"
                v-if="!disabled"
                @click="jump('/procurement', '/provider/providerManage/list')"
                >新建供应商</el-button
              >
              <el-input v-model="ruleForm.supplierName" style="display: none"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="选品分类:" prop="classify">
            <!-- +++++++ -->
            <!-- <el-cascader
              :options="options"
              :props="propsClass"
              v-model="ruleForm.classify"
              clearable
              @change="onChange"
            ></el-cascader>-->
            <!-- +++++++ -->
            <!-- -------- -->
            <el-cascader
              :options="options"
              :props="propsClass"
              v-model="ruleForm.classify"
              clearable
              :filterable="true"
              @change="onChange"
            ></el-cascader>
            <el-checkbox style="margin-left: 5px" v-model="ruleForm.euroArea">是否需要拍照</el-checkbox>
            <el-checkbox v-model="ruleForm.photograph">是否需要CE、欧代</el-checkbox>
          </el-form-item>
        </div>
        <div style="width: 100%; display: flex">
          <el-form-item label="选品中文名称:" prop="productCname" style="width: 45%">
            <el-input
              v-model="ruleForm.productCname"
              maxlength="50"
              clearable
              placeholder="请输入选品中文名称"
            ></el-input>
            <el-checkbox v-model="ruleForm.isElectrified">是否带电池</el-checkbox>
          </el-form-item>
          <el-form-item label="SPU:" prop="proSpu">
            <el-select v-model="ruleForm.proSpu" clearable filterable @change="onSPUChange">
              <el-option
                v-for="item in spuOptions"
                :key="item.id"
                :label="item.label"
                :value="item.spuCode"
              ></el-option>
            </el-select>
            <el-button
              type="text"
              class="supplier"
              style="margin-left: 10px"
              v-if="!disabled"
              @click="jumpSPU('/warehouse', '/productParameters/PropertyManage/list')"
              >新建SPU</el-button
            >
          </el-form-item>
        </div>
        <div style="width: 100%; display: flex">
          <el-form-item label="选品英文名称:" style="width: 45%" prop="productRealName">
            <el-input v-model="ruleForm.productRealName" clearable placeholder="请输入选品英文名称"></el-input>
            <el-checkbox v-model="ruleForm.isMagnetism">是否带磁</el-checkbox>
          </el-form-item>
          <el-form-item label="运营方式:" prop="operating">
            <el-select v-model="ruleForm.operating" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in operate_type"
                :key="item.dizKey"
                :label="item.value"
                :value="item.dizKey"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="width: 100%; display: flex">
          <el-form-item label="选品图片:" prop="fileList" style="width: 45%">
            <span class="commonNote">仅支持上传jpg/png格式文件，单个文件不能超过5M</span>
            <UploadImage ref="UploadImage" @clickFu="receive"></UploadImage>
          </el-form-item>

          <div>
            <!-- 新增侧重开发方向: -->
            <el-form-item label="侧重开发方向:" prop="deptDirection">
              <el-select v-model="ruleForm.deptDirection" filterable clearable placeholder="请选择">
                <el-option label="海外仓" :value="0"></el-option>
                <el-option label="直发" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div style="width: 100%; display: flex">
          <el-form-item label="选品来源:" prop="source" style="width: 45%">
            <el-select v-model="ruleForm.source" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in pro_selection_source"
                :key="item.dizKey"
                :label="item.value"
                :value="item.dizKey"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="type < 6" label="采购参考链接:" prop="supplier">
            <el-input v-model.trim="ruleForm.supplier" clearable></el-input>
          </el-form-item>
        </div>

        <div style="width: 100%; display: flex">
          <el-form-item label="海外版权:" prop="supplier" style="width: 45%">
            <el-input v-model="ruleForm.overseasCopyright" clearable></el-input>
          </el-form-item>
          <el-form-item label="竞品链接:" prop="referenceLinking" style="position: relative">
            <el-input v-model.trim="ruleForm.referenceLinking" clearable></el-input>
            <el-tooltip
              v-model="tooltipFlag"
              placement="top"
              content="可认为是某个平台销量最好的链接"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 9px; right: -7px"
            >
              <i class="el-icon-question" @click="tooltipFlag = !tooltipFlag" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
        </div>

        <!-- 2022.01.10 周五 开发二录新增13个  +  更改字段2个  共15个字段 -->
        <div style="width: 100%; display: flex">
          <el-form-item label="最低售价链接:" prop="lowestPriceLink" style="width: 45%; position: relative">
            <el-input v-model.trim="ruleForm.lowestPriceLink" clearable></el-input>
            <el-tooltip
              v-model="tooltipFlag1"
              placement="top"
              content="同一市场平台内同类产品的最低销售价格的产品链接"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 9px; right: 124px"
            >
              <i class="el-icon-question" @click="tooltipFlag1 = !tooltipFlag1" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="竞品月销量:" prop="monthlySalesQuantity" style="position: relative">
            <el-input v-model.trim="ruleForm.monthlySalesQuantity" clearable></el-input>
            <el-tooltip
              v-model="tooltipFlag2"
              placement="top"
              content="竞品的30天销售数量"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 9px; right: -8px"
            >
              <i class="el-icon-question" @click="tooltipFlag2 = !tooltipFlag2" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
        </div>

        <div style="width: 100%; display: flex">
          <el-form-item label="专利查询词:" prop="patentQuery" style="width: 45%; position: relative">
            <el-input v-model="ruleForm.patentQuery" clearable></el-input>
            <el-tooltip
              v-model="tooltipFlag3"
              placement="top"
              content="查询专利所用的英文词组"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 9px; right: 124px"
            >
              <i class="el-icon-question" @click="tooltipFlag3 = !tooltipFlag3" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="海关HS编码:" prop="customsCode">
            <el-input v-model="ruleForm.customsCode" clearable></el-input>
            <el-tooltip
              v-model="tooltipFlag4"
              placement="top"
              content="报关所用的HS编码"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 9px; right: -8px"
            >
              <i class="el-icon-question" @click="tooltipFlag4 = !tooltipFlag4" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
        </div>

        <div style="width: 100%; display: flex">
          <el-form-item label="产品用途:" prop="proUsage" style="width: 45%; position: relative">
            <el-input v-model="ruleForm.proUsage" clearable></el-input>
            <el-tooltip
              v-model="tooltipFlag5"
              placement="top"
              content="产品的作用"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 9px; right: 124px"
            >
              <i class="el-icon-question" @click="tooltipFlag5 = !tooltipFlag5" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="报关名称:" prop="customsName">
            <el-input v-model="ruleForm.customsName" clearable></el-input>
            <el-tooltip
              v-model="tooltipFlag6"
              placement="top"
              content="HS编码对应的产品名称"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 9px; right: -8px"
            >
              <i class="el-icon-question" @click="tooltipFlag6 = !tooltipFlag6" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
        </div>

        <div style="width: 100%; display: flex">
          <el-form-item label="产品关键词:" prop="proKeywords" style="width: 45%; position: relative">
            <el-input v-model="ruleForm.proKeywords" clearable></el-input>
            <el-tooltip
              v-model="tooltipFlag7"
              placement="top"
              content="英文关键词"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 9px; right: 124px"
            >
              <i class="el-icon-question" @click="tooltipFlag7 = !tooltipFlag7" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
          <!-- 新增是否敏感 isSensitiveWords-->
          <el-form-item label="是否涉及敏感词:">
            <el-radio-group v-model="ruleForm.isSensitiveWords">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div style="width: 100%; display: flex">
          <el-form-item label="是否季节性产品:" label-width="145px" style="width: 45%">
            <el-radio-group v-model="ruleForm.isSeasonal" @change="changeIsSeasonal">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
            <el-tooltip
              v-model="tooltipFlag8"
              placement="top"
              content="确定产品是否有某个季节销量特别高"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 9px; right: 237px"
            >
              <i class="el-icon-question" @click="tooltipFlag8 = !tooltipFlag8" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
          <!-- 新增季节性属性字段 -->
          <el-form-item
            label-width="145px"
            label="季节性属性:"
            v-if="ruleForm.isSeasonal != 0"
            prop="seasonalAttribute"
          >
            <el-checkbox-group v-model="ruleForm.seasonalAttribute">
              <el-checkbox label="1">春</el-checkbox>
              <el-checkbox label="2">夏</el-checkbox>
              <el-checkbox label="3">秋</el-checkbox>
              <el-checkbox label="4">冬</el-checkbox>
            </el-checkbox-group>
            <el-tooltip
              v-model="tooltipFlag13"
              placement="top"
              content="针对于地理位置处于北半球的季节"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 9px; right: -8px"
            >
              <i class="el-icon-question" @click="tooltipFlag13 = !tooltipFlag13" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
        </div>

        <div style="width: 100%; display: flex">
          <el-form-item label="产品参数:" prop="dynamicTags" style="width: 45%">
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              size="small"
              style="margin-right: 5px"
              :disable-transitions="false"
              @close="handleClose(tag)"
              >{{ tag }}</el-tag
            >
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="mini"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            ></el-input>
            <el-button v-else class="button-new-tag" type="primary" size="mini" icon="el-icon-plus" @click="showInput"
              >参数</el-button
            >
          </el-form-item>
        </div>

        <div style="width: 75%">
          <!-- 新增竞品刊登类目 listedCategory-->
          <el-form-item label="竞品刊登类目:" prop="listedCategory" style="position: relative">
            <el-input
              v-model="ruleForm.listedCategory"
              type="textarea"
              :rows="3"
              clearable
              placeholder="请输入备注"
            ></el-input>
            <el-tooltip
              v-model="tooltipFlag9"
              placement="top"
              content="竞品链接的在BS中刊登的类目（全部基于美国Amazon分类）"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 28px; right: -14px"
            >
              <i class="el-icon-question" @click="tooltipFlag9 = !tooltipFlag9" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
        </div>

        <div style="width: 75%">
          <!-- 新增竞品参数列表 parameterList-->
          <el-form-item label="竞品参数列表:" prop="parameterList" style="position: relative">
            <el-input
              v-model="ruleForm.parameterList"
              type="textarea"
              :rows="3"
              clearable
              placeholder="请输入备注"
            ></el-input>
            <el-tooltip
              v-model="tooltipFlag10"
              placement="top"
              content="描述产品的参数"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 28px; right: -14px"
            >
              <i class="el-icon-question" @click="tooltipFlag10 = !tooltipFlag10" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
        </div>

        <div style="width: 75%">
          <!-- 新增销售市场所需合规文件 complianceDocuments-->
          <el-form-item label="销售市场所需合规文件:" prop="complianceDocuments" style="position: relative">
            <el-input
              v-model="ruleForm.complianceDocuments"
              type="textarea"
              :rows="3"
              clearable
              placeholder="请输入备注"
            ></el-input>
            <el-tooltip
              v-model="tooltipFlag11"
              placement="top"
              content="产品在销售市场合规文件"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 28px; right: -14px"
            >
              <i class="el-icon-question" @click="tooltipFlag11 = !tooltipFlag11" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
        </div>
        <div style="width: 75%">
          <!-- 新增竞品差评 proNegativeRatings-->
          <el-form-item label="竞品差评:" style="position: relative">
            <el-input
              v-model="ruleForm.proNegativeRatings"
              type="textarea"
              :rows="3"
              clearable
              placeholder="请输入备注"
            ></el-input>
            <el-tooltip
              v-model="tooltipFlag12"
              placement="top"
              content="竞品链接中包含3星及3星以下的差评中所描述的问题"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 28px; right: -14px"
            >
              <i class="el-icon-question" @click="tooltipFlag12 = !tooltipFlag12" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
        </div>

        <div style="width: 75%">
          <!-- 新增备注 remarks-->
          <el-form-item label="备注:">
            <el-input v-model="ruleForm.remark" type="textarea" :rows="3" clearable placeholder="请输入备注"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!--表单编辑状态 end -->
    <!--表单非编辑状态 start -->
    <div v-else class="sixForm">
      <el-form size="mini" :inline="true" label-width="145px" class="demo-ruleForm">
        <div style="width: 100%; display: flex">
          <el-form-item label="供应商:">
            <div>{{ msgList.supplier ? msgList.supplier : '-' }}</div>
          </el-form-item>
          <!-- <el-form-item label="选品分类:">
            <div>{{ msgList.classify ? msgList.classify : "-" }}</div>
          </el-form-item>-->
          <el-form-item label="选品分类:" style="display: flex; width: 45%">
            <span v-if="msgList.productClassification">
              {{ msgList.productClassification ? msgList.productClassification : '-' }}
            </span>
          </el-form-item>
        </div>

        <div>
          <el-form-item label="选品中文名称:" style="width: 100% !important" v-if="type == 3 || type == 7 || type == 4">
            <div>
              <span v-if="type == 3 || type == 4 || (type == 7 && !isDetail)">{{
                msgList.productCname ? msgList.productCname : '-'
              }}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span v-if="type == 7 && isDetail">
                <el-input
                  v-model="msgList.productCname"
                  clearable
                  maxlength="50"
                  placeholder="请输入产品名称"
                ></el-input>
              </span>
              <!-- 规格、型号字段暂时注释 -->
              <!-- <span>{{ msgList.parameter ? msgList.parameter : "-" }}</span> -->
              <span v-show="type == 3 || type == 4 || type == 7">
                <!-- <span v-if="msgList.plug" class="open">插头电压</span>
                <span v-if="msgList.voltage" class="open">电压(不带插头)</span>-->
                <span v-if="msgList.isElectrified" class="open">带电池</span>
                <span v-if="msgList.isMagnetism" class="open">带磁</span>
                <span v-if="msgList.euroArea" class="open">需要拍照</span>
                <span v-if="msgList.photograph" class="open">需要CE、欧代</span>
                <!-- <span v-if="msgList.isSoldSeparately" class="open">允许单独售卖</span> -->
              </span>
            </div>
          </el-form-item>
          <el-form-item label="SPU:">
            <div>{{ msgList.proSpu ? msgList.proSpu : '-' }}</div>
          </el-form-item>
        </div>

        <div>
          <el-form-item label="选品图片:">
            <span v-if="msgList.pricturePath">
              <el-popover placement="right" trigger="hover" width="250">
                <template #reference>
                  <el-image style="width: 180px; height: 95px" fit="contain" :src="msgList.pricturePath"></el-image>
                </template>
                <el-image :src="msgList.pricturePath" style="width: 400px; height: 300px" fit="contain"></el-image>
              </el-popover>
            </span>
          </el-form-item>
        </div>

        <div style="width: 100%; display: flex">
          <el-form-item label="选品英文名称:" style="display: flex; width: 45%">
            <div>{{ msgList.productEname ? msgList.productEname : '-' }}</div>
          </el-form-item>
          <el-form-item label="运营方式:">
            <div>
              {{ msgList.operateType ? tableTypeComputed(operate_type, msgList.operateType) : '-' }}
            </div>
          </el-form-item>
        </div>

        <div style="width: 100%; display: flex">
          <!-- 新增侧重开发方向: -->
          <el-form-item label="侧重开发方向:" prop="deptDirection">
            <span>
              {{ msgList.deptDirection == '0' ? '海外仓' : msgList.deptDirection == '1' ? '直发' : '-' }}
            </span>
          </el-form-item>
        </div>

        <div style="width: 100%; display: flex">
          <el-form-item label="选品来源:" style="width: 45%">
            <div>
              {{ msgList.sourceId ? tableTypeComputed(pro_selection_source, msgList.sourceId) : '-' }}
            </div>
          </el-form-item>
          <el-form-item label="采购参考链接:" style="display: flex" class="supplierLinksDetails">
            <el-link :underline="false" :href="msgList.supplierLinks" class="links" target="_blank">
              <span style="white-space: normal">
                {{ msgList.supplierLinks ? msgList.supplierLinks : '-' }}
              </span>
            </el-link>
            <i
              v-if="msgList.supplierLinks"
              class="el-icon-document-copy nameHover"
              @click="copyText(msgList.supplierLinks)"
            ></i>
          </el-form-item>
        </div>

        <div style="width: 100%; display: flex">
          <el-form-item label="海外版权:" style="width: 45%">
            <div>{{ msgList.overseasCopyright ? msgList.overseasCopyright : '-' }}</div>
          </el-form-item>
          <el-form-item label="竞品链接:" style="display: flex" class="referenceLinkingDetails">
            <el-link :underline="false" :href="msgList.referenceLinking" class="links" target="_blank">
              <span style="white-space: normal">
                {{ msgList.referenceLinking ? msgList.referenceLinking : '-' }}
              </span>
            </el-link>
            <i
              v-if="msgList.referenceLinking"
              class="el-icon-document-copy nameHover"
              @click="copyText(msgList.referenceLinking)"
            ></i>
          </el-form-item>
        </div>

        <div style="width: 100%; display: flex">
          <el-form-item label="最低售价链接:" prop="lowestPriceLink" style="width: 45%" class="lowestPriceLinkDetails">
            <el-link :underline="false" :href="msgList.lowestPriceLink" class="links" target="_blank">
              {{ msgList.lowestPriceLink ? msgList.lowestPriceLink : '-' }}
            </el-link>
            <i
              v-if="msgList.lowestPriceLink"
              class="el-icon-document-copy nameHover"
              @click="copyText(msgList.lowestPriceLink)"
            ></i>
          </el-form-item>
          <el-form-item label="竞品月销量:" prop="monthlySalesQuantity">
            {{
              msgList.monthlySalesQuantity && msgList.monthlySalesQuantity !== -1 ? msgList.monthlySalesQuantity : '-'
            }}
          </el-form-item>
        </div>

        <div style="width: 100%; display: flex">
          <el-form-item label="专利查询词:" prop="patentQuery" style="width: 45%">{{
            msgList.patentQuery ? msgList.patentQuery : '-'
          }}</el-form-item>
          <el-form-item label="海关HS编码:" prop="customsCode">
            {{ msgList.customsCode ? msgList.customsCode : '-' }}
          </el-form-item>
        </div>

        <div style="width: 100%; display: flex">
          <el-form-item label="产品用途:" prop="proUsage" style="width: 45%">
            {{ msgList.proUsage ? msgList.proUsage : '-' }}
          </el-form-item>
          <el-form-item label="报关名称:" prop="customsName">
            {{ msgList.customsName ? msgList.customsName : '-' }}
          </el-form-item>
        </div>
        <div style="width: 100%; display: flex">
          <el-form-item label="产品关键词:" prop="proKeywords" style="width: 45%">{{
            msgList.proKeywords ? msgList.proKeywords : '-'
          }}</el-form-item>
          <el-form-item label="是否涉及敏感词:" label-width="145px">
            <div>{{ msgList.isSensitiveWords == 0 ? '否' : '是' }}</div>
          </el-form-item>
        </div>
        <div style="width: 100%; display: flex">
          <el-form-item label="是否季节性产品:" style="width: 45%" label-width="145px">
            <div>{{ msgList.isSeasonal == 0 ? '否' : '是' }}</div>
          </el-form-item>
          <!-- 新增季节性属性字段 -->
          <el-form-item label-width="145px" label="季节性属性:" v-if="msgList.isSeasonal != 0">
            <span v-for="item of msgList.seasonalAttribute" :key="item">
              <span v-if="item == 1">春 &nbsp; &nbsp;</span>
              <span v-if="item == 2">夏 &nbsp; &nbsp;</span>
              <span v-if="item == 3">秋 &nbsp; &nbsp;</span>
              <span v-if="item == 4">冬 &nbsp; &nbsp;</span>
            </span>
          </el-form-item>
        </div>

        <!-- <div style="width: 100$; display: flex">
          <el-form-item label="选品平台:" style="width: 45%" v-if="type !== 8 && type !== 3">
            <div v-if="msgList.platform">{{ msgList.platform ? msgList.platform : "-" }}</div>
          </el-form-item>
          <el-form-item label="选品站点:" v-if="type !== 8 && type !== 3">
            <div v-if="msgList.site">{{ msgList.site ? msgList.site : "-" }}</div>
          </el-form-item>
        </div>-->

        <div style="width: 100%; display: flex">
          <el-form-item label="产品参数:" style="width: 45%" prop="dynamicTags">
            <el-tag :key="tag" v-for="tag in dynamicTags" size="small" style="margin-right: 5px" disable-transitions>{{
              tag ? tag : '-'
            }}</el-tag>
          </el-form-item>
        </div>

        <div>
          <!-- 新增竞品刊登类目 listedCategory-->
          <el-form-item
            label="竞品刊登类目:"
            prop="listedCategory"
            label-width="145px"
            style="width: 100%; display: flex"
          >
            <div style="width: 1000px">{{ msgList.listedCategory ? msgList.listedCategory : '-' }}</div>
          </el-form-item>
        </div>

        <div>
          <!-- 新增竞品参数列表 parameterList-->
          <el-form-item
            label="竞品参数列表:"
            prop="parameterList"
            label-width="145px"
            style="width: 100%; display: flex"
          >
            <div style="width: 1000px; white-space: pre-wrap">{{ msgList.parameterList ? msgList.parameterList : "-" }}</div>
          </el-form-item>
        </div>

        <div>
          <!-- 新增销售市场所需合规文件 complianceDocuments-->
          <el-form-item
            label="销售市场所需合规文件:"
            prop="complianceDocuments"
            label-width="145px"
            style="width: 100%; display: flex"
          >
            <div style="width: 1000px">
              {{ msgList.complianceDocuments ? msgList.complianceDocuments : '-' }}
            </div>
          </el-form-item>
        </div>
        <div>
          <!-- 新增竞品差评 proNegativeRatings-->
          <el-form-item label="竞品差评:" label-width="145px" style="width: 100%; display: flex">
            <div style="width: 1000px">
              {{ msgList.proNegativeRatings ? msgList.proNegativeRatings : '-' }}
            </div>
          </el-form-item>
        </div>

        <div>
          <el-form-item label="备注:" label-width="145px" style="width: 100%; display: flex">
            <div style="width: 1000px">{{ msgList.remark ? msgList.remark : '-' }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!--表单非编辑状态 end -->
    <!-- 表格start -->
    <el-form :model="tableDataFrom" :inline-message="true" ref="tableDietRef" class="tableForm">
      <div class="table-header" v-if="type == 3 && isDetail">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="addValuation"
          :disabled="btnFlag"
          :loading="btnFlag"
          >增加</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="revaluation"
          :disabled="btnFlag"
          :loading="btnFlag"
          >重新计价</el-button
        >
      </div>
      <el-table
        v-if="type == 3"
        v-loading="loading"
        :header-cell-style="{
          background: '#fafafa',
          color: '#2d2f30',
          fontWeight: 'bold',
          fontSize: '12px',
        }"
        :data="tableDataFrom.tableData"
        border
        size="mini"
        style="width: 100%"
        class="table_margin"
        id="second-basicinfo-table"
      >
        <!-- prop="platform" -->
        <el-table-column label="平台" show-overflow-tooltip width="150">
          <template #default="{ row, $index }">
            <el-form-item
              v-if="row.lock && $index >= 0"
              :prop="`tableData.${$index}.platformId`"
              :rules="rules.platform"
            >
              <el-select
                v-model="row.platformId"
                filterable
                clearable
                placeholder="平台"
                @focus="editSiteByPlat(row)"
                size="mini"
                @change="platformChange(row)"
              >
                <el-option
                  v-for="item in platformOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <span v-else>{{ row.platform ? row.platform : '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="站点" show-overflow-tooltip width="150">
          <template #default="{ row, $index }">
            <el-form-item v-if="row.lock && $index >= 0" :prop="`tableData.${$index}.siteId}`" :rules="rules.site">
              <el-select
                v-model="row.siteId"
                filterable
                clearable
                placeholder="站点"
                size="mini"
                @change="siteChange(row)"
              >
                <el-option v-for="item in siteOptions" :key="item.id" :label="item.site" :value="item.id"></el-option>
              </el-select>
              <!-- {{row.siteId}} -->
            </el-form-item>
            <span v-else>{{ row.site ? row.site : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最低售价" prop="platformSellingPrice" width="100">
          <template #default="{ row, $index }">
            <el-form-item
              v-if="row.lock && $index >= 0"
              :prop="`tableData.${$index}.platformSellingPrice}`"
              :rules="rules.platformSellingPrice"
            >
              <el-input
                size="mini"
                clearable
                style="width: 85px"
                v-model="row.platformSellingPrice"
                @blur="changeMoneyE(row)"
                placeholder="最低售价"
              ></el-input>
            </el-form-item>
            <span v-else>
              {{ row.platformSellingPrice ? Number(row.platformSellingPrice).toFixed(2) : '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="建议售价" show-overflow-tooltip width="100">
          <template #default="{ row }">
            <span v-if="row.lock && row.suggestPrice !== 0">
              {{ row.suggestPrice ? Number(row.suggestPrice).toFixed(2) : '-' }}
            </span>
            <span v-else> {{ row.suggestPrice ? Number(row.suggestPrice).toFixed(2) : '-' }}{{ row.priceUnit }} </span>
          </template>
        </el-table-column>
        <el-table-column label="币种" show-overflow-tooltip width="150">
          <template #default="{ row, $index }">
            <el-form-item v-if="row.lock && $index >= 0" :prop="`tableData.${$index}.rateId`" :rules="rules.currency">
              <el-select
                v-model="row.rateId"
                filterable
                clearable
                placeholder="币种"
                size="mini"
                @change="changeRateId(row)"
              >
                <el-option
                  v-for="item in rateOptions"
                  :key="item.id"
                  :label="item.rateType + '(' + item.rateName + ')'"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <span v-else>{{ row.rateType ? row.rateType : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参数" width="200">
          <template #default="{ row, $index }">
            <el-form-item
              v-if="row.lock && $index >= 0"
              :prop="`tableData.${$index}.parameter`"
              :rules="rules.parameter"
            >
              <el-select
                v-model="row.parameter"
                filterable
                clearable
                placeholder="参数"
                size="mini"
                @focus="editParameter"
              >
                <el-option v-for="item of dynamicTags" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <span v-else>{{ row.parameter ? row.parameter : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="竞品链接" align="center" width="200">
          <template #default="{ row, $index }">
            <el-form-item v-if="row.lock && $index >= 0" :prop="`tableData.${$index}.linking`" :rules="rules.link">
              <el-input
                size="mini"
                autosize
                type="textarea"
                clearable
                v-model.trim="row.linking"
                placeholder="竞品链接"
              ></el-input>
            </el-form-item>
            <a :href="row.linking" target="_blank" v-else>{{ row.linking ? row.linking : '-' }}</a>
            <!-- <el-link :underline="false" class="urlWidth" :href="row.linking" target="_blank" v-else>{{ row.linking }}</el-link> -->
          </template>
        </el-table-column>
        <el-table-column label="目的仓" width="220">
          <template #default="{ row, $index }">
            <el-form-item
              v-if="row.lock && $index >= 0"
              :prop="`tableData.${$index}.warehouseId`"
              :rules="rules.purpose"
            >
              <el-select size="mini" v-model="row.warehouseId" multiple clearable placeholder="目的仓">
                <el-option
                  v-for="item in wareHouseOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div v-else style="word-wrap: break-word">{{ row.warehouse ? row.warehouse : '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="100">
          <template #default="{ row, $index }">
            <el-form-item
              v-if="row.lock && $index >= 0"
              :prop="`tableData.${$index}.number`"
              :rules="row.transportMode != 4 ? rules.number : rules.number1"
            >
              <el-input
                size="mini"
                style="width: 85px"
                v-model.trim="row.number"
                clearable
                placeholder="数量"
              ></el-input>
            </el-form-item>
            <span v-else>{{ row.number ? Number(row.number) : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运输方式" show-overflow-tooltip width="150">
          <template #default="{ row, $index }">
            <el-form-item
              v-if="row.lock && $index >= 0"
              :prop="`tableData.${$index}.transportMode`"
              :rules="rules.transport"
            >
              <el-select
                size="mini"
                v-model="row.transportMode"
                filterable
                clearable
                placeholder="运输方式"
                @change="changeTransports(row)"
              >
                <el-option
                  v-for="item in logistics_transport_mode"
                  :key="item.dizKey"
                  :label="item.value"
                  :value="item.dizKey"
                ></el-option>
              </el-select>
            </el-form-item>
            <span v-else>
              {{ row.transportMode ? tableTypeComputed(logistics_transport_mode, row.transportMode) : '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="插头电压" show-overflow-tooltip width="150">
          <template #default="{ row, $index }">
            <el-form-item
              v-if="row.lock && $index >= 0"
              :prop="`tableData.${$index}.plugAndVoltage`"
              :rules="rules.plugAndVoltage"
            >
              <el-select size="mini" v-model="row.plugAndVoltage" filterable clearable placeholder="插头电压">
                <el-option v-for="item in plugVoltageOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <span v-else>
              {{ row.plugAndVoltage ? row.plugAndVoltage : '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="毛利润" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.grossProfit ? Number(row.grossProfit).toFixed(2) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="毛利率" show-overflow-tooltip>
          <template #default="{ row }">
            <span style="color: red">
              {{ row.grossMargin ? Number(row.grossMargin).toFixed(2) + '%' : '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="是否有效" show-overflow-tooltip>
          <template #default="{ row, $index }">
            <el-form-item v-if="row.lock">
              <el-switch
                @change="changeSwitch(row, $index)"
                v-model="row.isLicit"
                active-color="#EC828F"
                inactive-color="#A9A9A9"
              />
            </el-form-item>
            <span v-else>{{ row.isLicit == 0 ? '否' : '是' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="200" align="center">
          <template #default="{ row, $index }">
            <el-button
              size="mini"
              v-if="!row.lock && $index > 3 && isDetail"
              type="text"
              icon="el-icon-delete"
              @click="handleDel($index, row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              v-if="!row.lock && isDetail"
              type="text"
              icon="el-icon-edit"
              @click="editInformation($index, row)"
              >编辑</el-button
            >
            <el-button size="mini" v-if="!row.lock" type="text" icon="el-icon-message" @click="getDetails($index, row)"
              >详细</el-button
            >
            <el-button
              size="mini"
              v-if="row.lock && isDetail"
              type="text"
              icon="el-icon-document-checked"
              @click="preservation($index, row)"
              >保存</el-button
            >
            <el-button size="mini" type="text" icon="el-icon-document-copy" @click="rowCopy(row)">复制</el-button>
          </template>
        </el-table-column>
        <el-table-column label="审核结果" show-overflow-tooltip v-if="!isDetail">
          <template #default="{ row }">
            <!-- <span v-if="row.finalStatus == 0">未通过</span> -->
            <span v-if="row.finalStatus == 0">-</span>
            <span v-if="row.finalStatus == 1">通过</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <!-- 表格end -->
    <!-- 增加栏start -->
    <div v-if="type == 3 && isDetail" class="footer-add">
      <el-form
        :model="newForm"
        :rules="rules"
        ref="newFormRef"
        :inline="true"
        size="mini"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div style="display: flex; height: 120px">
          <div class="footer-form-box">
            <el-form-item prop="platform" class="platform">
              <el-select
                v-model="newForm.platform"
                filterable
                clearable
                placeholder="平台"
                @change="changePlatform(newForm)"
              >
                <el-option
                  v-for="item in platformOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="site" class="site">
              <el-select
                v-model="newForm.site"
                placeholder="站点"
                filterable
                clearable
                @change="changeSite"
                @focus="getSiteByPlat"
              >
                <el-option v-for="item in siteOptions" :key="item.id" :label="item.site" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="platformPrice" class="platformPrice">
              <el-input
                v-model.trim="newForm.platformPrice"
                @blur="changeMoney"
                clearable
                placeholder="最低售价"
              ></el-input>
            </el-form-item>
            <el-form-item prop="advicePrice" class="advicePrice">
              <el-input v-model.trim="newForm.advicePrice" :disabled="true" clearable placeholder="建议售价"></el-input>
            </el-form-item>
            <el-form-item prop="currency" class="currency">
              <el-select v-model="newForm.currency" placeholder="币种" filterable clearable @change="changeMoney">
                <el-option
                  v-for="item in rateOptions"
                  :key="item.id"
                  :label="item.rateType + '(' + item.rateName + ')'"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="parameter" class="parameter">
              <el-select v-model="newForm.parameter" filterable clearable placeholder="参数" @focus="getParameter">
                <el-option v-for="item of dynamicTags" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="link" class="link">
              <el-tooltip :disabled="newForm.link == ''" effect="dark" :content="newForm.link" placement="top-start">
                <el-input v-model="newForm.link" autosize type="textarea" clearable placeholder="竞品链接"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="purpose" class="purpose">
              <el-select v-model="newForm.purpose" multiple clearable placeholder="目的仓">
                <el-option
                  v-for="item in wareHouseOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="num" class="num">
              <el-input v-model.number="newForm.num" clearable placeholder="数量"></el-input>
            </el-form-item>
            <el-form-item prop="transport" class="transport">
              <el-select v-model="newForm.transport" @change="changeTransport" filterable clearable placeholder="运输">
                <el-option
                  v-for="item in logistics_transport_mode"
                  :key="item.dizKey"
                  :label="item.value"
                  :value="item.dizKey"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="plugAndVoltage" class="plugAndVoltage">
              <el-select v-model="newForm.plugAndVoltage" filterable clearable placeholder="插头电压">
                <el-option v-for="item in plugVoltageOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="margin-left: 30px">
            <el-form-item class="addBtn">
              <el-button
                type="primary"
                icon="el-icon-delete"
                @click="deleteValuation"
                :disabled="btnFlag"
                :loading="btnFlag"
                >删除</el-button
              >
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <!-- 增加栏end -->
    <el-dialog title="计算明细" v-model="dialogVisible" :close-on-click-modal="false" destroy-on-close>
      <PublicTabel ref="PublicTabel"></PublicTabel>
    </el-dialog>
  </div>
</template>
<script>
import {
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  computed,
  ref,
  inject,
  nextTick,
  onUnmounted,
} from 'vue'
import PublicTabel from './PublicTabel'
import { ElMessage } from 'element-plus'
import { getFathersById, localGet, localSet, documentCopy } from '../../../utils/util'
import changeRoute from '../../../compositionApi/changeRoute'
export default {
  name: 'BasicInfo',
  components: { PublicTabel },
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      props: { multiple: true, value: 'id', label: 'name' },
      ruleForm: {
        seasonalAttribute: [],
        supplierName: '',
        productCname: '',
        productModel: '',
        productRealName: '',
        fileList: [],
        classify: [],
        productClassificationId: '',
        source: '',
        supplier: '',
        operating: '',
        // plug: false,
        // voltage: false,
        isElectrified: false,
        isMagnetism: false,
        euroArea: true,
        photograph: false,
        // isSoldSeparately: false,
        proId: '',
        pricturePath: '',
        overseasCopyright: '',
        remark: '',
        isSensitiveWords: 1,
        deptDirection: '',
        referenceLinking: '',
        // 新增字段 --》
        proNegativeRatings: '',
        complianceDocuments: '',
        parameterList: '',
        listedCategory: '',
        isSeasonal: 0,
        proKeywords: '',
        customsName: '',
        proUsage: '13',
        customsCode: '13',
        patentQuery: '',
        monthlySalesQuantity: '',
        lowestPriceLink: '',
        plugAndVoltage: '',
      },

      dynamicTags: ['无'],
      supplierList: [],
      inputVisible: false,
      inputValue: '',
      rules: {
        proSpu: [{ required: true, message: '请选择spu', trigger: 'blur' }],
        supplier: [
          { required: false, trigger: 'blur' },
          { max: 500, message: '输入长度已超出最大范围500字符' },
        ],
        seasonalAttribute: [{ required: true, message: '请选择季节性属性', trigger: 'change' }],
        complianceDocuments: [{ required: true, message: '请输入', trigger: 'blur' }],
        parameterList: [{ required: true, message: '请输入', trigger: 'blur' }],
        listedCategory: [{ required: true, message: '请输入', trigger: 'blur' }],
        proKeywords: [{ required: true, message: '请输入', trigger: 'blur' }],
        customsName: [{ required: true, message: '请输入', trigger: 'blur' }],
        proUsage: [{ required: true, message: '请输入', trigger: 'blur' }],
        customsCode: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 3, max: 10, message: '输入格式错误', trigger: 'blur' }
        ],
        patentQuery: [{ required: true, message: '请输入', trigger: 'blur' }],
        monthlySalesQuantity: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^([0-9]*)$/, message: '输入格式不正确' },
        ],
        lowestPriceLink: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            pattern: /(http|https):\/\/([\w.]+\/?)\S*/gi,
            message: '输入链接格式不正确，请输入正确链接！',
          },
          { max: 500, message: '输入长度已超出最大范围500字符' },
        ],

        referenceLinking: [
          { required: true, message: '请输入', trigger: 'blur' },
          { max: 500, message: '输入长度已超出最大范围500字符' },
        ],
        supplierName: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        productCname: [{ required: true, message: '请输入选品名称', trigger: 'blur' }],
        fileList: [{ required: true, message: '请选择图片', trigger: 'blur' }],
        classify: [{ required: true, message: '请选择分类', trigger: 'change' }],
        source: [{ required: true, message: '请选择来源', trigger: 'change' }],
        platform: [{ required: true, message: '请选择平台', trigger: 'change' }],
        site: [{ message: '请选择站点', trigger: 'change' }],
        currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
        productRealName: [
          { required: true, message: '请填写产品英文名称', trigger: 'blur' },
          { trigger: 'change', max: 50, message: '英文名称最长不超过50' },
        ],
        platformPrice: [
          { required: true, message: '请填写平台售价', trigger: 'blur' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '输入异常，请重新输入',
          },
        ],
        purpose: [{ required: true, message: '请选择目的仓', trigger: 'change' }],
        parameter: [{ required: true, message: '请填写参数', trigger: 'change' }],
        link: [
          { required: true, message: '请填写链接', trigger: 'change' },
          { max: 500, message: '输入长度已超出最大范围500字符' },
        ],
        num: [
          { required: false, message: '请填写数量', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let ret = /^([0-9]*)$/
              if (!ret.test(value)) {
                callback(new Error('输入正整数'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        number: [
          { required: true, message: '请填写数量', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let ret = /^\+?[1-9]\d*$/
              if (!ret.test(value)) {
                callback(new Error('输入正整数'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        number1: [
          { required: true, message: '请填写数量', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let ret = /^\+?[0-9]\d*$/
              if (!ret.test(value)) {
                callback(new Error('请输入非负整数'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        transport: [{ required: true, message: '请选择运输方式', trigger: 'change' }],
        plugAndVoltage: [{ required: true, message: '请选择插头电压', trigger: 'change' }],
      },
      //选品分类下拉框
      options: [],
      propsClass: {
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        checkStrictly: true,
      },
      pro_selection_source: [],
      tableDataFrom: {
        tableData: [],
      },
      tableData: [],
      operate_type: [],
      rateOptions: [],
      siteOptions: [],
      logistics_transport_mode: [],
      //插头电压下拉框
      plugVoltageOptions: [],
      //spu下拉框
      spuOptions: [],
      spuName: '',
      wareHouseOptions: [],
      platformOptions: [],
      newForm: {
        platform: '',
        site: '',
        rateType: '',
        platformPrice: '',
        advicePrice: '',
        parameter: '',
        link: '',
        purpose: [],
        num: 1,
        transport: '1',
        plugAndVoltage: '',
      },

      type: 1,
      disabled: false,
      msgList: {},
      loading: true,
      isDetail: true,
      requestFlag: true,
      timerOut: null,
      btnFlag: false,
      tooltipFlag: false,
      tooltipFlag1: false,
      tooltipFlag2: false,
      tooltipFlag3: false,
      tooltipFlag4: false,
      tooltipFlag5: false,
      tooltipFlag6: false,
      tooltipFlag7: false,
      tooltipFlag8: false,
      tooltipFlag9: false,
      tooltipFlag10: false,
      tooltipFlag11: false,
      tooltipFlag12: false,
      tooltipFlag13: false,
      row: null
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const { getModuleID } = changeRoute()
    const api = vue.$http
    onBeforeMount(() => {})
    onUnmounted(() => {})
    onMounted(() => {})

    const refData = toRefs(data)
    const productForm = ref(null)
    const UploadImage = ref(null)
    const newFormRef = ref(null)
    const tableDietRef = ref(null)
    const closeTab = inject('closeTab')

    // 获取信息
    const getMsg = (info, row) => {
      data.row = row
      data.disabled = info.disabled ? info.disabled : false
      data.msgList = localGet(`goodsDetails${row.id}`).row
      // data.msgList.plug = data.msgList.plug == 1;
      console.log(data.msgList)
      // data.msgList.voltage = data.msgList.voltage == 1;
      data.msgList.isElectrified = data.msgList.isElectrified == 1
      data.msgList.isMagnetism = data.msgList.isMagnetism == 1
      data.msgList.euroArea = data.msgList.euroArea == 1
      data.msgList.photograph = data.msgList.photograph == 1
      // data.msgList.isSoldSeparately = data.msgList.isSoldSeparately == 1;
      data.isDetail = localGet(`goodsDetails${row.id}`).isDetail != false
      data.tableData = []
      nextTick(() => {
        let file = {
          imgLimit: 1,
          isUpdate: !(data.type == 6 || data.type == 8 || data.type == 4 || data.type == 7),
          fileList: [],
          type: data.type,
          pathName: 'warehouse/develop/developChild/secondRecord/img',
        }

        if (data.type == 3 && data.isDetail) {
          if (data.msgList) {
            file.fileList = { url: data.msgList.pricturePath }
          }
          nextTick(() => {
            UploadImage.value.getImgMsg(file)
          })
        }
      })
      // 分类
      data.options = []
      if (data.isDetail) {
        // 获取供应商列表
        api.provider.getSupplierListAll().then((res) => {
          if (res.code == 200) {
            data.supplierList = res.data
          }
        })
        //获取分类列表
        api.product.getCategoryByPersonInCharge().then((res) => {
          if (res.code == 200) {
            data.options = res.data
          }
        })
      } else {
        //获取分类列表
        api.system.getAllCategoryList({ isDisable: 0 }).then((res) => {
          if (res.code == 200) {
            data.options = res.data
          }
        })
      }
      data.tableData = data.msgList.purchaseDetailVOS

      data.ruleForm.classify = getFathersById(data.ruleForm.classify, data.options)

      data.pro_selection_source = localGet('dictCodeList').pro_selection_source
        ? localGet('dictCodeList').pro_selection_source
        : []
      // 运营方式
      data.operate_type = localGet('dictCodeList').operate_type ? localGet('dictCodeList').operate_type : []
      // 运输方式
      data.logistics_transport_mode = localGet('dictCodeList').logistics_transport_mode
        ? localGet('dictCodeList').logistics_transport_mode
        : []

      data.msgList = data.msgList
      data.type = localGet(`goodsDetails${row.id}`).type
      data.ruleForm.proId = data.msgList.id
      data.ruleForm.fileList = []
      // 产品二录
      if (data.type == 3 || data.type == 7 || data.type == 6 || data.type == 4) {
        nextTick(() => {
          if (data.type == 3) {
            let msg = {
              proId: data.msgList.id,
            }
            if (data.isDetail) {
              vue.$refs.SupplierPublic.getSupplier()
              vue.$refs.SupplierPublic.getName(data.msgList.supplier ? data.msgList.supplier : '')
            }
            getValuationList(msg)
          }
        })

        // 目的仓
        // api.system.getWareHouseList().then(res => {
        //   if (res.code == 200) {
        //     data.wareHouseOptions = res.data;
        //   }
        // });
        api.develop.getDirectAndOverseasWarehouse().then((res) => {
          if (res.code == 200) {
            // console.log(res)
            data.wareHouseOptions = res.data
            console.log(res.data, '目的仓列表')
          }
        })

        // 汇率
        data.rateOptions = []
        api.system.getExchangeList().then((res) => {
          if (res.code == 200) {
            data.rateOptions = res.data
            console.log(res.data, '币种')
          }
        })
        //季节性属性
        data.msgList.seasonalAttribute =
          data.msgList.seasonalAttribute.length > 0 ? data.msgList.seasonalAttribute.split(',') : []
        data.ruleForm.seasonalAttribute = data.msgList.seasonalAttribute

        // 平台
        data.platformOptions = localGet('platformLiist')

        data.ruleForm.supplierName = data.msgList.supplierId == -1 ? '' : data.msgList.supplierId
        data.ruleForm.productCname = data.msgList.productCname ? data.msgList.productCname : ''
        data.ruleForm.proSpu = data.msgList.proSpu
        data.ruleForm.productModel = data.msgList.parameter
        // data.ruleForm.plug = data.msgList.plug == 1;
        // data.ruleForm.voltage = data.msgList.voltage == 1;
        data.ruleForm.isElectrified = data.msgList.isElectrified == 1
        data.ruleForm.isMagnetism = data.msgList.isMagnetism == 1
        data.ruleForm.euroArea = data.msgList.euroArea == 1
        data.ruleForm.photograph = data.msgList.photograph == 1
        // data.ruleForm.isSoldSeparately = data.msgList.isSoldSeparately == 1;
        data.ruleForm.productRealName = data.msgList.productEname ? data.msgList.productEname : ''
        data.ruleForm.referenceLinking = data.msgList.referenceLinking
        data.ruleForm.classify = data.msgList.productClassificationId
        data.ruleForm.source = String(data.msgList.sourceId)
        data.ruleForm.supplier = data.msgList.supplierLinks
        data.ruleForm.fileList.push(data.msgList.pricturePath)
        data.ruleForm.pricturePath = data.msgList.pricturePath
        data.ruleForm.overseasCopyright = data.msgList.overseasCopyright ? data.msgList.overseasCopyright : ''
        data.ruleForm.operating = data.msgList.operateType > -1 ? String(data.msgList.operateType) : '1'
        data.ruleForm.remark = data.msgList.remark ? data.msgList.remark : ''
        data.ruleForm.isSensitiveWords = data.msgList.isSensitiveWords //

        //开发二录新增字段
        data.ruleForm.proNegativeRatings = data.msgList.proNegativeRatings ? data.msgList.proNegativeRatings : ''
        data.ruleForm.complianceDocuments = data.msgList.complianceDocuments
        data.ruleForm.parameterList = data.msgList.parameterList
        data.ruleForm.listedCategory = data.msgList.listedCategory
        data.ruleForm.isSeasonal = data.msgList.isSeasonal == 0 ? 0 : data.msgList.isSeasonal == 1 ? 1 : 0
        data.ruleForm.proKeywords = data.msgList.proKeywords
        data.ruleForm.customsName = data.msgList.customsName
        data.ruleForm.proUsage = data.msgList.proUsage
        data.ruleForm.customsCode = data.msgList.customsCode
        data.ruleForm.patentQuery = data.msgList.patentQuery
        data.ruleForm.monthlySalesQuantity =
          data.msgList.monthlySalesQuantity == -1 ? '' : data.msgList.monthlySalesQuantity
        data.ruleForm.lowestPriceLink = data.msgList.lowestPriceLink
        data.ruleForm.deptDirection = data.msgList.deptDirection
        if (data.type == 3 || data.type == 4 || data.type == 7) {
          data.dynamicTags = data.msgList.proParameter !== '' ? data.msgList.proParameter.split(',') : ['无']
        }
      }

      // 通过选品分类获取SPU
      getSpuByCategory()
    }

    // 获取参数列表
    const getParameter = () => {
      if (data.dynamicTags.length < 1) {
        data.dynamicTags = ['无']
      }
    }

    // 跳转供应商  getModuleID此方法用于路由回显高亮
    const jump = (url, path) => {
      let query = {
        isDev: 1,
        fid: '',
      }
      getModuleID(url, path, query)
    }
    const jumpSPU = (url, path) => {
      getModuleID(url, path)
    }

    // 站点change事件
    const siteChange = (e) => {
      // e.warehouseId = "";
      // api.develop.getDefaultWarehouse({ siteId: e.siteId }).then(res => {
      //   console.log(res);
      //   if (res.code == 200 && typeof res.data == "string") {
      //     data.wareHouseOptions.map(item => {
      //       if (item.id == res.data) {
      //         e.warehouseId = String(item.id);
      //       }
      //     });
      //   } else if (res.msg == "暂无承载数据" && res.code == 200) {
      //     e.warehouseId = "";
      //     vue.$message({
      //       type: "warning",
      //       message: res.msg
      //     });
      //   }
      // });
      //美元
      if (data.siteOptions.find((item) => item.id == e.siteId).site == '美国-US') {
        let arr1 = data.rateOptions.find((item) => item.rateType == 'USD')
        e.rateId = arr1.id
        if (e.transportMode == 4) {
          let tempware = data.wareHouseOptions.find((item) => item.name == '瑞安仓')
          e.warehouseId = [tempware.id]
        } else {
          let tempware = data.wareHouseOptions.find((item) => item.name == '易可达美西仓')
          e.warehouseId = [tempware.id]
        }
      }
      //英镑
      if (data.siteOptions.find((item) => item.id == e.siteId).site == '英国-UK') {
        let arr1 = data.rateOptions.find((item) => item.rateType == 'GBP')
        e.rateId = arr1.id
        if (e.transportMode == 4) {
          let tempware = data.wareHouseOptions.find((item) => item.name == '瑞安仓')
          e.warehouseId = [tempware.id]
        } else {
          let tempware = data.wareHouseOptions.find((item) => item.name == '易可达英国仓')
          e.warehouseId = [tempware.id]
        }
      }
      //澳元
      if (data.siteOptions.find((item) => item.id == e.siteId).site == '澳大利亚-AU') {
        let arr1 = data.rateOptions.find((item) => item.rateType == 'AUD')
        e.rateId = arr1.id
        if (e.transportMode == 4) {
          let tempware = data.wareHouseOptions.find((item) => item.name == '瑞安仓')
          e.warehouseId = [tempware.id]
        } else {
          let tempware = data.wareHouseOptions.find((item) => item.name == '易可达澳洲仓')
          e.warehouseId = [tempware.id]
        }
      }
      // 欧元
      if (
        data.siteOptions.find((item) => item.id == e.siteId).site == '德国-DE' ||
        data.siteOptions.find((item) => item.id == e.siteId).site == '法国-FR' ||
        data.siteOptions.find((item) => item.id == e.siteId).site == '意大利-IT' ||
        data.siteOptions.find((item) => item.id == e.siteId).site == '西班牙-ES'
      ) {
        let arr1 = data.rateOptions.find((item) => item.rateType == 'EUR')
        e.rateId = arr1.id
        if (e.transportMode == 4) {
          let tempware = data.wareHouseOptions.find((item) => item.name == '瑞安仓')
          e.warehouseId = [tempware.id]
        } else {
          let tempware = data.wareHouseOptions.find((item) => item.name == '易可达捷克仓')
          e.warehouseId = [tempware.id]
        }
      }
      e.plugAndVoltage = ''
      getPlugAndVoltageBySiteName(e.siteId)
    }
    const onChange = () => {
      data.ruleForm.proSpu = ''
      data.spuOptions = []
      getSpuByCategory()
    }

    const onSPUChange = () => {
      data.ruleForm.classify = null
      getCategoryBySpu()
    }

    // 通过选品分类获取SPU
    const getSpuByCategory = () => {
      let id = ''
      if (typeof data.ruleForm.classify == 'string') {
        id = data.ruleForm.classify
      } else if (typeof data.ruleForm.classify == 'object' && data.ruleForm.classify !== null) {
        console.log('aaaaaaaaaaa', data.ruleForm.classify)
        let i = data.ruleForm.classify.length - 1
        id = data.ruleForm.classify[i]
      }
      api.develop
        .getSpuByCategory({
          sysCategoryId: id,
        })
        .then((res) => {
          if (res.code == 200) {
            data.spuOptions = res.data
            data.spuOptions.map((item) => {
              item.label = item.spuCode + '(' + item.spuName + ')'
            })
          }
        })
    }

    //通过SPU获取选品分类
    const getCategoryBySpu = () => {
      if (data.ruleForm.proSpu == '') {
        return
      }
      api.develop.getCategoryBySpu({ spuEncode: data.ruleForm.proSpu }).then((res) => {
        if (res.code == 200) {
          console.log('选品分类', res)
          data.ruleForm.classify = res.data.split(',')
        }
      })
    }

    // 平台change事件
    const platformChange = (e) => {
      data.siteOptions = []
      e.siteId = ''
      e.warehouseId = ''
      let msg = {
        platformId: String(e.platformId),
        isEnglish: false,
        includeFullSite: false,
        isLimit: false,
      }
      api.system.getSiteByPlat(msg).then((res) => {
        if (res.code == 200) {
          data.siteOptions = res.data
          console.log(res.data)
        } else {
          vue.$message({
            type: 'warning',
            message: res.msg,
          })
        }
      })
    }

    //新增计价信息 平台change事件 针对复制情况
    const changePlatform = (e) => {
      data.siteOptions = []
      e.site = ''
      e.purpose = ''
      let msg = {
        platformId: String(data.newForm.platform),
        isEnglish: false,
        includeFullSite: false,
        isLimit: false,
      }
      if (data.newForm.platform) {
        api.system.getSiteByPlat(msg).then((res) => {
          if (res.code == 200) {
            data.siteOptions = res.data
          } else {
            vue.$message({
              type: 'warning',
              message: res.msg,
            })
          }
        })
      }
    }

    // 编辑保存按钮
    const preservation = (e, i) => {
      data.btnFlag = true
      console.log(i)
      console.log('保存时', data.ruleForm)
      if (data.requestFlag) {
        tableDietRef.value.validate((f) => {
          if (f) {
            console.log(i.siteId)
            let valuation = {
              id: i.id,
              linking: i.linking,
              number: Number(i.number),
              parameter: i.parameter,
              platformSellingPrice: Number(i.platformSellingPrice),
              productId: data.msgList.id,
              rateId: i.rateId,
              siteId: i.siteId,
              suggestPrice: Number(i.suggestPrice),
              transportMode: Number(i.transportMode),
              platformId: i.platformId,
              warehouseId: i.warehouseId.join(','),
              deptDirection: i.deptDirection,
              plugAndVoltage: i.plugAndVoltage,
            }
            api.valuation
              .editUpdate(valuation)
              .then((res) => {
                if (res.code == 200) {
                  ElMessage.success({
                    message: res.msg,
                    type: 'success',
                  })
                  let msg = {
                    proId: data.msgList.id,
                  }

                  if (data.msgList.purchaseDetailVOS.length > 0) {
                    getValuationList(msg)
                  } else {
                    ElMessage.error({
                      message: res.msg,
                      type: 'error',
                    })
                  }
                } else {
                  ElMessage.error({
                    message: res.msg,
                    type: 'error',
                  })
                }
              })
              .catch((err) => {})
            data.btnFlag = false
          } else {
            data.btnFlag = false
          }
        })
      } else {
        vue.$message.warning('请填写正确平台售价信息!')
      }
    }

    // 新增站点事件，请求目的仓字典
    const changeSite = (event) => {
      // api.develop.getDefaultWarehouse({ siteId: event }).then(res => {
      //   if (res.code == 200 && typeof res.data == "string") {
      //     data.wareHouseOptions.map(item => {
      //       if (item.id == res.data) {
      //         data.newForm.purpose = item.id;
      //       }
      //     });
      //   } else if (res.msg == "暂无承载数据" && res.code == 200) {
      //     data.newForm.purpose = "";
      //     vue.$message({
      //       type: "warning",
      //       message: res.msg
      //     });
      //   }
      // });
      console.log('站点改变时data.newForm', data.newForm)
      console.log('站点改变时event', event)
      data.newForm.plugAndVoltage = ''
      //美元
      if (data.siteOptions.find((item) => item.id == event).site == '美国-US') {
        let arr1 = data.rateOptions.find((item) => item.rateType == 'USD')
        data.newForm.currency = arr1.id
        if (data.newForm.transport == '4') {
          let tempware = data.wareHouseOptions.find((item) => item.name == '瑞安仓')
          data.newForm.purpose = [tempware.id]
        } else {
          let tempware = data.wareHouseOptions.find((item) => item.name == '易可达美西仓')
          data.newForm.purpose = [tempware.id]
        }
      }
      //英镑
      if (data.siteOptions.find((item) => item.id == event).site == '英国-UK') {
        let arr1 = data.rateOptions.find((item) => item.rateType == 'GBP')
        data.newForm.currency = arr1.id
        if (data.newForm.transport == '4') {
          let tempware = data.wareHouseOptions.find((item) => item.name == '瑞安仓')
          data.newForm.purpose = [tempware.id]
        } else {
          let tempware = data.wareHouseOptions.find((item) => item.name == '易可达英国仓')
          data.newForm.purpose = [tempware.id]
        }
      }
      //澳元
      if (data.siteOptions.find((item) => item.id == event).site == '澳大利亚-AU') {
        let arr1 = data.rateOptions.find((item) => item.rateType == 'AUD')
        data.newForm.currency = arr1.id
        if (data.newForm.transport == '4') {
          let tempware = data.wareHouseOptions.find((item) => item.name == '瑞安仓')
          data.newForm.purpose = [tempware.id]
        } else {
          let tempware = data.wareHouseOptions.find((item) => item.name == '易可达澳洲仓')
          data.newForm.purpose = [tempware.id]
        }
      }
      // 欧元
      if (
        data.siteOptions.find((item) => item.id == event).site == '德国-DE' ||
        data.siteOptions.find((item) => item.id == event).site == '法国-FR' ||
        data.siteOptions.find((item) => item.id == event).site == '意大利-IT' ||
        data.siteOptions.find((item) => item.id == event).site == '西班牙-ES'
      ) {
        let arr1 = data.rateOptions.find((item) => item.rateType == 'EUR')
        data.newForm.currency = arr1.id
        if (data.newForm.transport == '4') {
          let tempware = data.wareHouseOptions.find((item) => item.name == '瑞安仓')
          data.newForm.purpose = [tempware.id]
        } else {
          let tempware = data.wareHouseOptions.find((item) => item.name == '易可达捷克仓')
          data.newForm.purpose = [tempware.id]
        }
      }
      // if (event=="1430728975515144194") {
      //   data.newForm.currency="1393112154804076546"
      // }
      getPlugAndVoltageBySiteName(event)
    }

    //编辑运输方式事件
    const changeTransports = (e) => {
      if (e.transportMode == '4') {
        let tempware = data.wareHouseOptions.find((item) => item.name == '瑞安仓')
        e.warehouseId = [tempware.id]
      } else {
        e.warehouseId = []
      }
    }
    //运输方式事件
    const changeTransport = (e) => {
      if (e == '4') {
        let tempware = data.wareHouseOptions.find((item) => item.name == '瑞安仓')
        data.newForm.purpose = [tempware.id]
      } else {
        data.newForm.purpose = []
      }
    }

    //rowCopy 点击复制当前行
    const rowCopy = (row) => {
      data.newForm.platform = row.platformId
      data.newForm.site = row.siteId
      data.newForm.platformPrice = Number(row.platformSellingPrice).toFixed(2)
      data.newForm.advicePrice = row.suggestPrice
      data.newForm.currency = row.rateId
      data.newForm.parameter = row.parameter
      data.newForm.link = row.linking
      data.newForm.purpose = row.warehouseId
      data.newForm.num = Number(row.number)
      data.newForm.transport = String(row.transportMode)
      data.newForm.plugAndVoltage = String(row.plugAndVoltage)
      getSiteByPlat()
      console.log('复制时data.newForm', data.newForm)
      getPlugAndVoltageBySiteName(data.newForm.site)
    }

    // 根据平台展示站点
    const getSiteByPlat = () => {
      if (data.newForm.platform) {
        let msg = {
          platformId: String(data.newForm.platform),
          isEnglish: false,
          includeFullSite: false,
          isLimit: false,
        }
        api.system.getSiteByPlat(msg).then((res) => {
          if (res.code == 200) {
            data.siteOptions = res.data
          } else {
            vue.$message({
              type: 'warning',
              message: res.msg,
            })
          }
        })
      } else {
        ElMessage.warning({
          message: '请先选择平台',
          type: 'warning',
        })
      }
    }

    // 编辑时 获取参数列表
    const editParameter = () => {
      if (data.dynamicTags.length < 1) {
        ElMessage.warning({
          message: '请添加产品参数',
          type: 'warning',
        })
      }
    }

    // 编辑时 平台展示站点
    const editSiteByPlat = (e) => {
      if (e.platformId) {
        let msg = {
          platformId: String(e.platformId),
          isEnglish: false,
          includeFullSite: false,
          isLimit: false,
        }
        api.system.getSiteByPlat(msg).then((res) => {
          if (res.code == 200) {
            data.siteOptions = res.data
          } else {
            vue.$message({
              type: 'warning',
              message: res.msg,
            })
          }
        })
      } else {
        ElMessage.warning({
          message: '请先选择平台',
          type: 'warning',
        })
      }
    }

    // 获取计价表格数据
    const getValuationList = (msg) => {
      resetFormNew()
      data.loading = true
      api.valuation
        .getAllValuationList(msg)
        .then((res) => {
          if (res.code == 200) {
            res.data.map((item) => {
              if (item.warehouseId) {
                item.warehouseId = item.warehouseId.split(',')
              }
              item.isLicit = item.isLicit != 0
            })
            data.tableDataFrom.tableData = res.data
            console.log(data.tableDataFrom.tableData)
            data.loading = false
            resetFormNew()
          } else {
            vue.$message({
              type: 'warning',
              message: res.msg,
            })
          }
        })
        .catch(() => {
          data.loading = false
        })
    }

    // 计算建议售价
    const changeMoney = () => {
      if (data.newForm.currency && data.newForm.platformPrice) {
        let msg = {
          rateId: data.newForm.currency,
          referencePrice: data.newForm.platformPrice,
        }
        api.valuation.getTheSuggestedPrice(msg).then((res) => {
          if (res.code == 200) {
            data.newForm.advicePrice = (res.data * 1).toFixed(2)
          }
        })
      } else {
        vue.$message.warning('请输入平台售价并选择币种！')
      }
    }

    // 编辑建议售价
    const changeMoneyE = (i) => {
      let test = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (i.platformSellingPrice == '' || Number(i.platformSellingPrice) <= 0) {
        vue.$message.warning('平台售价不能为空或小于等于0')
      } else {
        if (!test.test(i.platformSellingPrice)) {
          vue.$message.warning('平台售价格式输入错误，请保留小数点后两位！')
          data.requestFlag = false
        } else {
          i.platformSellingPrice = Number(i.platformSellingPrice * 1)
          let msg = {
            rateId: i.rateId,
            referencePrice: i.platformSellingPrice,
          }
          api.valuation.getTheSuggestedPrice(msg).then((res) => {
            if (res.code == 200) {
              i.suggestPrice = (res.data * 1).toFixed(2)
            }
          })

          data.requestFlag = true
        }
      }
    }

    const changeRateId = (i) => {
      let msg = {
        rateId: i.rateId,
        referencePrice: i.platformSellingPrice,
      }
      api.valuation.getTheSuggestedPrice(msg).then((res) => {
        if (res.code == 200) {
          i.suggestPrice = (res.data * 1).toFixed(2)
        }
      })
    }

    // 重置表单
    const resetFormNew = () => {
      // nextTick(() => {
      if (newFormRef.value) {
        newFormRef.value.resetFields()
        newFormRef.value.clearValidate()
      }
      data.newForm.link = ''
      data.newForm.parameter = ''
      data.newForm.platformPrice = ''
      data.newForm.currency = ''
      data.newForm.site = ''
      data.newForm.advicePrice = ''
      data.newForm.transport = '1'
      data.newForm.purpose = ''
      data.newForm.platform = ''
      data.newForm.num = 1
      data.newForm.deptDirection = ''

      // });
    }

    // 新增编辑计价信息
    const editInformation = (i, e) => {
      e.platformSellingPrice = Number(e.platformSellingPrice).toFixed(2)
      e.transportMode = String(e.transportMode)
      e.lock = true
      // if (typeof e.warehouseId ===
      e.warehouseId = e.warehouseId ? e.warehouseId.toString().split(',') : []
      // }
      api.develop.getDefaultWarehouse({ siteId: e.siteId }).then((res) => {
        if (res.code == 200 && typeof res.data === 'string') {
          // data.wareHouseOptions.map(item => {
          //   if (item.id == res.data) {
          //     e.warehouseId = String(item.id);
          //   }
          // });
        } else if (res.msg == '暂无承载数据' && res.code == 200) {
          // e.warehouseId = "";
          // vue.$message({
          //   type: "warning",
          //   message: res.msg,
          // });
        }
      })
      //通过站点获取插头电压下拉框
      console.log('编辑时e', e)
      getPlugAndVoltageBySiteName(e.siteId)

      if (e.platform) {
        let msg = {
          platformId: String(e.platformId),
          isEnglish: false,
          includeFullSite: false,
          isLimit: false,
        }
        api.system.getSiteByPlat(msg).then((res) => {
          if (res.code == 200) {
            data.siteOptions = res.data
            data.siteOptions.map((item) => {
              if (item.id == e.siteId) {
                e.siteId = item.id
              }
            })
          } else {
            vue.$message({
              type: 'warning',
              message: res.msg,
            })
          }
        })
      } else {
        ElMessage.warning({
          message: '请先选择平台',
          type: 'warning',
        })
      }
    }

    // 新增计价信息
    const addValuation = () => {
      newFormRef.value.validate((valid) => {
        if (valid) {
          data.btnFlag = true
          let msg = {
            linking: data.newForm.link,
            number: Number(data.newForm.num),
            parameter: data.newForm.parameter,
            platformSellingPrice: Number(data.newForm.platformPrice),
            productId: data.msgList.id, //
            rateId: data.newForm.currency,
            siteId: data.newForm.site,
            suggestPrice: Number(data.newForm.advicePrice),
            transportMode: Number(data.newForm.transport),
            warehouseId: data.newForm.purpose.join(','),
            platformId: data.newForm.platform, // 1393074472803713026
            plugAndVoltage: data.newForm.plugAndVoltage,
          }
          api.valuation
            .addValuation(msg)
            .then((res) => {
              console.log('新增计价信息', res)
              data.btnFlag = false
              if (res.code == 200) {
                ElMessage.success({
                  message: res.msg,
                  type: 'success',
                })
                let msg = {
                  proId: data.msgList.id,
                }
                resetFormNew()

                if (data.msgList.purchaseDetailVOS.length > 0) {
                  getValuationList(msg)
                } else {
                  ElMessage.error({
                    message: res.msg,
                    type: 'error',
                  })
                }
              } else {
                ElMessage.error({
                  message: res.msg,
                  type: 'error',
                })
              }
            })
            .catch((error) => {
              data.btnFlag = false
            })
        }
      })
    }
    //通过站点获取插头电压
    const getPlugAndVoltageBySiteName = (site) => {
      api.develop.getPlugAndVoltageBySiteName({ siteId: site }).then((res) => {
        if (res.code == 200) {
          data.plugVoltageOptions = res.data
        }
      })
    }
    // 查看详情
    const getDetails = (index, row) => {
      data.dialogVisible = true
      nextTick(() => {
        console.log('row111111111', row)
        // 写入操作
        vue.$refs.PublicTabel.getMsg(row.id, data.row)
      })
    }
    // 删除计价信息
    const handleDel = (index, row) => {
      api.valuation.delValuation({ id: row.id }).then((res) => {
        console.log('删除计价信息', res)
        if (res.code == 200) {
          ElMessage.success({
            message: res.msg,
            type: 'success',
          })
          let msg = {
            proId: data.msgList.id,
          }
          if (data.msgList.purchaseDetailVOS.length > 0) {
            getValuationList(msg)
          }
        } else {
          vue.$message({
            type: 'warning',
            message: res.msg,
          })
        }
      })
    }
    // 提交
    const onSubmit = (status) => {
      console.log(data.ruleForm)
      productForm.value.validate((valid) => {
        // draft   提交--2   草稿--3
        if (valid) {
          let msg = {
            euroArea: data.ruleForm.euroArea ? 1 : 0,
            // plug: data.ruleForm.plug ? 1 : 0,
            // voltage: data.ruleForm.voltage ? 1 : 0,
            isElectrified: data.ruleForm.isElectrified ? 1 : 0,
            isMagnetism: data.ruleForm.isMagnetism ? 1 : 0,
            photograph: data.ruleForm.photograph ? 1 : 0,
            // isSoldSeparately: data.ruleForm.isSoldSeparately ? 1 : 0,
            parameter: data.ruleForm.productModel,
            sourceId: data.ruleForm.source,
            proSpu: data.ruleForm.proSpu,
            operateType: data.ruleForm.operating,
            pricturePath: data.ruleForm.pricturePath,
            productClassificationId: data.ruleForm.classify,
            productCname: data.ruleForm.productCname ? data.ruleForm.productCname.trim() : '',
            productEname: data.ruleForm.productRealName ? data.ruleForm.productRealName.trim() : '',
            status: status,
            supplierLinks: data.ruleForm.supplier,
            referenceLinking: data.ruleForm.referenceLinking,
            proId: data.ruleForm.proId,
            overseasCopyright: data.ruleForm.overseasCopyright ? data.ruleForm.overseasCopyright.trim() : '',
            proParameter: String(data.dynamicTags),
            supplierId: data.ruleForm.supplierName,
            remark: data.ruleForm.remark ? data.ruleForm.remark.trim() : '',
            isSensitiveWords: data.ruleForm.isSensitiveWords,
            deptDirection: data.ruleForm.deptDirection,
            seasonalAttribute:
              data.ruleForm.seasonalAttribute.length > 0 ? data.ruleForm.seasonalAttribute.join(',') : '',

            proNegativeRatings: data.ruleForm.proNegativeRatings ? data.ruleForm.proNegativeRatings.trim() : '',
            complianceDocuments: data.ruleForm.complianceDocuments ? data.ruleForm.complianceDocuments.trim() : '',
            parameterList: data.ruleForm.parameterList ? data.ruleForm.parameterList.trim() : '',
            listedCategory: data.ruleForm.listedCategory ? data.ruleForm.listedCategory.trim() : '',
            isSeasonal: data.ruleForm.isSeasonal,
            proKeywords: data.ruleForm.proKeywords ? data.ruleForm.proKeywords.trim() : '',
            customsName: data.ruleForm.customsName ? data.ruleForm.customsName.trim() : '',
            proUsage: data.ruleForm.proUsage ? data.ruleForm.proUsage.trim() : '',
            customsCode: data.ruleForm.customsCode ? data.ruleForm.customsCode.trim() : '',
            patentQuery: data.ruleForm.patentQuery ? data.ruleForm.patentQuery.trim() : '',
            monthlySalesQuantity: data.ruleForm.monthlySalesQuantity,
            lowestPriceLink: data.ruleForm.lowestPriceLink ? data.ruleForm.lowestPriceLink.trim() : '',
          }
          if (Array.isArray(data.ruleForm.classify)) {
            msg.productClassificationId = data.ruleForm.classify.pop()
          }

          // 产品二录
          api.develop.secondSubmit(msg).then((res) => {
            if (res.code == 200) {
              ElMessage.success({
                message: res.msg,
                type: 'success',
              })
              console.log('parent', vue.$parent)
              closeTab()
              resetForm()
            } else {
              vue.$message({
                type: 'warning',
                message: res.msg,
              })
            }
          })
        }
      })
    }
    // 提交草稿不校验
    const onSubmitDraf = (status) => {
      // productForm.value.validate(valid => {
      // draft   提交--2   草稿--3
      // if (valid) {
      let msg = {
        euroArea: data.ruleForm.euroArea ? 1 : 0,
        // voltage: data.ruleForm.voltage ? 1 : 0,
        isElectrified: data.ruleForm.isElectrified ? 1 : 0,
        isMagnetism: data.ruleForm.isMagnetism ? 1 : 0,
        // plug: data.ruleForm.plug ? 1 : 0,
        photograph: data.ruleForm.photograph ? 1 : 0,
        // isSoldSeparately: data.ruleForm.isSoldSeparately ? 1 : 0,
        parameter: data.ruleForm.productModel,
        sourceId: data.ruleForm.source,
        proSpu: data.ruleForm.proSpu,
        operateType: data.ruleForm.operating,
        pricturePath: data.ruleForm.pricturePath,
        productClassificationId: data.ruleForm.classify,
        productCname: data.ruleForm.productCname ? data.ruleForm.productCname.trim() : '',
        productEname: data.ruleForm.productRealName ? data.ruleForm.productRealName.trim() : '',
        status: status,
        supplierLinks: data.ruleForm.supplier,
        referenceLinking: data.ruleForm.referenceLinking,
        proId: data.ruleForm.proId,
        overseasCopyright: data.ruleForm.overseasCopyright ? data.ruleForm.overseasCopyright.trim() : '',
        proParameter: String(data.dynamicTags),
        supplierId: data.ruleForm.supplierName,
        remark: data.ruleForm.remark ? data.ruleForm.remark.trim() : '',
        isSensitiveWords: data.ruleForm.isSensitiveWords,
        deptDirection: data.ruleForm.deptDirection,
        seasonalAttribute: data.ruleForm.seasonalAttribute.length > 0 ? data.ruleForm.seasonalAttribute.join(',') : '',

        proNegativeRatings: data.ruleForm.proNegativeRatings ? data.ruleForm.proNegativeRatings.trim() : '',
        complianceDocuments: data.ruleForm.complianceDocuments ? data.ruleForm.complianceDocuments.trim() : '',
        parameterList: data.ruleForm.parameterList ? data.ruleForm.parameterList.trim() : '',
        listedCategory: data.ruleForm.listedCategory ? data.ruleForm.listedCategory.trim() : '',
        isSeasonal: data.ruleForm.isSeasonal,
        proKeywords: data.ruleForm.proKeywords ? data.ruleForm.proKeywords.trim() : '',
        customsName: data.ruleForm.customsName ? data.ruleForm.customsName.trim() : '',
        proUsage: data.ruleForm.proUsage ? data.ruleForm.proUsage.trim() : '',
        customsCode: data.ruleForm.customsCode ? data.ruleForm.customsCode.trim() : '',
        patentQuery: data.ruleForm.patentQuery ? data.ruleForm.patentQuery.trim() : '',
        monthlySalesQuantity: data.ruleForm.monthlySalesQuantity,
        lowestPriceLink: data.ruleForm.lowestPriceLink ? data.ruleForm.lowestPriceLink.trim() : '',
      }
      if (Array.isArray(data.ruleForm.classify)) {
        msg.productClassificationId = data.ruleForm.classify.pop()
      }

      // 产品二录
      api.develop.secondSubmit(msg).then((res) => {
        if (res.code == 200) {
          ElMessage.success({
            message: res.msg,
            type: 'success',
          })
          console.log('parent', vue.$parent)
          closeTab()
          resetForm()
        } else {
          vue.$message({
            type: 'warning',
            message: res.msg,
          })
        }
      })
      // }
      // });
    }
    // 获取图片url
    const receive = (e) => {
      data.ruleForm.pricturePath = e.link ? e.link : ''
    }
    // 重置表单
    const resetForm = () => {
      if (productForm.value) {
        productForm.value.resetFields()
        productForm.value.clearValidate()
      }
    }
    // 上传文件
    const uploadTrigger = () => {
      let info = {
        import: 'secondUploadFile',
        servers: 'develop',
      }
      vue.$refs.UploadFile.uploadTrigger(info)
    }

    // 获取文件url
    const fileUpload = (e) => {
      console.log('获取文件路径', e)
      data.ruleForm.overseasCopyright = e.data[0].path
    }

    const handleClose = (tag) => {
      data.dynamicTags.splice(data.dynamicTags.indexOf(tag), 1)
    }

    const showInput = () => {
      data.inputVisible = true
      nextTick(() => {
        vue.$refs.saveTagInput.input.focus()
      })
    }

    const handleInputConfirm = () => {
      let inputValue = data.inputValue ? data.inputValue.trim() : ''
      if (inputValue) {
        data.dynamicTags.push(inputValue)
      }
      data.inputVisible = false
      data.inputValue = ''
    }

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (option, dizKey) {
        if (option.length > 1 && dizKey !== -1) {
          for (let item of option) {
            if (dizKey == item.dizKey) {
              return item.value
            }
          }
        }
      }
    })

    // 供应商分发事件接收
    const handChange = (e) => {
      data.ruleForm.supplierName = e
    }

    // 计价信息表中 swicth开关change事件
    const changeSwitch = (e, i) => {
      console.log(e, i)
      let state = e.isLicit ? 1 : 0
      let vid = e.id
      api.develop.updateLicit({ state: state, vid: vid }).then((res) => {
        if (res.code == 200) {
          console.log(res)
          e.lock = false
          vue.$message({
            type: 'success',
            message: res.msg,
          })
        } else {
          vue.$message({
            type: 'error',
            message: res.msg,
          })
        }
      })
    }

    // //二录新增计价信息新增按钮
    // const openAddValuation = () =>{
    //   data.AddValuationPopFlag = true
    // }

    // 复制链接
    const copyText = (text) => {
      documentCopy(text)
    }

    //开发二录重新计价
    const revaluation = () => {
      let arr = []
      data.btnFlag = true
      console.log(data.tableDataFrom.tableData)
      data.tableDataFrom.tableData.map((i) => {
        let valuation = {
          id: i.id,
          linking: i.linking,
          number: Number(i.number),
          parameter: i.parameter,
          platformSellingPrice: Number(i.platformSellingPrice),
          productId: data.msgList.id,
          rateId: i.rateId,
          siteId: i.siteId,
          suggestPrice: Number(i.suggestPrice),
          transportMode: Number(i.transportMode),
          platformId: i.platformId,
          warehouseId: i.warehouseId.join(','),
        }
        arr.push(valuation)
      })
      console.log(arr)
      api.develop
        .recalculateValuationByProId(arr)
        .then((res) => {
          if (res.code == 200) {
            vue.$message.success(res.msg)
            data.btnFlag = false
            getValuationList({ proId: data.msgList.id })
          } else {
            data.btnFlag = false
            vue.$message.warning(res.msg)
          }
        })
        .catch((err) => {
          data.btnFlag = false
        })
    }

    //关闭标注提示tag
    const closedtooltipRef = () => {
      if (vue.$refs.tooltipRef) {
        nextTick(() => {
          data.tooltipFlag = false
          data.tooltipFlag1 = false
          data.tooltipFlag2 = false
          data.tooltipFlag3 = false
          data.tooltipFlag4 = false
          data.tooltipFlag5 = false
          data.tooltipFlag6 = false
          data.tooltipFlag7 = false
          data.tooltipFlag8 = false
          data.tooltipFlag9 = false
          data.tooltipFlag10 = false
          data.tooltipFlag11 = false
          data.tooltipFlag12 = false
          data.tooltipFlag13 = false
        })
      }
    }

    //季节性产品 change 事件
    const changeIsSeasonal = (e) => {
      if (e == 0) {
        data.ruleForm.seasonalAttribute = ''
      } else {
        data.ruleForm.seasonalAttribute = []
      }
    }

    //删除表格新增
    const deleteValuation = () => {
      vue.$refs.newFormRef.resetFields()
    }
    return {
      ...refData,
      changeSwitch,
      handChange,
      getDetails,
      handleDel,
      getMsg,
      onSubmit,
      onSubmitDraf,
      productForm,
      closeTab,
      UploadImage,
      tableTypeComputed,
      addValuation,
      newFormRef,
      resetForm,
      resetFormNew,
      changeMoney,
      receive,
      handleClose,
      showInput,
      handleInputConfirm,
      getSiteByPlat,
      getParameter,
      uploadTrigger,
      fileUpload,
      editInformation,
      changeMoneyE,
      changeRateId,
      editSiteByPlat,
      editParameter,
      preservation,
      tableDietRef,
      changeSite,
      jump,
      jumpSPU,
      siteChange,
      platformChange,
      // openAddValuation,
      copyText,
      getModuleID,
      rowCopy,
      changePlatform,
      revaluation,
      closedtooltipRef,
      changeIsSeasonal,
      onChange,
      getSpuByCategory,
      getCategoryBySpu,
      onSPUChange,
      deleteValuation,
      changeTransport,
      changeTransports,
    }
  },
}
</script>
<style lang="scss" scoped>
.el-input {
  width: 230px;
  margin-right: 5px;
}
.addBtn {
  float: right;
}
.footer-add {
  display: flex;
  margin: 20px 0;
  .footer-form-box {
    width: 62%;
    display: flex;
    overflow-x: auto;

    .platform {
      .el-select {
        width: 110px;
      }
    }
    .site {
      .el-select {
        width: 120px;
      }
    }
    .platformPrice,
    .advicePrice {
      .el-input {
        width: 100px;
      }
    }
    .currency {
      .el-select {
        width: 120px;
      }
    }
    .parameter {
      .el-select {
        width: 120px;
      }
    }
    .link {
      .el-textarea {
        width: 200px !important;
        height: 30px;
      }
    }
    .purpose {
      .el-select {
        width: 200px;
      }
    }
    .num {
      .el-input {
        width: 80px;
      }
    }
    .transport {
      .el-select {
        width: 100px;
      }
    }
    .plugAndVoltage {
      .el-select {
        width: 150px;
      }
    }
  }

  .el-select {
    margin-right: 5px;
  }
}

.but-right {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  width: 90%;
}

.table_margin {
  margin-bottom: 0;
}
.sixForm {
  .dis-item {
    display: flex;
    div {
      margin-left: 15px;
    }
  }
  .el-form-item {
    width: 45%;
  }
}

.size-width {
  width: 80px;
  margin-right: 3px;
}

.urlWidth {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 400px;
  display: block;
}
.note {
  margin-left: 10px;
  font-size: 10px;
  line-height: 25px;
  color: #afaaaa;
}

.lowestPriceLinkDetails,
.supplierLinksDetails,
.referenceLinkingDetails {
  ::v-deep .el-form-item__content {
    width: 70% !important;
  }
}
::v-deep .tableForm .el-form-item {
  margin-bottom: 0;
}

::v-deep #second-basicinfo-table .el-form-item__content {
  line-height: 33px !important;
}
.content-el-select {
  .el-input {
    width: 400px;
    margin: 20px;
  }
}
::v-deep .links .el-link--inner {
  max-width: 385px !important;
}
</style>
