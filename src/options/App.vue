<template>
  <div id="app" class="container" :class="containerClass">
    <div class="section-block">
      <div class="section-title">指数管理</div>
      <div class="management-container">
        <div class="input-row">
          <span>添加指数:</span>
          <el-select
            v-model="sltSeci"
            placeholder="请选择指数"
            style="width:200px"
          >
            <el-option
              v-for="item in userSeciList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="saveSeci">确定添加</el-button>
        </div>

        <div class="tab-row">
          <div
            v-for="(el, index) in indFundDataDisplay"
            draggable="true"
            class="tab-col indFund draggable-item"
            :key="el.value"
            @dragstart="handleDragStart($event, el, 'ind')"
            @dragover.prevent="handleDragOver($event)"
            @dragenter="handleDragEnter($event, el, index, 'ind')"
            @dragend="handleDragEnd($event, 'ind')"
          >
            <h5>
              {{ el.label }}
              <i class="el-icon-delete" style="color:#F56C6C; cursor:pointer; margin-left:5px;" @click="dltIndFund(index)"></i>
            </h5>
            <p>
              <input
                v-if="BadgeContent == 3"
                @click="sltIndBadge(el.value)"
                :class="el.value == RealtimeIndcode ? 'slt' : ''"
                class="btn edit"
                value="✔"
                type="button"
                title="设为角标"
              />
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="section-block">
      <div class="section-title">基金管理</div>
      <div class="management-container">
        <div class="input-row">
          <span>添加新基金:</span>
          <el-select
            v-model="searchFundCode"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入基金编码/名称搜索"
            :remote-method="remoteSearchFund"
            :loading="searchLoading"
            style="width:300px"
          >
            <el-option
              v-for="item in searchOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
          <el-button type="primary" @click="saveFund">确定添加</el-button>
        </div>
        <p class="tips">
          部分新发基金或QDII基金可以搜索到，但可能无法获取估值情况
        </p>

        <table class="manage-table">
          <thead>
            <tr>
              <th width="50">排序</th>
              <th>基金名称</th>
              <th>基金代码</th>
              <th v-if="showGSZ">估算净值</th>
              <th v-if="showAmount">持有额</th>
              <th v-if="showGains">估值收益</th>
              <th v-if="showCost">持有收益</th>
              <th v-if="showCostRate">持有收益率</th>
              <th>持有份额</th>
              <th v-if="BadgeContent == 1">特别关注</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(el, index) in dataList"
              :key="el.fundcode"
              draggable="true"
              class="draggable-item"
              @dragstart="handleDragStart($event, el, 'fund')"
              @dragover.prevent="handleDragOver($event)"
              @dragenter="handleDragEnter($event, el, index, 'fund')"
              @dragend="handleDragEnd($event, 'fund')"
            >
              <td style="cursor: move;">☰</td>
              <td :title="el.name">{{ el.name }}</td>
              <td>{{ el.fundcode }}</td>
              <td v-if="showGSZ">{{ el.gsz }}</td>
              <td v-if="showAmount">{{ el.amount }}</td>
              <td v-if="showGains" :class="el.gains >= 0 ? 'up' : 'down'">{{ el.gains }}</td>
              <td v-if="showCost" :class="el.costGains >= 0 ? 'up' : 'down'">{{ el.costGains }}</td>
              <td v-if="showCostRate" :class="el.costGainsRate >= 0 ? 'up' : 'down'">{{ el.costGainsRate }}%</td>
              <td>
                <input
                  class="btn num"
                  placeholder="持有份额"
                  v-model="el.num"
                  @input="changeNum(el)"
                  type="number"
                />
              </td>
              <td v-if="BadgeContent == 1">
                <input
                  @click="sltBadge(el.fundcode)"
                  :class="el.fundcode == RealtimeFundcode ? 'slt' : ''"
                  class="btn edit"
                  value="✔"
                  type="button"
                />
              </td>
              <td>
                <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="dltFund(el.fundcode)"></el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="section-block">
      <div class="section-title">样式与设置</div>
      
      <div class="setting-row">
        <span class="label">角标设置：</span>
        <el-radio-group v-model="showBadge" @change="manualSave(false)">
           <el-radio :label="1">开启</el-radio>
           <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
        
        <span v-if="showBadge == 1" style="margin-left: 20px;">内容：</span>
        <el-radio-group v-if="showBadge == 1" v-model="BadgeContent" @change="manualSave(false)">
           <el-radio :label="1">特别关注基金</el-radio>
           <el-radio :label="2">所有基金</el-radio>
           <el-radio :label="3">单个指数</el-radio>
        </el-radio-group>
        
         <span v-if="showBadge == 1 && BadgeContent != 3" style="margin-left: 20px;">类型：</span>
        <el-radio-group v-if="showBadge == 1 && BadgeContent != 3" v-model="BadgeType" @change="manualSave(false)">
           <el-radio :label="1">日收益率</el-radio>
           <el-radio :label="2">日收益额</el-radio>
        </el-radio-group>
      </div>

      <div class="setting-row">
        <span class="label">主题设置：</span>
        <el-switch
          v-model="darkMode"
          @change="manualSave(false)"
          active-color="#484848"
          inactive-color="#13ce66"
          inactive-text="标准模式"
          active-text="暗色模式"
        >
        </el-switch>
        <span style="margin-left: 30px;"></span>
        <el-switch
          v-model="normalFontSize"
          @change="manualSave(false)"
          inactive-text="迷你字号"
          active-text="标准字号"
        >
        </el-switch>
      </div>

      <div class="setting-row">
        <span class="label">列表展示：</span>
        <el-checkbox v-model="showGSZ" @change="manualSave(false)">估算净值</el-checkbox>
        <el-checkbox v-model="showAmount" @change="manualSave(false)">持有金额</el-checkbox>
        <el-checkbox v-model="showGains" @change="manualSave(false)">估值收益</el-checkbox>
        <el-checkbox v-model="showCost" @change="manualSave(false)">持有收益</el-checkbox>
        <el-checkbox v-model="showCostRate" @change="manualSave(false)">持有收益率</el-checkbox>
      </div>
    </div>
    
    <div class="footer-bar">
       <el-button type="primary" size="medium" @click="manualSave(true)">保存所有配置</el-button>
    </div>

  </div>
</template>

<script>
const { version } = require("../../package.json");

//防抖
let timeout = null;
function debounce(fn, wait = 700) {
  if (timeout !== null) clearTimeout(timeout);
  timeout = setTimeout(fn, wait);
}

export default {
  components: {
  },
  data() {
    return {
      // Data from storage
      fundListM: [],
      dataList: [], // Merged real-time data
      seciList: [],
      userId: null,
      showGSZ: false,
      showAmount: false,
      showGains: false,
      showCost: false,
      showCostRate: false,
      darkMode: false,
      showBadge: 1,
      BadgeContent: 1,
      BadgeType: 1,
      normalFontSize: false,
      version,
      RealtimeFundcode: null,
      RealtimeIndcode: null,

      // Fund Search
      searchFundCode: [],
      searchOptions: [],
      searchLoading: false,
      nameCache: {},

      // Index Management
      sltSeci: "",
      allSeciList: [
        { value: "1.000001", label: "上证指数" },
        { value: "1.000300", label: "沪深300" },
        { value: "0.399001", label: "深证成指" },
        { value: "1.000688", label: "科创50" },
        { value: "0.399006", label: "创业板指" },
        { value: "0.399005", label: "中小板指" },
        { value: "100.HSI", label: "恒生指数" },
        { value: "100.DJIA", label: "道琼斯" },
        { value: "100.NDX", label: "纳斯达克" },
        { value: "100.SPX", label: "标普500" },
      ],

      // Dragging
      dragging: null,
    };
  },
  mounted() {
    this.initOption();
  },
  watch: {},
  computed: {
    containerClass() {
      if (this.darkMode) {
        return "darkMode";
      }
    },
    userSeciList() {
      return this.allSeciList.filter((val) => {
        return this.seciList.indexOf(val.value) == -1;
      });
    },
    indFundDataDisplay() {
      // Map stored seciList codes to labels for display
      return this.seciList.map(code => {
        const found = this.allSeciList.find(item => item.value === code);
        return found ? found : { value: code, label: code };
      });
    }
  },
  methods: {
    getGuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    initOption() {
      chrome.storage.sync.get(
        [
          "showNum",
          "showAmount",
          "showGains",
          "showCost",
          "showCostRate",
          "showGSZ",
          "darkMode",
          "normalFontSize",
          "showBadge",
          "BadgeContent",
          "BadgeType",
          "userId",
          "fundListM",
          "seciList",
          "RealtimeFundcode",
          "RealtimeIndcode",
        ],
        (res) => {
          if (res.showNum) {
            chrome.storage.sync.set({ showNum: false });
            chrome.storage.sync.set({ showAmount: true }, () => { this.showAmount = true; });
            chrome.storage.sync.set({ showGains: true }, () => { this.showGains = true; });
          } else {
            this.showAmount = res.showAmount ? res.showAmount : false;
            this.showGains = res.showGains ? res.showGains : false;
          }

          if (res.userId) {
            this.userId = res.userId;
          } else {
            this.userId = this.getGuid();
            chrome.storage.sync.set({ userId: this.userId });
          }
          this.fundListM = res.fundListM ? res.fundListM : [];
          this.seciList = res.seciList ? res.seciList : ["1.000001", "1.000300", "0.399001", "0.399006"];
          this.showGSZ = res.showGSZ ? res.showGSZ : false;
          this.showCost = res.showCost ? res.showCost : false;
          this.showCostRate = res.showCostRate ? res.showCostRate : false;
          this.darkMode = res.darkMode ? res.darkMode : false;
          this.normalFontSize = res.normalFontSize ? res.normalFontSize : false;
          this.showBadge = res.showBadge ? res.showBadge : 1;
          this.BadgeContent = res.BadgeContent ? res.BadgeContent : 1;
          this.BadgeType = res.BadgeType ? res.BadgeType : 1;
          this.RealtimeFundcode = res.RealtimeFundcode;
          this.RealtimeIndcode = res.RealtimeIndcode;
          
          // Load real-time data
          this.getData();
        }
      );
    },
    manualSave(showMessage) {
      chrome.storage.sync.set(
        {
           fundListM: this.fundListM,
           seciList: this.seciList,
           showGSZ: this.showGSZ,
           showAmount: this.showAmount,
           showGains: this.showGains,
           showCost: this.showCost,
           showCostRate: this.showCostRate,
           darkMode: this.darkMode,
           normalFontSize: this.normalFontSize,
           showBadge: this.showBadge,
           BadgeContent: this.BadgeContent,
           BadgeType: this.BadgeType,
           RealtimeFundcode: this.RealtimeFundcode,
           RealtimeIndcode: this.RealtimeIndcode
        },
        () => {
           chrome.runtime.sendMessage({ type: "refreshOption", data: { type: "all" } });
           chrome.runtime.sendMessage({ type: "refresh" });
           if (showMessage) {
             this.$message({
                message: '保存成功',
                type: 'success'
             });
           }
        }
      );
    },
    
    // --- Data Fetching & Calculation ---
    getData() {
      if (this.fundListM.length === 0) {
        this.dataList = [];
        return;
      }
      let fundlist = this.fundListM.map((val) => val.code).join(",");
      let url =
        "https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=200&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=" +
        this.userId +
        "&Fcodes=" +
        fundlist;
      this.$axios
        .get(url)
        .then((res) => {
          let datas = res.data.Datas || [];
          let dataList = [];
          let apiDataMap = {};
          datas.forEach((val) => {
            apiDataMap[val.FCODE] = val;
          });

          this.fundListM.forEach((localFund) => {
            let val = apiDataMap[localFund.code];
            let dataItem = {};

            if (val) {
              dataItem = {
                fundcode: val.FCODE,
                name: val.SHORTNAME,
                jzrq: val.PDATE,
                dwjz: isNaN(val.NAV) ? null : val.NAV,
                gsz: isNaN(val.GSZ) ? "--" : val.GSZ,
                gszzl: isNaN(val.GSZZL) ? 0 : val.GSZZL,
                gztime: val.GZTIME,
              };
              if (val.PDATE != "--" && val.PDATE == val.GZTIME.substr(0, 10)) {
                dataItem.gsz = val.NAV;
                dataItem.gszzl = isNaN(val.NAVCHGRT) ? 0 : val.NAVCHGRT;
                dataItem.hasReplace = true;
              }
            } else {
              dataItem = {
                fundcode: localFund.code,
                name: localFund.name || "暂无数据",
                jzrq: "--",
                dwjz: null,
                gsz: "--",
                gszzl: 0,
                gztime: "--",
                hasReplace: false,
              };
            }

            dataItem.num = localFund.num;
            dataItem.cost = localFund.cost;

            if (dataItem.dwjz !== null && dataItem.dwjz !== undefined) {
                dataItem.amount = this.calculateMoney(dataItem);
                dataItem.gains = this.calculate(dataItem, dataItem.hasReplace);
                dataItem.costGains = this.calculateCost(dataItem);
                dataItem.costGainsRate = this.calculateCostRate(dataItem);
            } else {
                dataItem.amount = 0;
                dataItem.gains = 0;
                dataItem.costGains = 0;
                dataItem.costGainsRate = 0;
            }
            dataList.push(dataItem);
          });
          this.dataList = dataList;
        })
        .catch((error) => {
          console.error("getData error:", error);
           this.dataList = this.fundListM.map(f => ({
             fundcode: f.code,
             name: f.name,
             num: f.num,
             cost: f.cost,
             gsz: "--",
             amount: 0,
             gains: 0,
             costGains: 0,
             costGainsRate: 0
           }));
        });
    },
    calculateMoney(val) {
      let sum = (val.dwjz * val.num).toFixed(2);
      return sum;
    },
    calculate(val, hasReplace) {
      var sum = 0;
      let num = val.num ? val.num : 0;
      if (hasReplace) {
        sum = ((val.dwjz - val.dwjz / (1 + val.gszzl * 0.01)) * num).toFixed(2);
      } else {
        if (val.gsz && val.gsz != "--") {
           sum = ((val.gsz - val.dwjz) * num).toFixed(2);
        }
      }
      return sum;
    },
    calculateCost(val) {
      if (val.cost) {
        let sum = ((val.dwjz - val.cost) * val.num).toFixed(2);
        return sum;
      } else {
        return 0;
      }
    },
    calculateCostRate(val) {
      if (val.cost && val.cost != 0) {
        let sum = (((val.dwjz - val.cost) / val.cost) * 100).toFixed(2);
        return sum;
      } else {
        return 0;
      }
    },
    changeNum(item) {
      debounce(() => {
        for (let fund of this.fundListM) {
          if (fund.code == item.fundcode) {
            fund.num = item.num;
          }
        }
        chrome.storage.sync.set(
          {
            fundListM: this.fundListM,
          },
          () => {
             // Re-calculate for display
             item.amount = this.calculateMoney(item);
             item.gains = this.calculate(item, item.hasReplace);
             item.costGains = this.calculateCost(item);
             // Notify background
             chrome.runtime.sendMessage({ type: "refresh" });
          }
        );
      });
    },
    
    // --- Fund Management Methods ---
    
    remoteSearchFund(query) {
      if (query !== "") {
        this.searchLoading = true;
        let url =
          "https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?&m=9&key=" +
          query +
          "&_=" +
          new Date().getTime();
        this.$axios.get(url).then((res) => {
          res.data.Datas.forEach((val) => {
            this.nameCache[val.CODE] = val.NAME;
          });
          this.searchOptions = res.data.Datas.filter((val) => {
            let hasCode = this.fundListM.some((currentValue) => {
              return currentValue.code == val.CODE;
            });
            return !hasCode;
          }).map((val) => {
            return {
              value: val.CODE,
              label: val.NAME,
            };
          });
          this.searchLoading = false;
        });
      } else {
        this.searchOptions = [];
      }
    },
    saveFund() {
      if (!this.searchFundCode || this.searchFundCode.length === 0) return;
      
      this.searchFundCode.forEach((code) => {
        let exists = this.fundListM.some(item => item.code == code);
        if (!exists) {
          let name = this.nameCache[code];
          let val = {
            code: code,
            name: name,
            num: 0,
            cost: 0
          };
          this.fundListM.push(val);
        }
      });
      this.searchFundCode = [];
      this.searchOptions = [];
      this.manualSave(false);
      setTimeout(() => { this.getData(); }, 500);
    },
    dltFund(code) {
       this.$confirm('确认删除该基金吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fundListM = this.fundListM.filter(ele => ele.code != code);
          this.dataList = this.dataList.filter(ele => ele.fundcode != code);
          if (code == this.RealtimeFundcode) {
             this.RealtimeFundcode = null;
          }
          this.manualSave(false);
        }).catch(() => {});
    },
    sltBadge(id) {
      if (id == this.RealtimeFundcode) {
         this.RealtimeFundcode = null;
      } else {
         this.RealtimeFundcode = id;
      }
      this.manualSave(false);
    },

    // --- Index Management Methods ---
    saveSeci() {
      if (!this.sltSeci) return;
      this.seciList.push(this.sltSeci);
      this.sltSeci = "";
      this.manualSave(false);
    },
    dltIndFund(index) {
       this.seciList.splice(index, 1);
       this.manualSave(false);
    },
    sltIndBadge(code) {
       if (code == this.RealtimeIndcode) {
         this.RealtimeIndcode = null;
      } else {
         this.RealtimeIndcode = code;
      }
      this.manualSave(false);
    },


    // --- Drag and Drop ---
    handleDragStart(e, item, type) {
      this.dragging = { item, type };
    },
    handleDragOver(e) {
      e.dataTransfer.dropEffect = "move";
    },
    handleDragEnd(e, type) {
      this.dragging = null;
      this.manualSave(false);
    },
    handleDragEnter(e, item, index, type) {
      if (!this.dragging || this.dragging.type !== type) return;
      e.dataTransfer.effectAllowed = "move";
      
      if (type === 'fund') {
         if (item.fundcode === this.dragging.item.fundcode) return;
         // Reorder fundListM
         const newItems = [...this.fundListM];
         const src = newItems.findIndex((n) => n.code == this.dragging.item.fundcode);
         const dst = newItems.findIndex((n) => n.code == item.fundcode);
         newItems.splice(dst, 0, ...newItems.splice(src, 1));
         this.fundListM = newItems;
         
         // Reorder dataList (visual)
         const newData = [...this.dataList];
         const srcD = newData.findIndex((n) => n.fundcode == this.dragging.item.fundcode);
         const dstD = newData.findIndex((n) => n.fundcode == item.fundcode);
         newData.splice(dstD, 0, ...newData.splice(srcD, 1));
         this.dataList = newData;
         
      } else if (type === 'ind') {
         if (item.value === this.dragging.item.value) return;
         const newItems = [...this.seciList];
         const src = newItems.findIndex((n) => n == this.dragging.item.value);
         const dst = newItems.findIndex((n) => n == item.value);
         newItems.splice(dst, 0, ...newItems.splice(src, 1));
         this.seciList = newItems;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-width: 630px;
  min-height: 520px;
  padding: 15px 15px 50px;
  font-size: 13px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  color: #303133;
}

.section-block {
  margin-bottom: 25px;
  background: #fff;
  border-radius: 4px;
  padding: 10px;
  border: 1px solid #ebeef5;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 15px;
  color: #303133;
}

.setting-row {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  
  .label {
    width: 80px;
    text-align: right;
    margin-right: 10px;
    font-weight: bold;
  }
}


.management-container {
  text-align: left;
}

.input-row {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tips {
  font-size: 12px;
  color: #909399;
  margin: 5px 0 10px;
}

.manage-table {
  width: 100%;
  border-collapse: collapse;
  th {
    background-color: #f5f7fa;
    color: #909399;
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #ebeef5;
  }
  td {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #ebeef5;
  }
  .draggable-item {
    cursor: move;
    &:hover {
      background-color: #f5f7fa;
    }
  }
}

.up {
  color: #f56c6c;
}

.down {
  color: #4eb61b;
}

.btn {
  display: inline-block;
  line-height: 1;
  cursor: pointer;
  background: #fff;
  padding: 6px 8px;
  border-radius: 3px;
  font-size: 14px;
  color: #606266;
  margin: 0 5px;
  outline: none;
  border: 1px solid #dcdfe6;
  transition: 0.1s;
  &:focus {
     border-color: #409eff;
  }
}
.btn.num {
  width: 80px;
}
.btn.edit {
  padding: 2px 5px;
}
.slt {
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}

.tab-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tab-col {
  width: 140px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  text-align: center;
  background: #fff;
  h5 {
    margin: 5px 0;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #303133;
  }
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  padding: 10px 0;
  border-top: 1px solid #ebeef5;
  text-align: center;
  z-index: 100;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}

// 暗黑主题
.container.darkMode {
  color: rgba($color: #ffffff, $alpha: 0.6);
  background-color: #121212;
  
  .section-block {
     background-color: #1e1e1e;
     border-color: #333;
  }
  
  .section-title {
     color: rgba($color: #ffffff, $alpha: 0.9);
     border-bottom-color: #333;
  }
  
  .footer-bar {
     background-color: #1e1e1e;
     border-top-color: #333;
  }
  
  .btn {
    background-color: rgba($color: #ffffff, $alpha: 0.1);
    color: rgba($color: #ffffff, $alpha: 0.6);
    border: 1px solid rgba($color: #ffffff, $alpha: 0.2);
    &:focus {
      border-color: #409eff;
    }
  }
  
  .manage-table {
    th {
      background-color: rgba($color: #ffffff, $alpha: 0.05);
      color: rgba($color: #ffffff, $alpha: 0.6);
      border-bottom: 1px solid rgba($color: #ffffff, $alpha: 0.1);
    }
    td {
      border-bottom: 1px solid rgba($color: #ffffff, $alpha: 0.1);
    }
    .draggable-item:hover {
      background-color: rgba($color: #ffffff, $alpha: 0.08);
    }
  }

  .tab-col {
     background-color: rgba($color: #ffffff, $alpha: 0.05);
     border: 1px solid rgba($color: #ffffff, $alpha: 0.1);
     h5 {
        color: rgba($color: #ffffff, $alpha: 0.8);
     }
  }
  
  // Reuse existing styles...
  ::v-deep .el-switch__label.is-active {
    color: rgba($color: #409eff, $alpha: 0.87);
  }
  ::v-deep .el-switch__label {
    color: rgba($color: #ffffff, $alpha: 0.6);
  }
  ::v-deep .el-checkbox {
      color: rgba($color: #ffffff, $alpha: 0.6);
  }
  
  // Radio fix
  ::v-deep .el-radio {
    color: rgba($color: #ffffff, $alpha: 0.6);
  }

  
  // Input/Select
   ::v-deep .el-input__inner {
    background-color: rgba($color: #ffffff, $alpha: 0.1);
    color: rgba($color: #ffffff, $alpha: 0.8);
    border-color: rgba($color: #ffffff, $alpha: 0.2);
  }
}
</style>