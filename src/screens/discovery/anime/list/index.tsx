/*
 * @Author: czy0729
 * @Date: 2019-06-23 02:20:58
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-22 04:13:14
 */
import React from 'react'
import { Loading } from '@components'
import { PaginationList2, Filter } from '@_'
import { _, otaStore } from '@stores'
import { obc } from '@utils/decorators'
import Item from '../item'
import ItemGrid from '../item-grid'
import { ADVANCE_LIMIT, filterDS } from '../ds'
import { Ctx } from '../types'

class List extends React.Component {
  connectRef = (ref: { scrollToOffset: any }) => {
    const { $ }: Ctx = this.context
    if (ref && ref.scrollToOffset) $.scrollToOffset = ref.scrollToOffset
  }

  get num() {
    return _.portrait(3, 5)
  }

  renderItem = ({ item, index }) => {
    const { $ }: Ctx = this.context
    const { layout } = $.state
    if (layout === 'list') return <Item pickIndex={item} index={index} />

    return <ItemGrid pickIndex={item} index={index} num={this.num} />
  }

  renderFilter() {
    return (
      <Filter
        filterDS={filterDS}
        lastUpdate='2022-09'
        information={`数据最后快照于 2022-09-23，在版本更新前数据不会有任何变化，预计一个季度更新一次。
        \n本页数据非来源自 bgm.tv，并非所有条目都进行了收录，通常收录的都是有对应源头的数据。
        \n有比 bgm.tv 更准确的分类、更丰富的筛选、最后更新章节和更多的排序。
        \n目前本功能对所有用户开放，非高级会员在一个条件下会有最多只显示前 ${ADVANCE_LIMIT} 条数据的限制。
        \n整理不易，若觉得有用可以通过各种方式给与鼓励支持!`}
      />
    )
  }

  render() {
    const { $ }: Ctx = this.context
    const { _loaded, layout, data } = $.state
    if (!_loaded && !data._loaded) {
      return (
        <>
          {this.renderFilter()}
          <Loading />
        </>
      )
    }

    const numColumns = $.isList ? undefined : this.num
    return (
      <PaginationList2
        key={`${layout}${numColumns}`}
        keyExtractor={keyExtractor}
        connectRef={this.connectRef}
        contentContainerStyle={_.container.bottom}
        numColumns={numColumns}
        data={data.list}
        limit={9}
        ListHeaderComponent={this.renderFilter()}
        renderItem={this.renderItem}
        scrollToTop
        onPage={otaStore.onAnimePage}
      />
    )
  }
}

export default obc(List)

export function keyExtractor(item: any) {
  return String(item)
}
