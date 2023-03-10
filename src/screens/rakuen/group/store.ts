/*
 * @Params: { _title }
 * @Author: czy0729
 * @Date: 2019-07-13 18:49:32
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-03-10 14:12:25
 */
import { observable, computed } from 'mobx'
import { rakuenStore, userStore } from '@stores'
import { info, feedback, getTimestamp } from '@utils'
import store from '@utils/store'
import { fetchHTML, t } from '@utils/fetch'
import { get, update } from '@utils/kv'
import { webhookGroup } from '@utils/webhooks'
import { HOST, LIST_EMPTY } from '@constants'
import { TopicId } from '@types'
import { Params } from './types'

const NAMESPACE = 'ScreenGroup'

/** 若更新过则不会再主动更新 */
const THIRD_PARTY_UPDATED = []

export default class ScreenGroup extends store {
  params: Params

  state = observable({
    page: 1,
    show: true,
    ipt: '1',
    history: [],

    /** 云快照 */
    ota: {},
    _loaded: false
  })

  init = async () => {
    const state = await this.getStorage(this.key)
    this.setState({
      ...state,
      ota: {},
      _loaded: true
    })

    this.fetchGroup()
    return this.fetchGroupInfo()
  }

  // -------------------- fetch --------------------
  /** 小组信息 */
  fetchGroupInfo = () => {
    return rakuenStore.fetchGroupInfo({
      groupId: this.groupId
    })
  }

  /** 小组帖子列表 */
  fetchGroup = async () => {
    this.fetchThirdParty()

    const { page } = this.state
    const data = await rakuenStore.fetchGroup({
      groupId: this.groupId,
      page
    })

    if (
      data.list.length &&
      // 只有明确知道云快照没有这个 key 的数据, 才主动更新云快照数据
      this.thirdPartyKey in this.state.ota
    ) {
      const ts = this.ota?.ts || 0
      const _loaded = getTimestamp()
      if (_loaded - ts >= 60 * 60 * 24 * 7) this.updateThirdParty()
    }

    return data
  }

  /** 获取云快照 */
  fetchThirdParty = async () => {
    if (!this.ota && !this.group._loaded) {
      const data = await get(this.thirdPartyKey)
      if (!data) {
        // 就算没有数据也插入 key, 用于判断是否需要更新云数据
        this.setState({
          ota: {
            [this.thirdPartyKey]: {
              list: [],
              _loaded: 0
            }
          }
        })
        return
      }

      this.setState({
        ota: {
          [this.thirdPartyKey]: {
            ...data,
            _loaded: getTimestamp()
          }
        }
      })
    }
  }

  /** 上传预数据 */
  updateThirdParty = async () => {
    if (THIRD_PARTY_UPDATED.includes(this.thirdPartyKey)) return

    setTimeout(() => {
      update(this.thirdPartyKey, {
        list: this.group.list
      })
      THIRD_PARTY_UPDATED.push(this.thirdPartyKey)
    }, 0)
  }

  // -------------------- get --------------------
  @computed get groupId() {
    const { groupId = '' } = this.params
    return groupId
  }

  @computed get key() {
    return `${NAMESPACE}|${this.groupId}`
  }

  /** 小组信息 */
  @computed get groupInfo() {
    return rakuenStore.groupInfo(this.groupId)
  }

  /** 小组帖子列表 */
  @computed get group() {
    const { page } = this.state
    const group = rakuenStore.group(this.groupId, page)
    if (!group._loaded) {
      return this.ota
        ? {
            ...this.ota,
            pagination: {
              page: 1,
              pageTotal: 10
            }
          }
        : LIST_EMPTY
    }

    return group
  }

  /** 小组缩略图缓存 */
  @computed get groupThumb() {
    const { cover } = this.groupInfo
    if (cover) return cover

    const { _title } = this.params
    if (_title) return rakuenStore.groupThumb(_title)

    return ''
  }

  @computed get url() {
    return `${HOST}/group/${this.groupId}`
  }

  /** 帖子历史查看记录 */
  readed(topicId: TopicId) {
    return computed(() => rakuenStore.readed(topicId)).get()
  }

  /** 云快照 */
  @computed get ota() {
    const { ota } = this.state
    return ota[this.thirdPartyKey]
  }

  @computed get thirdPartyKey() {
    const { page } = this.state
    const query = [this.groupId, page].join('_').replace('/', '_')
    return `group_${query}`
  }

  // -------------------- page --------------------
  /** 上一页 */
  prev = async () => {
    const { page } = this.state
    if (page === 1) return

    t('小组.上一页', {
      page: page - 1,
      groupId: this.groupId
    })

    this.setState({
      page: page - 1,
      show: false,
      ipt: String(page - 1)
    })
    this.fetchGroup()

    setTimeout(() => {
      this.setState({
        show: true
      })
      this.setStorage(undefined, undefined, this.key)
    }, 400)
  }

  /** 下一页 */
  next = async () => {
    const { page } = this.state
    t('小组.下一页', {
      page: page + 1,
      groupId: this.groupId
    })

    this.setState({
      page: page + 1,
      show: false,
      ipt: String(page + 1)
    })
    this.fetchGroup()

    setTimeout(() => {
      this.setState({
        show: true
      })
      this.setStorage(undefined, undefined, this.key)
    }, 400)
  }

  /** 页码输入框改变 */
  onChange = ({ nativeEvent }) => {
    const { text } = nativeEvent
    this.setState({
      ipt: text
    })
  }

  /** 更新帖子历史查看信息 */
  onItemPress = (topicId: TopicId, replies: any) => {
    rakuenStore.updateTopicReaded(topicId, replies)
  }

  // -------------------- action --------------------
  /** 页码跳转 */
  doSearch = () => {
    const { ipt } = this.state
    const _ipt = ipt === '' ? 1 : parseInt(ipt)
    if (_ipt < 1) {
      info('请输入正确页码')
      return
    }

    t('小组.页码跳转', {
      page: _ipt,
      groupId: this.groupId
    })

    this.setState({
      page: _ipt,
      show: false,
      ipt: String(_ipt)
    })
    this.fetchGroup()

    setTimeout(() => {
      this.setState({
        show: true
      })
      this.setStorage(undefined, undefined, this.key)
    }, 400)
  }

  /** 加入小组 */
  doJoin = async () => {
    const { joinUrl } = this.groupInfo
    if (!joinUrl) return false

    t('小组.加入', {
      groupId: this.groupId
    })

    await fetchHTML({
      method: 'POST',
      url: `${HOST}${joinUrl}`,
      data: {
        action: 'join-bye'
      }
    })
    feedback()
    info('已加入小组')
    webhookGroup(
      {
        ...this.groupInfo,
        id: this.groupId
      },
      userStore.userInfo
    )

    return this.fetchGroupInfo()
  }

  /** 退出小组 */
  doBye = async () => {
    const { byeUrl } = this.groupInfo
    if (!byeUrl) return false

    t('小组.退出', {
      groupId: this.groupId
    })

    await fetchHTML({
      method: 'POST',
      url: `${HOST}${byeUrl}`,
      data: {
        action: 'join-bye'
      }
    })
    feedback()
    info('已退出小组')

    return this.fetchGroupInfo()
  }
}
