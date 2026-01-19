# API 文档

本文档列出了 "Choose Funds" 项目中使用的 API，所有信息均提取自源代码。

## 1. 基金列表信息 (Fund Information)

*   **描述**: 获取一组基金的实时信息。
*   **URL**: `https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo`
*   **方法**: `GET`
*   **参数**:
    *   `pageIndex`: 页码 (例如 `1`)
    *   `pageSize`: 每页数量 (例如 `200`)
    *   `plat`: 平台 (例如 `Android`)
    *   `appType`: 应用类型 (例如 `ttjj`)
    *   `product`: 产品 (例如 `EFund`)
    *   `Version`: 版本 (例如 `1`)
    *   `deviceid`: 设备 ID
    *   `Fcodes`: 基金代码列表，逗号分隔 (例如 `001618,001186`)
*   **字段映射**:
    *   `SHORTNAME` -> `name` (基金名称)
    *   `FCODE` -> `fundcode` (基金代码)
    *   `NAV` -> `dwjz` (单位净值)
    *   `GSZ` -> `gsz` (估算净值)
    *   `GSZZL` -> `gszzl` (涨跌幅/估算涨幅)
    *   `GZTIME` -> `gztime` (更新时间)
*   **来源**: `src/options/App.vue`, `src/popup/App.vue`, `src/background.js`

## 2. 节假日信息 (Holiday Information)

*   **描述**: 获取节假日安排数据，用于判断交易日。
*   **URL (当前项目使用)**: `https://x2rr.github.io/funds/holiday.json`
*   **推荐替代方案 (holiday-cn)**: 
    *   **GitHub**: `https://github.com/NateScarlet/holiday-cn`
    *   **CDN 地址**: `https://cdn.jsdelivr.net/gh/NateScarlet/holiday-cn@master/{year}.json` (例如 `2024.json`)
*   **方法**: `GET`
*   **来源**: `src/options/App.vue`, `src/background.js`

## 3. 基金搜索 (Fund Search)

*   **描述**: 根据关键字搜索基金。
*   **URL**: `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx`
*   **方法**: `GET`
*   **参数**:
    *   `m`: 模式 (例如 `9`)
    *   `key`: 搜索关键字
    *   `_`: 时间戳
*   **字段映射**:
    *   `NAME` -> `label` (名称)
    *   `CODE` -> `value` (代码)
*   **来源**: `src/popup/App.vue`

## 4. 证券/指数信息 (Securities/Indices Information)

*   **描述**: 获取证券或指数的实时数据。
*   **URL**: `https://push2.eastmoney.com/api/qt/ulist.np/get`
*   **方法**: `GET`
*   **参数**:
    *   `fltt`: 浮点类型 (例如 `2`)
    *   `fields`: 请求字段 (例如 `f2,f3,f4,f12,f13,f14`)
    *   `secids`: 证券 ID 列表，逗号分隔 (例如 `1.000001,1.000300`)
    *   `_`: 时间戳
*   **字段映射**:
    *   `f14` -> 名称 (如：上证指数)
    *   `f2` -> 当前点数
    *   `f4` -> 涨跌额
    *   `f3` -> 涨跌幅 (%)
    *   `f12`, `f13` -> 用于组合 ID
*   **来源**: `src/popup/App.vue`, `src/background.js`, `src/common/positionDetail.vue`, `src/common/marketLine.vue`

## 5. 基金持仓详情 (Fund Position Details)

*   **描述**: 获取特定基金的股票持仓详情。
*   **URL**: `https://fundmobapi.eastmoney.com/FundMNewApi/FundMNInverstPosition`
*   **方法**: `GET`
*   **参数**:
    *   `FCODE`: 基金代码
    *   `deviceid`: `Wap`
    *   `plat`: `Wap`
    *   `product`: `EFund`
    *   `version`: `2.0.0`
    *   `Uid`: 用户 ID (可选)
    *   `_`: 时间戳
*   **字段映射**:
    *   `GPJC` -> 股票名称
    *   `GPDM` -> 股票代码
    *   `JZBL` -> 持仓占比 (%)
    *   `PCTNVCHG` -> 较上期 (%)
*   **来源**: `src/common/positionDetail.vue`

## 6. 资金流向 (实时分钟级) (Market Flows - Real-time Minute)

*   **描述**: 获取实时资金流向数据 (北向/南向)。
*   **URL**: `http://push2.eastmoney.com/api/qt/kamt.rtmin/get`
*   **方法**: `GET`
*   **参数**:
    *   `fields1`: `f1,f2,f3,f4`
    *   `fields2`: `f51,f52,f53,f54,f55,f56`
    *   `ut`: 更新时间 (可选)
    *   `v`: 时间戳
*   **字段映射**:
    *   `s2n` (北向/沪深股通):
        *   索引 1: 沪股通当日常净流入
        *   索引 2: 沪股通当日余额
        *   索引 3: 深股通当日净流入
        *   索引 4: 深股通当日余额
        *   索引 5: 北向资金当日净流入
    *   `n2s` (南向/港股通):
        *   索引 1: 港股通(沪)当日净流入
        *   索引 2: 港股通(沪)当日余额
        *   索引 3: 港股通(深)当日净流入
        *   索引 4: 港股通(深)当日余额
        *   索引 5: 南向资金当日净流入
*   **来源**: `src/common/marketS2N.vue`, `src/common/marketN2S.vue`

## 7. 资金流向 K线 (Market Flow Kline)

*   **描述**: 获取资金流向的 K 线数据。
*   **URL**: `http://push2.eastmoney.com/api/qt/stock/fflow/kline/get`
*   **方法**: `GET`
*   **参数**:
    *   `lmt`: 限制 (例如 `0`)
    *   `klt`: K线类型 (例如 `1`)
    *   `secid`: 证券 ID 1 (例如 `1.000001`)
    *   `secid2`: 证券 ID 2 (例如 `0.399001`)
    *   `fields1`: `f1,f2,f3,f7`
    *   `fields2`: `f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63`
    *   `_`: 时间戳
*   **字段映射**:
    *   索引 1: 主力净流入
    *   索引 5: 超大单净流入
    *   索引 4: 大单净流入
    *   索引 3: 中单净流入
    *   索引 2: 小单净流入
*   **来源**: `src/common/marketLine.vue`

## 8. 市场柱状图数据 (Market Bar Chart Data)

*   **描述**: 获取市场柱状图数据。
*   **URL**: `http://push2.eastmoney.com/api/qt/clist/get`
*   **方法**: `GET`
*   **参数**:
    *   `pn`: 页码 (例如 `1`)
    *   `pz`: 每页数量 (例如 `500`)
    *   `po`: 排序方式 (例如 `1`)
    *   `np`: 不分页 (例如 `1`)
    *   `fields`: `f12,f13,f14,f62`
    *   `fid`: 排序字段 (例如 `f62`)
    *   `fs`: 过滤字符串 (例如 `m:90+t:2`)
    *   `_`: 时间戳
*   **字段映射**:
    *   `f14` -> 名称 (板块/行业)
    *   `f62` -> 主力净流入金额
*   **来源**: `src/common/marketBar.vue`

## 9. 基金经理列表 (Fund Manager List)

*   **描述**: 获取基金的历任经理列表。
*   **URL**: `https://fundmobapi.eastmoney.com/FundMApi/FundManagerList.ashx`
*   **方法**: `GET`
*   **参数**:
    *   `FCODE`: 基金代码
    *   `deviceid`: `Wap`
    *   `plat`: `Wap`
    *   `product`: `EFund`
    *   `version`: `2.0.0`
    *   `Uid`: 用户 ID
    *   `_`: 时间戳
*   **字段映射**:
    *   `FEMPDATE` -> 起始期
    *   `LEMPDATE` -> 截止期
    *   `MGRNAME` -> 基金经理
    *   `DAYS` -> 任职期 (天)
    *   `PENAVGROWTH` -> 任职涨幅 (%)
*   **来源**: `src/common/managerDetail.vue`

## 10. 基金经理详情 (Fund Manager Detail)

*   **描述**: 获取基金经理的详细信息。
*   **URL**: `https://fundmobapi.eastmoney.com/FundMApi/FundMangerDetail.ashx`
*   **方法**: `GET`
*   **参数**:
    *   `FCODE`: 基金代码
    *   `deviceid`: `Wap`
    *   `plat`: `Wap`
    *   `product`: `EFund`
    *   `version`: `2.0.0`
    *   `Uid`: 用户 ID
    *   `_`: 时间戳
*   **字段映射**:
    *   `PHOTOURL` -> 照片 URL
    *   `MGRNAME` -> 姓名
    *   `FEMPDATE` -> 上任日期
    *   `DAYS` -> 管理年限
    *   `RESUME` -> 简历/简介
*   **来源**: `src/common/managerDetail.vue`

## 11. 股票/指数走势 (Stock Trends)

*   **描述**: 获取股票或指数的分钟级走势数据。
*   **URL**: `https://push2.eastmoney.com/api/qt/stock/trends2/get`
*   **方法**: `GET`
*   **参数**:
    *   `secid`: 证券 ID (例如 `1.000001`)
    *   `fields1`: `f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13`
    *   `fields2`: `f51,f53,f56,f58`
    *   `iscr`: `0`
    *   `iscca`: `0`
    *   `ndays`: `1`
    *   `forcect`: `1`
*   **字段映射**:
    *   `prePrice` -> 昨日收盘价
    *   `trends` 列表项:
        *   索引 1: 价格
        *   索引 2: 成交量
*   **来源**: `src/common/indDetail.vue`

## 12. 基金基本信息 (Fund Base Information)

*   **描述**: 获取基金的基本概况信息。
*   **URL**: `https://fundmobapi.eastmoney.com/FundMApi/FundBaseTypeInformation.ashx`
*   **方法**: `GET`
*   **参数**:
    *   `FCODE`: 基金代码
    *   `deviceid`: `Wap`
    *   `plat`: `Wap`
    *   `product`: `EFund`
    *   `version`: `2.0.0`
    *   `Uid`: 用户 ID
    *   `_`: 时间戳
*   **字段映射**:
    *   `SYL_Y`, `RANKM` -> 近1月收益率 / 排名
    *   `SYL_3Y`, `RANKQ` -> 近3月收益率 / 排名
    *   `SYL_6Y`, `RANKHY` -> 近6月收益率 / 排名
    *   `SYL_1N`, `RANKY` -> 近1年收益率 / 排名
    *   `DWJZ` -> 单位净值
    *   `FSRQ` -> 净值日期
    *   `LJJZ` -> 累计净值
    *   `FTYPE` -> 基金类型
    *   `JJGS` -> 基金公司
    *   `JJJL` -> 基金经理
    *   `SGZT` -> 申购状态
    *   `SHZT` -> 赎回状态
    *   `ENDNAV` -> 基金规模
    *   `FUNDBONUS` -> 分红信息
*   **来源**: `src/common/fundInfo.vue`

## 13. 基金收益走势 (Fund Yield Diagram)

*   **描述**: 获取基金的历史收益率走势数据。
*   **URL**: `https://fundmobapi.eastmoney.com/FundMApi/FundYieldDiagramNew.ashx`
*   **方法**: `GET`
*   **参数**:
    *   `FCODE`: 基金代码
    *   `RANGE`: 时间范围 (例如 `y` 表示一年, `3y`, `n`)
    *   `deviceid`: `Wap`
    *   `plat`: `Wap`
    *   `product`: `EFund`
    *   `version`: `2.0.0`
    *   `_`: 时间戳
*   **字段映射**:
    *   `YIELD` -> 涨幅 (%)
    *   `INDEXYIED` -> 指数涨幅 (用于对比)
    *   `PDATE` -> 日期
*   **来源**: `src/common/charts2.vue`

## 14. 基金净值走势 (Fund Net Diagram)

*   **描述**: 获取基金的历史净值走势数据。
*   **URL**: `https://fundmobapi.eastmoney.com/FundMApi/FundNetDiagram.ashx`
*   **方法**: `GET`
*   **参数**:
    *   `FCODE`: 基金代码
    *   `RANGE`: 时间范围
    *   `deviceid`: `Wap`
    *   `plat`: `Wap`
    *   `product`: `EFund`
    *   `version`: `2.0.0`
    *   `_`: 时间戳
*   **字段映射**:
    *   `DWJZ` -> 单位净值
    *   `LJJZ` -> 累计净值
    *   `JZZZL` -> 日增长率
    *   `FSRQ` -> 日期
*   **来源**: `src/common/charts2.vue`

## 15. 基金估值详情 (Fund Valuation Detail)

*   **描述**: 获取基金的日内实时估值详情。
*   **URL**: `https://fundmobapi.eastmoney.com/FundMApi/FundVarietieValuationDetail.ashx`
*   **方法**: `GET`
*   **参数**:
    *   `FCODE`: 基金代码
    *   `deviceid`: `Wap`
    *   `plat`: `Wap`
    *   `product`: `EFund`
    *   `version`: `2.0.0`
    *   `_`: 时间戳
*   **字段映射**:
    *   `trends` 列表项:
        *   索引 0: 时间
        *   索引 2: 估算涨跌幅 (%)
*   **来源**: `src/common/charts.vue`

## 16. 测试环境配置 (Test Environment Configuration)

*   **文件**: `tests/http-client.env.json`
*   **描述**: 本项目使用 `http-client.env.json` 配置 HTTP 请求文件的测试变量。以下是配置的变量及其用途。
*   **变量列表**:
    *   `deviceid`: 设备 ID，用于模拟请求 (示例: `1234567890`)
    *   `timestamp`: 时间戳，用于 API 鉴权或时效性检查 (示例: `1625097600000`)
    *   `fundCode`: 基金代码，用于测试基金相关接口 (示例: `001618`)
    *   `stockCode`: 股票/证券代码 (带市场标识)，用于测试股票相关接口 (示例: `1.600519`)
    *   `indexCode1`: 指数代码 1 (带市场标识)，用于测试指数或资金流向接口 (示例: `1.000001`)
    *   `indexCode2`: 指数代码 2 (带市场标识)，用于测试指数或资金流向接口 (示例: `0.399001`)
    *   `secIds`: 证券 ID 列表，逗号分隔，用于批量获取信息 (示例: `1.000001,1.000300`)
    *   `pageIndex`: 分页页码 (示例: `1`)
    *   `pageSize`: 分页大小 (示例: `200`)
