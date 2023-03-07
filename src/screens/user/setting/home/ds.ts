/*
 * @Author: czy0729
 * @Date: 2022-07-18 10:48:47
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-02-04 19:00:33
 */
import { SETTING_HOME_GRID_COVER_LAYOUT } from '@constants'

export const HOME_COUNT_VIEW = {
  A: '4 / 12',
  B: '4 / 6 (12)',
  C: '4 / 12 (6)',
  D: '4 / 6 / 12'
}

export const HOME_SORTING_INFORMATION = {
  APP: '当季放送 > 当季未看 > 未看 > 网页',
  放送: '放送中 > 明天放送 > 网页',
  网页: '与网页 bgm.tv 一致'
} as const

export const VALUES = ['全部', '基本', '隐藏'] as const

export const TEXTS = {
  homeLayout: {
    setting: {
      title: '布局'
    },
    list: {
      title: '列表'
    },
    grid: {
      title: '网格'
    }
  },
  homeListLimit: {
    hd: '列表最大显示'
  },
  homeGridCoverLayout: {
    hd: '封面形状',
    information: '开启网格布局时条目封面形状',
    search: SETTING_HOME_GRID_COVER_LAYOUT.map(item => item.label).join()
  },
  homeGridTitle: {
    hd: '条目下方显示标题'
  },
  homeGridEpAutoAdjust: {
    hd: '自动调整章节按钮大小',
    information:
      '因网格模式高度有限只够放 3 排按钮\n对章节较少的条目，按钮宽度自适应尽量铺满'
  },
  homeCountView: {
    title: '放送数字显示',
    information: '自定义显示组合\n例：4 代表看到，6 代表已放送，12 代表总集数',
    search: HOME_COUNT_VIEW
  },
  homeCustom: {
    hd: '右上角功能入口'
  },
  homeICS: {
    hd: '放送提醒菜单增加导出 ICS',
    information: 'ICS 文件是一种以通用日历格式保存的日历文件，利于跨设备日程同步'
  },
  homeEpStartAtLastWathed: {
    hd: '长篇动画从最后看过开始显示'
  },
  homeSorting: {
    title: '排序',
    information:
      '若需要使当前没有能观看章节的番剧不靠前，建议打开下方的条目自动下沉设置',
    search: HOME_SORTING_INFORMATION
  },
  homeOrigin: {
    hd: '收藏项右侧菜单',
    information:
      '收藏项右侧按钮组显示菜单按钮\n全部 = 基本 (置顶、收起展开、提醒) + 源头数据菜单',
    search: VALUES
  },
  homeOnAir: {
    hd: '一直显示放送时间',
    information: '不开启时只有在条目今天或者明天放送时才显示具体放送时间'
  },
  homeSortSink: {
    hd: '条目自动下沉',
    information: '当条目没有未观看的已放送章节时，自动下沉到底'
  },
  showGame: {
    hd: '游戏标签页',
    information: '首页收藏显示在玩的游戏'
  },
  homeFilter: {
    hd: '列表搜索框'
  }
} as const
