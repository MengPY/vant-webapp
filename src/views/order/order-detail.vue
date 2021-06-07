<template>
  <div class="order-detail-wrap">
    <div class="info-box basicInfo" :class="{ 'showMore' : viewMore }">
      <li class="order-head">
        <span class="orderNo">
          {{ detailData.orderNo }}
        </span>
        <span class="order-status">
          {{ (detailData.subStatus == '21') ? '待复核' : $utils.getCodeNameByCode(valueSet.ORDER_STATUS, detailData.status) }}
        </span>
      </li>
      <li>
        <label for="">
          下单时间:
        </label>
        <span> {{ $utils.formatDateTime(detailData.createTime) }} </span>
      </li>
      <li>
        <label for="">客户名称:</label>
        <span> {{ detailData.buyerCompanyName }} </span>
      </li>
      <li>
        <label for="">
          订单数量:
        </label>
        <span class="red"> <span class="num">{{ detailData.quantity }}</span> 吨 </span>
      </li>
      <li>
        <label for="">
          订单金额:
        </label>
        <span class="red"> <span class="num">{{ detailData.amount }}</span>  元 </span>
      </li>
      <li>
        <label for="">
          下单方式:
        </label>
        <span> {{ $utils.getCodeNameByCode(valueSet.TRADE_TYPE, detailData.tradeType) }} </span>
      </li>
      <li>
        <label for="">
          期望送达日期:
        </label>
        <span> {{ $utils.formatDate(detailData.expectDeliveryDate) }} </span>
      </li>
      <li>
        <label for="">
          订单日期:
        </label>
        <span v-if="!basicFormEdit"> {{ $utils.formatDate(form.orderDate) }} </span>
        <dateSelect v-else v-model="form.orderDate"></dateSelect>
      </li>

      <li>
        <label for="">
          客户订单号:
        </label>
        <span v-if="!basicFormEdit"> {{ detailData.customerOrderNo }} </span>
        <van-field v-else v-model="form.customerOrderNo" placeholder="请输入客户订单号" />
      </li>
      <li>
        <label for="">
          联系人:
        </label>
        <span v-if="!basicFormEdit"> {{ detailData.buyerContactName }} </span>
        <van-field v-else v-model="form.buyerContactName" placeholder="请输入联系人" />
      </li>
      <li>
        <label for="">
          联系方式:
        </label>
        <span v-if="!basicFormEdit"> {{ detailData.buyerContactTel }} </span>
        <van-field v-else v-model="form.buyerContactTel" placeholder="请输入联系方式" />
      </li>
      <li>
        <label for="">
          订单类型:
        </label>
        <span> {{ $utils.getCodeNameByCode(valueSet.ORDER_TYPE, detailData.orderType) }} </span>
      </li>
      <li>
        <label for="">
          溢短装:
        </label>
        <span> {{ detailData.moreOrLessPercent }}% </span>
      </li>
      <li>
        <label for="">
          提货车船:
        </label>
        <span v-if="!basicFormEdit"> {{ form.vehicleVesselNo }} </span>
        <codeSelect v-else v-model="form.vehicleVesselNo" :valueSet="carShipList" nameKey="vehicleSerialNumber" codeKey="vehicleSerialNumber"></codeSelect>
      </li>

      <li>
        <label for="">
          提货方式:
        </label>
        <span v-if="!basicFormEdit"> {{ $utils.getCodeNameByCode(valueSet.DELIVERY_MODE, detailData.deliveryMode) }} </span>
        <codeSelect v-else v-model="form.deliveryMode" :valueSet="valueSet.DELIVERY_MODE"></codeSelect>
      </li>
      <li v-if="form.deliveryMode == '20'">
        <label for="">
          送货地址:
        </label>
        <span v-if="!basicFormEdit"> {{ detailData.deliveryAddress }} </span>
        <van-field v-else v-model="form.deliveryAddress" placeholder="请输入送货地址" />
      </li>
      <li>
        <label for="">
          其他订单备注:
        </label>
        <span v-if="!basicFormEdit"> {{ detailData.remark }} </span>
        <van-field v-else v-model="form.remark" placeholder="请输入其他订单备注" />
      </li>
      <li>
        <label for="">
          信用信息:
        </label>
        <van-button size="mini" type="info" @click="viewCreditInfo">查看</van-button>
      </li>
      
      <div class="viewMore"> 
        <a @click="expandMore" href="javascript:;">{{ viewMore ? '收起' : '查看更多' }}</a>  
      </div>
    </div>

    <van-collapse v-model="activeNames" class="info-box">
      <van-collapse-item title="商品信息" name="1">
        <div class="product-box" v-for="(item, i) in productData" :key="item.productId">
          <li class="product-head"> <span class="product-num">{{ i+1 }}</span> <span>{{ item.commodityDesc }}</span> </li>
          <li> <label>商品编码:</label> <span> {{ item.commodityCode }}  </span>  </li>
          <li> <label>商品名称:</label> <span> {{ item.commodityName }}  </span>  </li>
          <li>
            <label>数量:</label> 
            <span v-if="!productFormEdit"> {{ item.quantity + item.unitName }}  </span>
            <van-field @input="getRowPriceTotal($event, i)" v-else type="number" v-model="productData[i].quantity" placeholder="" />
          </li>
          <li>
            <label>件数:</label> 
            <span v-if="!productFormEdit"> {{ item.piece && item.piece+'件' }}  </span>
            <van-field v-else type="number" v-model="productData[i].piece" placeholder="" />
          </li>
          <li>
            <label>含税单价:</label> 
            <span v-if="!productFormEdit"> {{ item.price + item.currencyName }}  </span> 
            <van-field @input="getRowPriceTotal($event, i)" v-else type="number" v-model="productData[i].price" placeholder="" />
          </li>
          <li> <label>含税金额:</label> <span> {{ item.priceTotal + item.currencyName }}  </span>  </li>
          <li> <label>币种:</label> <span> {{ $utils.getCodeNameByCode(valueSet.CURRENCY, item.currencyCode) }}  </span>  </li>
          <li> 
            <label>税率:</label> 
            <span v-if="!productFormEdit"> {{ item.taxRate && item.taxRate * 100 + "%" }}  </span>
            <codeSelect v-else v-model="productData[i].taxRate" :valueSet="valueSet.TAX_RATE"></codeSelect>
          </li>
          <li> 
            <label>备注:</label> 
            <span v-if="!productFormEdit"> {{ item.remark }}  </span>
            <van-field v-else v-model="productData[i].remark" placeholder="" />
          </li>
        </div>
      </van-collapse-item>
      <van-collapse-item title="出库申请" name="2" v-if="applyData.length">
        <div class="product-box" v-for="(row) in applyData" :key="row.outApplyId">
          <li> <label>出库申请单号/出仓单号:</label> <span> {{row.outApplyCode + (row.sapVbeln && `/ ${row.sapVbeln}`)}}  </span>  </li>
          <li> <label>申请时间:</label> <span> {{row.createTime && $utils.formatDate(row.createTime)}}  </span>  </li>
          <li> 
            <div><label>申请重量:</label> <span> {{ row.totalWeight }}  </span></div>
            <div><label>申请数量:</label> <span> {{ row.totalQuantity }}  </span></div>    
          </li>
          <li> 
            <div><label>申请金额(元):</label> <span> {{ row.totalAmount }}  </span></div>
            <div><label>提货车次:</label> <span> {{ row.deliveryNumber }}  </span></div>    
          </li>
          <li> 
            <div><label>出库重量:</label> <span> {{ row.actualWeight }}  </span></div>
            <div><label>出库数量:</label> <span> {{ row.actualQuantity }}  </span></div>    
          </li>
          <li> 
            <div><label>出库金额(元):</label> <span> {{ row.actualAmount }}  </span></div>
            <div><label>提货方式:</label> <span> {{ $utils.getCodeNameByCode(valueSet.DELIVERY_MODE, row.pullType) }}  </span></div>    
          </li>
           <li> 
            <div><label>仓库:</label> <span> {{ row.warehouseName }}  </span></div>
          </li>
        </div>        
      </van-collapse-item>
      <van-collapse-item title="出库实际" name="3" v-if="actualData.length">
        <div class="product-box" v-for="(row, i) in actualData" :key="i">
          <li> <label>出库单号:</label> <span> {{ row.outActualCode }}  </span>  </li>
          <li> <label>出库日期:</label> <span> {{row.actualOutDate && $utils.formatDate(row.actualOutDate)}}  </span>  </li>
          <li> <label>商品编码:</label> <span> {{ row.mate }}  </span>  </li>
          <li> <label>商品名称:</label> <span> {{ row.productName }}  </span>  </li>
          <li> <label>商品描述:</label> <span> {{ row.productDesc }}  </span>  </li>
          <li> 
            <div><label>出库重量:</label> <span> {{ row.weight }}  </span></div>
            <div><label>出库数量:</label> <span> {{ row.quantity }}  </span></div>    
          </li>
          <li> 
            <div><label>车船号:</label> <span> {{ row.deliverCode }}  </span></div>
            <div><label>提货人:</label> <span> {{ row.takeDeliveryName }}  </span></div>    
          </li>
          <li><label>提货人手机:</label> <span> {{ row.takeDeliveryTel }}  </span></li>
          <li><label>备注:</label> <span> {{ row.remark }}  </span></li>
        </div>        
      </van-collapse-item>
      <van-collapse-item title="销售配置信息" name="4" 
        v-if="
        (detailData.status == '00' &&
          $utils.hasBtnPermisson('order_detail_confirm')) ||
        actionType == 'detail' ||
        actionType == 'orderConfirm'
        ">
        <div class="product-box" style="border:none;">
          <li> 
            <label>公司平台名称:</label> 
            <span v-if="!saleFormEdit"> {{ detailData.sellerPlatName }}  </span> 
            <codeSelect v-else v-model="saleForm.sellerPlatCode" :valueSet="valueSet.BUSINESS_ORG"></codeSelect>
          </li>
          <li> 
            <label>业务部:</label> <span> {{ detailData.sellerOrgName }}  </span>
          </li>
          <li>
            <label>业务部组:</label> <span> {{ detailData.sellerDepartmentName }}  </span>
          </li>
          <li> 
            <label>业务员:</label> 
            <span v-if="!saleFormEdit"> {{ detailData.salesName }}  </span> 
            <codeSelect v-else v-model="saleForm.salesCode" :valueSet="salesMemebrList" nameKey="empName" codeKey="empId"></codeSelect>
          </li>
          <li>
            <label>交货方式:</label> <span> {{ $utils.getCodeNameByCode(valueSet.DELIVERY_TYPE, detailData.shipMode) }}  </span>
          </li>
          <li>
            <label>供应商:</label> 
            <span v-if="!saleFormEdit"> {{ detailData.supplierName }}  </span> 
            <codeSelect :needFilter="true" v-else v-model="saleForm.supplierCode" :valueSet="supplierNameList"></codeSelect>
          </li>
          <li>
            <label>签约方式:</label> 
            <span v-if="!saleFormEdit">  {{ $utils.getCodeNameByCode(valueSet.SIGN_METHOD, detailData.signMode) }}  </span> 
            <codeSelect v-else v-model="saleForm.signMode" :valueSet="valueSet.SIGN_METHOD"></codeSelect>
          </li>
          <li>
            <label>付款方式:</label> 
            <span v-if="!saleFormEdit">  {{ $utils.getCodeNameByCode(valueSet.PAYMENT_TERMS, detailData.paymentMethod) }}   </span> 
            <codeSelect v-else v-model="saleForm.paymentMethod" :valueSet="valueSet.PAYMENT_TERMS"></codeSelect>
          </li>
          <li v-if="saleForm.paymentMethod !== 'Z103' && saleForm.paymentMethod !== 'Z110'">
            <label>付款时限:</label> 
            <span v-if="!saleFormEdit">  
              {{ $utils.getCodeNameByCode(valueSet.PAY_LIMIT_TYPE, detailData.paymentMethodClause) }}
              {{ detailData.paymentMethodDays && detailData.paymentMethodDays + "天" }}  
            </span> 
            <div v-else style="display: flex;">
              <codeSelect style="width:50%" v-model="saleForm.paymentMethodClause" :valueSet="valueSet.PAY_LIMIT_TYPE"></codeSelect>
              <van-field style="width:50%" v-model="saleForm.paymentMethodDays" type="digit" />天
            </div>
          </li>
          <li>
            <label>结算方式:</label> 
            <span v-if="!saleFormEdit">  {{ $utils.getCodeNameByCode(valueSet.SETTLEMENT_METHOD, detailData.settlementMethod) }}   </span> 
            <codeSelect v-else v-model="saleForm.settlementMethod" :valueSet="valueSet.SETTLEMENT_METHOD"></codeSelect>
          </li>
          <li v-if="saleForm.settlementMethod == 'B' || detailData.settlementMethod == 'B'">
            <label>承兑汇票类型:</label> 
            <span v-if="!saleFormEdit">  {{ $utils.getCodeNameByCode(valueSet.BANK_ACCEPTANCE_BILL_TYPE, detailData.bankAcceptanceBillType) }}   </span> 
            <codeSelect v-else v-model="saleForm.bankAcceptanceBillType" :valueSet="valueSet.BANK_ACCEPTANCE_BILL_TYPE"></codeSelect>
          </li>
          <li>
            <label>主管复核:</label> 
            <span v-if="!saleFormEdit"> {{ detailData.isRequireManagerCheck == "1" ? "是" : "否" }} </span> 
            <codeSelect v-else v-model="saleForm.isRequireManagerCheck" :valueSet="simpleCodeSet"></codeSelect>
          </li>
          <li>
            <label>是否需要审批:</label> 
            <span v-if="!saleFormEdit"> {{ detailData.isRequireAudit == "1" ? "是" : "否" }} </span> 
            <codeSelect v-else v-model="saleForm.isRequireAudit" :valueSet="simpleCodeSet"></codeSelect>
          </li>
          <li>
            <label>是否成品条款:</label> 
            <span v-if="!saleFormEdit"> {{ detailData.isFinishedProductClause == "1" ? "是" : "否" }} </span> 
            <codeSelect v-else v-model="saleForm.isFinishedProductClause" :valueSet="simpleCodeSet"></codeSelect>
          </li>
          <li>
            <label>销售合同:</label> 
            <span v-if="!saleFormEdit">  {{ $utils.getCodeNameByCode(valueSet.CONTRACT_TEMPLATE, detailData.contractTemplate) }}   </span> 
            <codeSelect v-else v-model="saleForm.contractTemplate" :valueSet="valueSet.CONTRACT_TEMPLATE"></codeSelect>
          </li>

          
        </div>
        
  
      </van-collapse-item>
      <van-collapse-item class="signInfo" title="线上签署跟踪" name="5" v-if="detailData.status >= '10' && detailData.signMode == '10'">
        <li>
          <label for="">
            审批流水号:
          </label>
          <span> {{ approvalInfo.requestId }} </span>
        </li>
        <li>
          <label for="">
            审批状态:
          </label>
          <span> {{ approvalInfo.statusDesc }} </span>
        </li>
        <li>
          <label for="">
            审批发起人:
          </label>
          <span> {{ approvalInfo.creatorName }} </span>
        </li>
        <li>
          <label for="">
            审批提交时间:
          </label>
          <span> {{ approvalInfo.createTime }} </span>
        </li>
        <li>
          <label for="">
            合同流水号:
          </label>
          <span> {{ signInfo.requestId }} </span>
        </li>
        <li>
          <label for="">
            合同状态:
          </label>
          <span> {{ signInfo.statusDesc }} </span>
        </li>
        <li>
          <label for="">
            签约发起人:
          </label>
          <span> {{ signInfo.creatorName }} </span>
        </li>
        <li>
          <label for="">
            签约提交时间:
          </label>
          <span> {{ signInfo.createTime }} </span>
        </li>
      </van-collapse-item>
      <van-collapse-item class="signInfo" title="线下签署信息" name="6" v-if="detailData.status >= '10' && detailData.signMode == '20'">
        <li>
          <label for="">
            外部编号:
          </label>
          <span v-if="detailData.isSign == '1'">
            {{ detailData.outOrderNo }}
          </span>
          <van-field v-else v-model="signOfflineForm.outOrderNo" placeholder="请输入外部编号" />
        </li>
        <li>
          <label for="">
            上传合同附件(盖章):
          </label>
          <a
            :href="
              $common.interfacePath.fileServerDownload +
              detailData.outOrderFileUrl
            "
            v-if="
              (detailData.isSign == 1 || from == 'orderNo') &&
              detailData.outOrderFileUrl
            "
          >
            合同文件
          </a>
          <a style="width:100px;" class="text-overflow-out-one" v-if="signOfflineForm.fileInfo.fileName" :href="$common.interfacePath.fileServerDownload +
             signOfflineForm.fileInfo.fileUrl"> {{ signOfflineForm.fileInfo.fileName }} </a>
          
          <van-uploader style="width:auto" :after-read="afterRead" :max-count="1" accept="*" v-if="detailData.isSign !== 1">
            <van-button size="mini" icon="plus" type="primary">上传文件</van-button>
          </van-uploader>
        </li>
        <li style="margin-top:5px;" v-if="detailData.isSign == '0'"> <span></span> <van-button size="mini" type="info" @click="signConfirm">签署确认</van-button>  </li>
      </van-collapse-item>
    </van-collapse>


    <div class="bottom-btn-wrap" :class="{ 'Dbheight': actionType !== 'detail' }">
      <div class="bottom-btn">
        <van-button v-if="actionType == 'validateConfirm'" size="small" style="width:50%" round type="info" block @click="orderEdit">编辑</van-button>
        <van-button v-if="actionType == 'validateConfirm'" size="small" style="width:50%" round color="linear-gradient(to right, #ff6034, #ee0a24)" block @click="validateConfirm">生效确认</van-button>
        <van-button v-if="actionType == 'orderEdit'" size="small" round color="linear-gradient(to right, #ff6034, #ee0a24)" block @click="save">保存</van-button>
        <van-button v-if="actionType == 'orderConfirm'" size="small" round color="linear-gradient(to right, #ff6034, #ee0a24)" block @click="saveConfirm">保存并确认</van-button>
        <van-button size="small" round  type="info" block @click="viewUpdateDetail">查看更新履历</van-button>
      </div>
    </div>

    <van-popup get-container="body" v-model="creditModal" :style="{ width: '90%' }">
      <van-cell-group>
        <van-cell title="信用类型" :value="fundInfo.creditType == '10' ? '授信' : '现款'" />
        <van-cell title="信用额度" :value="fundInfo.creditAmount" />
        <van-cell title="当前欠款" :value="fundInfo.arrearsAmount" />
        <van-cell title="逾期欠款" :value="fundInfo.overdueAmount" />
        <van-cell title="订单占用" :value="fundInfo.orderUsedAmount" />
        <van-cell title="可用额度" :value="fundInfo.creditBalance" />
      </van-cell-group>
    </van-popup>


    <van-popup get-container="body" v-model="updateModal" :style="{ width: '90%' }">
      <van-grid>
        <van-grid-item class="width25" style="flex-basis:25%" text="姓名" />
        <van-grid-item class="width30" style="flex-basis:30%" text="操作" />
        <van-grid-item class="width45" style="flex-basis:45%" text="日期" />
      </van-grid>
      <van-grid v-for="(item, i) in updateList" :key="i">
        <van-grid-item class="width25" :text="item.creatorName" />
        <van-grid-item class="width30" style="flex-basis:30%" :text="item.operateDesc" />
        <van-grid-item class="width45" style="flex-basis:45%" :text="$utils.formatDateTime(item.createTime)" />
      </van-grid>
    </van-popup>
    
  </div>
</template>

<script>
import { upload } from "@/api/upload-api.js";
import api from '@/api/orderManage'
import { Dialog } from 'vant';
export default {
  data () {
    return {
      simpleCodeSet: [
        {
          itemCode: '1',
          itemName: '是'
        },
        {
          itemCode: '0',
          itemName: '否'
        }
      ],
      basicFormEdit: false,
      saleFormEdit: false,
      productFormEdit: false,
      activeNames: ['1', '4'],
      viewMore: false,
      creditModal: false,
      updateModal: false,
      fundInfo: {},
      form: {
        buyerCompanyCode: "",
        customerOrderNo: "",
        buyerContactName: "",
        buyerContactTel: "",
        orderDate: "",
        deliveryMode: "",
        deliveryAddress: "",
        remark: "",
        vehicleVesselNo: "",
      },
      saleForm: {
        auditLaunchUserId: "",
        auditLaunchUserName: "",
        bankAcceptanceBillType: "",
        busManageAreaCode: "",
        busManageAreaName: "",
        isRequireAudit: "",
        isRequireManagerCheck: "",
        paymentMethod: "",
        paymentMethodClause: "",
        paymentMethodDays: null,
        purchaseOrderNo: "",
        salesCode: "",
        salesName: "",
        shipMode: "",
        signMode: "",
        supplierName: "",
        supplierCode: "",
        settlementMethod: "",
        isFinishedProductClause: "",
        contractTemplate: "",
        sellerPlatCode: "",
        sellerPlatName: "",
      }, //销售配置信息
      detailData: {},
      productData: [],
      applyData: [],
      actualData: [],
      salesMemebrList: [],
      supplierNameList: [],
      carShipList: [],
      updateList: [],
      approvalInfo: {},
      signInfo: {},
      signOfflineForm: {
        fileInfo: {
          fileName: ""
        },
        outOrderNo: "",
        outOrderFileUrl: "",
      },
      basicFormValidateObj: {
        customerOrderNo: '客户订单号',
        buyerContactName: '联系人',
        buyerContactTel: '联系方式',
        orderDate: '订单日期',
        deliveryMode: '提货方式',
        deliveryAddress: '送货地址'
      },
      saleFormValidateObj: {
        sellerPlatCode: '公司平台',
        supplierCode: '供应商',
        salesCode: '业务员',
        // purchaseOrderNo: '采购合同号',
        shipMode: '交货方式',
        signMode: '签约方式',
        paymentMethod: '付款方式',
        paymentMethodClause: '付款时限',
        settlementMethod: '结算方式',
        isRequireManagerCheck: '主管复核',
        isRequireAudit: '是否需要审批',
        // auditLaunchUserName: '审批发起人',
        bankAcceptanceBillType: '承兑汇票类型',
        isFinishedProductClause: '是否成品条款',
        contractTemplate: '合同模版'
      }
    }
  },
  computed: {
    valueSet() {
      return this.$store.state.codeValue.valueSet;
    },
    actionType() {
      return this.$route.query.type;
    },
    from() {
      return this.$route.query.from;
    },
  },
  watch: {
    '$route'(to,from) {   
      if (this.actionType == 'orderConfirm' || this.actionType == 'orderEdit') {
        this.basicFormEdit = true;
        this.productFormEdit = true;
        this.saleFormEdit = true;
      }
    }
  },
  created () {
    if (this.actionType == 'orderConfirm' || this.actionType == 'orderEdit') {
      this.basicFormEdit = true;
      this.productFormEdit = true;
      this.saleFormEdit = true;
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getDetail();
    }
  },
  methods: {
    expandMore() {
      this.viewMore = !this.viewMore
    },
    showPicker (name) {
      this.$refs[name] && this.$refs[name].show();
    },
    getRowPriceTotal(val, index) {
      let row = this.productData[index];
      row.priceTotal = this.$Calculator.arithmeticTim(row.price, row.quantity);
    },
    orderEdit () {
      this.$router.replace({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          type: "orderConfirm",
        },
      });
    },
    async viewUpdateDetail() {
      let params = {
        businessNo: this.detailData.orderNo
      };
      let {
        data: { success, message, data, total },
      } = await api.updateListByOrder(params);
      if (success) {
        this.updateList = data || [];
        this.updateModal = true;
      }
    },
    async getDetail() {
      let params = {
        ...this.$route.query,
      };
      let {
        data: { data, success, message },
      } = await api.getOrderDetail(params);
      if (success) {
        this.detailData = data || {};
        this.queryOutApplyListByFront(this.detailData.orderNo);
        this.getActualList(this.detailData.orderNo);
        let workflowInfoJson = this.detailData.workflowInfoJson
          ? JSON.parse(this.detailData.workflowInfoJson)
          : {};
        this.workflowInfoJson = workflowInfoJson;
        this.approvalInfo = workflowInfoJson.approvalInfo
          ? workflowInfoJson.approvalInfo
          : {};
        this.signInfo = workflowInfoJson.signInfo
          ? workflowInfoJson.signInfo
          : {};
        // this.detailData.supplierName &&
        //   this.getSupplierNameList(this.detailData.supplierName);
          this.getSupplierNameList('')

        Object.keys(this.form).forEach((key) => {
          if (key == "orderDate") {
            this.detailData[key] &&
              (this.form[key] = this.$utils.formatDate(this.detailData[key]));
            !this.detailData[key] &&
              (this.form[key] = this.$utils.formatDate(new Date()));
          } else {
            this.detailData[key] && (this.form[key] = this.detailData[key]);
          }
        });
        Object.keys(this.saleForm).forEach((key) => {
          if (
            key == "isRequireManagerCheck" ||
            key == "isRequireAudit" ||
            key == "isFinishedProductClause"
          ) {
            this.detailData[key] !== null &&
              (this.saleForm[key] = this.detailData[key] + "");
          } else {
            this.detailData[key] && (this.saleForm[key] = this.detailData[key]);
          }
        });
        this.getVehicleByMemberId();
        let productData = this.detailData.orderDetailList || [];
        var productArr = [];
        productData.forEach(async (item) => {
          let {
            data: { data },
          } = await api.queryBasicunit({
            type: "2",
            relevanId: item.skuId || item.productId,
          });
          productArr.push({
            ...item,
            orderDetailId: item.id,
            unitList: data || [],
            taxRate: item.taxRate + "",
            priceTotal: this.$Calculator.arithmeticTim(
              item.price,
              item.quantity
            ),
          });
        });
        this.productData = productArr;

        this.queryByMemberByIdAndOrgId();
      } else {
        this.$toast(message);
      }
    },
    async queryOutApplyListByFront(saleOrderCode) {
      let params = {
        saleOrderCode,
        pageNum: 1,
        pageSize: 999,
        statusList: [3, 4],
        memberId: this.detailData.buyerCompanyCode,
      };
      var {
        data: { message, data, success },
      } = await api.queryOutApplyListByFront(params);
      if (success) {
        this.applyData = data || [];
      } else {
        this.$toast(message);
      }
    },
    async getActualList(orderCode) {
      let params = {
        orderCode,
        memberId: this.detailData.buyerCompanyCode,
      };
      var {
        data: { message, data, success },
      } = await api.getActualList(params);
      if (success) {
        this.actualData = data || [];
      } else {
        this.$toast(message);
      }
    },
    async getVehicleByMemberId() {
      this.carShipList = [];
      let params = {
        memberId: this.detailData.buyerCompanyCode,
      };
      let {
        data: { data, success, message },
      } = await api.getVehicleByMemberId(params);
      if (success) {
        this.carShipList = data || [];
      } else {
        this.$toast(message);
      }
    },
    async queryByMemberByIdAndOrgId() {
      let params = {
        memberId: this.detailData.buyerCompanyCode,
        orgId: this.detailData.sellerDepartmentId,
      };
      let {
        data: { data, success, message },
      } = await api.queryByMemberByIdAndOrgId(params);
      if (success) {
        this.salesMemebrList = data || [];
        this.salesMemebrList.length &&
          (this.saleForm.salesCode = this.salesMemebrList[0].empId);
      } else {
        this.$toast(message);
      }
    },
    async viewCreditInfo () {
      let { data: { data, success, message } } = await api.getFundInfo({ customerId: this.detailData.buyerCompanyCode });
      if (success) {
          this.fundInfo = data || {};
          this.creditModal = true;
      } else {
          this.$toast(message)
      }
    },
    async getSupplierNameList(itemNameLike = "") {
      var reg = /[^\u4E00-\u9FA5]/;
      // if (itemNameLike.trim() == "" || reg.test(itemNameLike)) {
      //   return;
      // }
      this.loading = true;
      var params = {
        setCode: "SAP_SUPPLIER",
        // itemNameLike,
      };
      let {
        data: { success, message, data },
      } = await api.getSupplierNameList(params);
      this.loading = false;
      if (success) {
        this.supplierNameList = data || [];
      } else {
        this.$toast(message);
      }
    },
    afterRead (file, detail) {
      console.log(file, detail)
      let params = {
        privateFlag: 0,
        folderName: 'default',
        file: file.file
      }
      let formData = new FormData();
      // 向 formData 对象中添加文件
      Object.keys(params).forEach(key => {
        formData.append(key, params[key])
      })
      this.$http.create({
        headers: {'Content-Type': 'multipart/form-data;', 'Authorization': this.getStore('token')}
      }).post(upload.url, formData).then(res => {
        if (res.data.success) {
          this.signOfflineForm.fileInfo.fileName = file.file.name;
          this.signOfflineForm.fileInfo.fileUrl = res.data.data.objectUrl;
          this.signOfflineForm.outOrderFileUrl = res.data.data.objectKey;
        } else {
          this.$toast(res.data.message)
        }
      })
    },
    async signConfirm() {
      let params = {
        orderId: this.$route.query.id,
        ...this.signOfflineForm,
      };
      if (!params.outOrderNo) {
        return this.$toast('请输入外部编号');
      } else if (!params.outOrderFileUrl) {
        return this.$toast('请上传合同附件');
      }
      delete params.fileInfo;
      let {
        data: { data, success, message },
      } = await api.orderSignConfirm(params);
      if (success) {
        this.$toast("签署确认成功");
        this.$router.back();
      } else {
        this.$toast(message);
      }
    },
    baiscFormValidate(formObj, formValidateObj) {
      let keysObj = { ...formValidateObj }
      if (formObj.deliveryMode !== '20') {
        delete keysObj.deliveryAddress;
      }
      let valid = true;
      let requireKeysArr = [];
      Object.keys(keysObj).forEach(key => {
        if (!formObj[key]) {
          valid = false;
          requireKeysArr.push(keysObj[key])
        }
      })
      // console.log(valid, requireKeysArr)
      return new Promise((res, rej) => {
        res({ valid, requireKeysArr })
      })
    },
    saleFormValidate (formObj, formValidateObj) {
      let keysObj = { ...formValidateObj }
      if (formObj.settlementMethod !== 'B') {
        delete keysObj.bankAcceptanceBillType;
      }
      let valid = true;
      let requireKeysArr = [];
      Object.keys(keysObj).forEach(key => {
        if (!formObj[key]) {
          valid = false;
          requireKeysArr.push(keysObj[key])
        }
      })
      // console.log(valid, requireKeysArr)
      return new Promise((res, rej) => {
        res({ valid, requireKeysArr })
      })
    },
    validateConfirm () {
      Dialog.confirm({
        title: '确认生效吗？',
        beforeClose: async (action, done) => {
          if (action === 'confirm') {
            var params = {
              orderId: this.$route.query.id,
            };
            var {
              data: { data, success, message },
            } = await api.orderValidateConfirm(params);
            done();
            if (success) {
              this.$toast("生效确认成功");
              this.$router.back();
            } else {
              this.$toast(message);
            }
          } else {
            done();
          }
        },
      });
    },
    async save() {
      let basicFormValidRes = await this.baiscFormValidate(this.form, this.basicFormValidateObj);
      if (basicFormValidRes.requireKeysArr.length) {
        return this.$toast(basicFormValidRes.requireKeysArr.join(',')+'不能为空');
      }
      if (basicFormValidRes.valid) {
        let params = {
          ...this.form,
          orderId: this.$route.query.id,
          detailUpdateList: this.productData,
        };
        params.orderDate = new Date(params.orderDate).getTime();
        let productDataValid = params.detailUpdateList.every(
          (item) => item.price > 0
        );
        if (!productDataValid) {
          return this.$toast("商品价格必须大于0");
        }
        let {
          data: { data, success, message },
        } = await api.orderUpdate(params);
        if (success) {
          this.$toast("订单保存成功");
          this.$router.back();
        } else {
          this.$toast(message);
        }
      } else {
        this.$toast("请填写完整信息");
      }
    },
    async saveConfirm() {
      let basicFormValidRes = await this.baiscFormValidate(this.form, this.basicFormValidateObj);
      if (basicFormValidRes.requireKeysArr.length) {
        return this.$toast(basicFormValidRes.requireKeysArr.join(',')+'不能为空');
      }
      let saleFormValidRes = await this.saleFormValidate(this.saleForm, this.saleFormValidateObj);
      if (saleFormValidRes.requireKeysArr.length) {
        return this.$toast(saleFormValidRes.requireKeysArr.join(',')+'不能为空');
      }
      if (basicFormValidRes.valid && saleFormValidRes.valid) {
        let params = {
          ...this.form,
          ...this.saleForm,
          orderId: this.$route.query.id,
          detailUpdateList: this.productData,
        };
        let productDataValid = params.detailUpdateList.every(
          (item) => item.price > 0
        );
        if (!productDataValid) {
          return this.$toast("商品价格必须大于0");
        }
        if (
          params.paymentMethod !== "Z103" &&
          params.paymentMethod !== "Z110" &&
          params.paymentMethodDays == null
        ) {
          return this.$toast("请填写付款时限天数");
        }
        params.orderDate = new Date(params.orderDate).getTime();
        params.salesName = this.salesMemebrList.find(
          (item) => item.empId == params.salesCode
        ).empName;
        params.supplierName =
          params.supplierCode &&
          this.supplierNameList.find(
            (item) => item.itemCode == params.supplierCode
          ).itemName;
        params.sellerPlatName =
          params.sellerPlatCode &&
          this.valueSet.BUSINESS_ORG.find(
            (item) => item.itemCode == params.sellerPlatCode
          ).itemName;
          Dialog.confirm({
            title: '确认保存并确认？',
            beforeClose: async (action, done) => {
              if (action === 'confirm') {
                let {
                  data: { data, success, message },
                } = await api.orderConfirm(params);
                done();
                if (success) {
                  this.$toast("订单确认成功");
                  this.$router.back();
                } else {
                  this.$toast(message);
                }
              } else {
                done();
              }
            },
          });
      } else {
        this.$toast("请填写完整信息");
      }
    },
  }
}
</script>

<style lang="less" scoped>
.width25 {
  flex-basis: 25%!important;
}
.width30 {
  flex-basis: 30%!important;
}
.width45 {
  flex-basis: 45%!important;
}
.order-detail-wrap {
  display: flex;
  flex-direction: column;
}
/deep/.van-field__control {
  padding-left: 5px;
  height: 24px;
  line-height: 24px;
  color: #333;
  font-size: 12px;
  background: #FFFFFF;
  border: 1px solid #D9D9D9;
  opacity: 1;
  border-radius: 4px;
}
.van-button {
  span {
    color: #fff!important;
  }
}
.van-collapse {
  background: #fff;
  width: 90%;
  margin: 10px auto;
  border-radius: 4px;
  font-size: 12px;
  padding: 10px;
  /deep/.van-cell {
    padding: 5px 0;
  }
  /deep/.van-collapse-item__content {
    padding: 5px 0;
  }
  /deep/.van-collapse-item--border::after {
    left: 0;
    right: 0;
  }
  /deep/.van-collapse-item__title::after {
    left: 0;
    right: 0;
  }
} 
.product-box {
  font-size: 12px;
  padding: 0 5px;
  border-bottom: 1px solid #eee;
  .product-head {
    justify-content: flex-start;
    align-items: center;
    .product-num {
      display: block;
      width: 16px;
      text-align: center;
      line-height: 16px;
      background: rgba(215, 25, 32, .2);
      border-radius: 50%;
      font-size: 12px;
      color: rgba(215, 25, 32, 1);
      font-weight: bold;
      margin-right: 3px;
    }
  }
}
.info-box {
  background: #fff;
  width: 90%;
  margin: 10px auto;
  border-radius: 4px;
  box-shadow: 0 2px 0 #fff;
  font-size: 13px;
  padding: 10px;
  .order-head {
    display: flex;
    align-items: center;
    .orderNo {
      font-size: 15px;
      color: #111;
      font-family: PingFang SC;
      font-weight: 400;
    }
    .order-status {
      display: inline-block;
      color: #D71920;
      text-align: center;
      line-height: 16px;
      padding: 2px 4px;
      background: rgba(215, 25, 32, .2);
      border-radius: 2px;
      font-weight: bold;
    }
  }
  li {
    position: relative;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .operation-btn {
      width: auto;
      position: absolute;
      right: -5px;
      top: -5px;
      button {
        background: #fff;
        height: 24px;
        span {
          color: #0072BC!important;
        }
      }
    }
    label {
      color: #666;
      margin-right: 10px;
    }
    span {
      color: #333;
      &.red {
        color: #D71920;
        .num {
          font-size: 13px;
          color: #D71920;
          font-weight: bold;
        }
      }
    }
    &>div{
      width: 50%;
    }
  }
}
.basicInfo {
  padding-bottom: 30px;
  height: 240px;
  overflow: hidden;
  position: relative;
  &.showMore {
    height: auto;
  }
  .viewMore {
    text-align: center;
    position: absolute;
    height: 30px;
    line-height: 30px;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    a {
      
    }
  }
}
.bottom-btn-wrap {
  height: 50px;
  &.Dbheight {
    height: 90px;
  }
}
.bottom-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  .van-button {
    margin-top: 5px;
  }
}
.signInfo {
  label {
    font-size: 12px;
  }
  span {
    font-size: 12px;
  }
} 
</style>