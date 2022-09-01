/*
 * 友盟手动埋点配置
 *
 * @Author: czy0729
 * @Date: 2019-12-17 10:27:31
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-01 09:09:18
 */
import Discovery from './discovery'
import Timeline from './timeline'
import Home from './home'
import Rakuen from './rakuen'
import User from './user'
import Tinygrail from './tinygrail'
import Other from './other'

/**
 * 埋点事件数据
 *
 * @eg 跳转: { to: 'Subject', from: 'block', ...other }
 */
const events = {
  ...Discovery,
  ...Timeline,
  ...Home,
  ...Rakuen,
  ...User,
  ...Tinygrail,
  ...Other
} as const

export default events

type PageKeys =
  | '人物'
  | '发现'
  | '好友'
  | '我的'
  | '新番'
  | '时间胶囊'
  | '条目'
  | '条目目录'
  | '用户日志'
  | '用户目录'
  | '短信'
  | '首页'

/** 埋点事件唯一键值 */
export type EventKeys = keyof typeof events | PageKeys | ''
