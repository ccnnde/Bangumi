/*
 * @Author: czy0729
 * @Date: 2024-06-05 19:42:31
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-06-13 16:27:11
 */
import { rakuenStore } from '@stores'
import { getInt } from '@stores/rakuen/utils'
import { getTimestamp, queue } from '@utils'
import { H12 } from '@constants'
import { TopicId } from '@types'
import Computed from './computed'

const loaded = {}

export default class Fetch extends Computed {
  /** 小组帖子列表 (我的回复跟小组是一个性质的) */
  fetchGroup = async () => {
    await rakuenStore.fetchGroup({
      groupId: 'my_reply',
      page: this.state.replyPage
    })
    setTimeout(() => {
      this.fetchTopicQueue()
    }, 4000)

    return true
  }

  /** 获取帖子内容和留言 */
  fetchTopicQueue = async () => {
    const topicIds = this.myReply.list.map(
      item => item.href.replace('/group/topic/', 'group/') as TopicId
    )
    await queue(
      topicIds.map(topicId => () => {
        const last = getInt(topicId)
        const key = `comments${last}` as const
        return rakuenStore.init(key)
      })
    )

    const now = getTimestamp()
    const fetchs = []
    topicIds.forEach(topicId => {
      if (loaded[topicId]) return true

      // 请求间隔为 12 小时乘以页数
      const { _loaded } = rakuenStore.comments(topicId)
      if (_loaded && now - Number(_loaded) <= H12 * Number(this.state.page)) return true

      loaded[topicId] = true
      fetchs.push(() => {
        console.info('fetchTopicQueue', topicId)
        return rakuenStore.fetchTopic({
          topicId
        })
      })
    })

    return queue(fetchs)
  }
}
