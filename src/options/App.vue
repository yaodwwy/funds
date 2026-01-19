<template>
  <div id="app" class="container" :class="containerClass">
    <div>
      <ul class="setting-list">
        <li>
          <div class="list-title">
            角标展示设置
          </div>
          <div class="select-row">
            角标开关：
            <el-radio-group
              v-model="showBadge"
              @change="changeOption($event, 'showBadge', true)"
            >
              <el-radio border :label="1">打开角标</el-radio>
              <el-radio border :label="2">关闭角标</el-radio>
            </el-radio-group>
          </div>
          <div v-if="showBadge == 1" class="select-row">
            角标内容：
            <el-radio-group
              v-model="BadgeContent"
              @change="changeOption($event, 'BadgeContent', true)"
            >
              <el-radio border :label="1">单个基金</el-radio>
              <el-radio border :label="2">所有基金</el-radio>
              <el-radio border :label="3">单个指数</el-radio>
            </el-radio-group>
          </div>
          <div v-if="showBadge == 1 && BadgeContent != 3" class="select-row">
            角标类型：
            <el-radio-group
              v-model="BadgeType"
              @change="changeOption($event, 'BadgeType', true)"
            >
              <el-radio border :label="1">日收益率</el-radio>
              <el-radio border :label="2">日收益额</el-radio>
            </el-radio-group>
          </div>
          <p style="margin-top:5px">
            tips：若选择单个基金，请打开编辑按钮中的特别关注选项；若要计算收益额，需要先打开显示持有金额开关，在编辑中填写基金对应的持有额。
          </p>
        </li>
        <li>
          <div class="list-title">
            主题与页面设置
          </div>
          <div class="select-row">
            <el-switch
              v-model="darkMode"
              @change="changeDarkMode"
              active-color="#484848"
              inactive-color="#13ce66"
              inactive-text="标准模式"
              active-text="暗色模式"
            >
            </el-switch>
          </div>
          <div class="select-row">
            <el-switch
              v-model="normalFontSize"
              @change="changeFontSize"
              inactive-text="迷你字号"
              active-text="标准字号"
            >
            </el-switch>
          </div>
        </li>

        <li>
          <div class="list-title">
            基金列表展示内容设置
          </div>
          <div class="select-row">
            <span>显示估算净值</span>
            <el-switch
              v-model="showGSZ"
              @change="changeOption($event, 'showGSZ')"
            >
            </el-switch>
          </div>
          <div class="select-row">
            <span>显示持有金额</span>
            <el-switch
              v-model="showAmount"
              @change="changeOption($event, 'showAmount')"
            >
            </el-switch>
          </div>
          <div class="select-row">
            <span>显示估值收益</span>
            <el-switch
              v-model="showGains"
              @change="changeOption($event, 'showGains')"
            >
            </el-switch>
          </div>
          <div class="select-row">
            <span>显示持有收益</span>
            <el-switch
              v-model="showCost"
              @change="changeOption($event, 'showCost')"
            >
            </el-switch>
          </div>
          <div class="select-row">
            <span>显示持有收益率</span>
            <el-switch
              v-model="showCostRate"
              @change="changeOption($event, 'showCostRate')"
            >
            </el-switch>
          </div>
          <p>
            tips：在编辑设置里，输入持有份额可计算当日估值收益。输入持仓成本可计算累计持有收益。
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const { version } = require("../../package.json");
export default {
  components: {
  },
  data() {
    return {
      fundListM: null,
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
    changeOption(val, type, sendMessage) {
      chrome.storage.sync.set(
        {
          [type]: val,
        },
        () => {
          this[type] = val;
          if (sendMessage) {
            chrome.runtime.sendMessage({
              type: "refreshOption",
              data: { type: type, value: val },
            });
          }
        }
      );
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
        ],
        (res) => {
          if (res.showNum) {
            //解决版本遗留问题，拆分属性
            chrome.storage.sync.set({
              showNum: false,
            });
            chrome.storage.sync.set(
              {
                showAmount: true,
              },
              () => {
                this.showAmount = true;
              }
            );
            chrome.storage.sync.set(
              {
                showGains: true,
              },
              () => {
                this.showGains = true;
              }
            );
          } else {
            this.showAmount = res.showAmount ? res.showAmount : false;
            this.showGains = res.showGains ? res.showGains : false;
          }

          if (res.userId) {
            this.userId = res.userId;
          } else {
            this.userId = this.getGuid();
            chrome.storage.sync.set({
              userId: this.userId,
            });
          }
          this.fundListM = res.fundListM ? res.fundListM : [];
          this.showGSZ = res.showGSZ ? res.showGSZ : false;
          this.showCost = res.showCost ? res.showCost : false;
          this.showCostRate = res.showCostRate ? res.showCostRate : false;
          this.darkMode = res.darkMode ? res.darkMode : false;
          this.normalFontSize = res.normalFontSize ? res.normalFontSize : false;
          this.showBadge = res.showBadge ? res.showBadge : 1;
          this.BadgeContent = res.BadgeContent ? res.BadgeContent : 1;
          this.BadgeType = res.BadgeType ? res.BadgeType : 1;
        }
      );
    },
    changeDarkMode() {
      chrome.storage.sync.set({
        darkMode: this.darkMode,
      });
    },
    changeFontSize() {
      chrome.storage.sync.set({
        normalFontSize: this.normalFontSize,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-width: 630px;
  min-height: 520px;
  text-align: center;
  padding: 15px 0;
  font-size: 13px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.setting-list {
  width: 600px;
  margin: 0 auto;
  text-align: left;
  padding: 0 10px 10px;
  border-radius: 8px;
}

.setting-list li {
  list-style: none;
  font-size: 16px;
  border-bottom: 1px solid #dddddd;
  padding: 10px 0;
}

.setting-list li p {
  margin: 0;
  font-size: 14px;
  color: #999999;
}

.list-title {
  min-height: 34px;
  line-height: 34px;
  font-weight: bold;
}

.select-row {
  line-height: 35px;
  padding-left: 20px;
  & > span {
    display: inline-block;
    width: 120px;
    margin-right: 3px;
    text-align: right;
  }
  input,
  label {
    cursor: pointer;
  }

  .el-radio {
    margin-right: 0;
  }
}

.btn {
  display: inline-block;
  line-height: 1;
  cursor: pointer;
  background: #fff;
  padding: 6px 8px;
  border-radius: 3px;
  font-size: 14px;
  color: #000000;
  margin: 0 5px;
  outline: none;
  border: 1px solid #dcdfe6;
}

.exportBtn {
  visibility: hidden;
}

.uploadFile {
  text-decoration: none;
  display: inline-flex;
  position: relative;
  overflow: hidden;
}

.uploadFile input {
  position: absolute;
  font-size: 100px;
  cursor: pointer;
  right: 0;
  top: 0;
  opacity: 0;
}

.btn[disabled] {
  color: #aaaaaa;
}

.icon-btn-row {
  position: relative;
  cursor: pointer;
}

.githubIcon {
  position: absolute;
  top: -4px;
  left: 12px;
}
.githubText {
  padding-left: 30px;
  padding: 8px 8px 8px 36px;
}

.tips {
  font-size: 12px;
  margin: 0;
  color: #aaaaaa;
  line-height: 1.4;
  padding: 5px 15px;
}
.primary {
  color: #409eff;
  border-color: #409eff;
}

.black {
  color: #24292e;
  border-color: #24292e;
}

//暗黑主题
.container.darkMode {
  color: rgba($color: #ffffff, $alpha: 0.6);
  background-color: #121212;
  .btn {
    background-color: rgba($color: #ffffff, $alpha: 0.16);
    color: rgba($color: #ffffff, $alpha: 0.6);
    border: 1px solid rgba($color: #ffffff, $alpha: 0.6);
  }
  .primary {
    border: 1px solid rgba($color: #409eff, $alpha: 0.6);
    background-color: rgba($color: #409eff, $alpha: 0.6);
  }

  .setting-list {
    background-color: rgba($color: #ffffff, $alpha: 0.11);
  }

  .setting-list li {
    border-bottom: 1px solid rgba($color: #ffffff, $alpha: 0.38);
  }

  ::v-deep .el-switch__label.is-active {
    color: rgba($color: #409eff, $alpha: 0.87);
  }
  ::v-deep .el-switch__label {
    color: rgba($color: #ffffff, $alpha: 0.6);
  }

  ::v-deep .el-switch.is-checked .el-switch__core {
    border: 1px solid rgba($color: #409eff, $alpha: 0.6);
    background-color: rgba($color: #409eff, $alpha: 0.6);
  }

  ::v-deep .el-radio__input.is-checked + .el-radio__label {
    color: rgba($color: #409eff, $alpha: 0.87);
  }
  ::v-deep .el-radio__input.is-checked .el-radio__inner {
    background-color: rgba($color: #409eff, $alpha: 0.6);
    border: 1px solid rgba($color: #409eff, $alpha: 0.6);
  }
  ::v-deep .el-radio.is-bordered.is-checked {
    border: 1px solid rgba($color: #409eff, $alpha: 0.6);
  }
  ::v-deep .el-radio.is-bordered {
    border: 1px solid rgba($color: #ffffff, $alpha: 0.6);
  }
  ::v-deep .el-radio {
    color: rgba($color: #ffffff, $alpha: 0.6);
  }
}
</style>
