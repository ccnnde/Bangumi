/*
 * @Author: czy0729
 * @Date: 2024-04-08 18:35:42
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-04-30 01:43:31
 */
import { queue } from '@utils'
import { STORYBOOK } from '@constants'
import { H_HEADER, H_RADIUS_LINE, H_TABBAR } from '@screens/user/v2/ds'
import Action from './action'
import { updateTrackUserInfo } from './utils'
import { EXCLUDE_STATE, NAMESPACE, STATE } from './ds'

export { H_RADIUS_LINE, H_HEADER, H_TABBAR }

/** 用户空间页面状态机 */
class ScreenZone extends Action {
  init = async () => {
    const state: typeof STATE = {
      ...(await this.getStorage(NAMESPACE)),
      ...EXCLUDE_STATE,
      _loaded: true
    }

    if (!this.state._loaded) {
      if (state.page > 1) state.page = 0
    } else {
      // 若多次进入同一个用户空间, 保持 Tabs 索引位置
      state.page = this.state.page
    }
    this.setState(state)

    // 每个请求都判断 this.state.mounted 若用户在未请求完就退出页面需要尽快终止余下请求
    return queue([
      () => {
        if (!this.state.mounted) return
        return this.onTabChangeCallback(this.state.page)
      },
      () => {
        if (!this.state.mounted) return
        return this.fetchUsersInfo()
      },
      () => {
        if (!this.state.mounted) return
        return this.fetchUsersFromOSS()
      },
      () => {
        if (!this.state.mounted) return
        return this.fetchUsers()
      },
      () => {
        if (!this.state.mounted || !this.fromTinygrail) return
        return this.fetchCharaAssets()
      },
      () => {
        if (!this.state.mounted || !this.fromTinygrail) return
        return this.fetchTempleTotal()
      },
      () => {
        if (!this.state.mounted || !this.fromTinygrail) return
        return this.fetchCharaTotal()
      },
      () => {
        if (!this.state.mounted) return
        return this.fetchUsersTimeline(true)
      },
      () => {
        if (!this.state.mounted || STORYBOOK) return
        return this.fetchRecent()
      },
      () => {
        if (!this.state.mounted || STORYBOOK) return
        updateTrackUserInfo(this.usersInfo)
      }
    ])
  }
}

export default ScreenZone
