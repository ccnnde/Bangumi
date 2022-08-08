/*
 * 筛选组
 *
 * @Author: czy0729
 * @Date: 2020-07-15 16:37:05
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-08 12:27:16
 */
import React from 'react'
import { ScrollView, View } from 'react-native'
import { Flex, Text, Touchable, Heatmap } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { info } from '@utils/ui'
import { scrollViewResetProps } from '@constants'
import i18n from '@constants/i18n'
import { EventKeys } from '@types'
import { FilterSwitch } from '../filter-switch'
import { memoStyles } from './styles'
import { HIT_SLOP } from './ds'
import { Props as FilterProps } from './types'

export const Filter = obc(
  (
    {
      filterDS = [],
      title = '频道',
      name = '番剧',
      type = 'Anime',
      lastUpdate
    }: FilterProps,
    { $ }
  ) => {
    const styles = memoStyles()
    const { query, data, layout, expand } = $.state
    const eventId = `${type}.选择` as EventKeys
    return (
      <View style={[styles.container, layout === 'grid' && _.mb.md]}>
        <FilterSwitch title={title} name={name} />
        {filterDS
          .filter(item => expand || item.always)
          .map(item => {
            const state = query[item.type]
            const multiple = ['类型', '制作'].includes(item.title)
            const multiSelect = item.title === '类型'
            return (
              <Flex
                key={item.title}
                style={styles.row}
                align={multiple ? 'start' : 'center'}
              >
                <View>
                  <View>
                    <Text style={multiple && styles.multipleTitle} size={12} bold>
                      {item.title}
                    </Text>
                    {multiSelect && (
                      <Touchable
                        style={styles.how}
                        useRN
                        onPress={() => info('长按标签多选类型')}
                      >
                        <Text size={12} lineHeight={12} type='icon' bold>
                          多选
                        </Text>
                      </Touchable>
                    )}
                  </View>
                  <Heatmap right={-16} bottom={8} id={eventId} type={item.type} mini />
                </View>
                <Flex.Item style={_.ml.md}>
                  <Flex align={multiple ? 'start' : 'center'}>
                    <Touchable
                      style={[
                        styles.item,
                        (typeof state === 'object'
                          ? state.length === 0
                          : state === '') && styles.itemActive,
                        multiple && {
                          marginTop: _.r(4)
                        }
                      ]}
                      hitSlop={HIT_SLOP}
                      onPress={() => $.onSelect(item.type, '')}
                    >
                      <Text size={11}>{item.type === 'sort' ? '默认' : '全部'}</Text>
                    </Touchable>
                    <ScrollView
                      ref={scrollView => scrollToX(scrollView, item.data, state)}
                      style={styles.contentContainerStyle}
                      horizontal
                      {...scrollViewResetProps}
                    >
                      {multiple ? (
                        <Flex style={styles.multiple} direction='column' align='start'>
                          {item.data.map((i, idx) => (
                            <Flex key={idx} style={styles.contentContainerStyle}>
                              {i.map(tag => (
                                <Touchable
                                  key={tag}
                                  style={[
                                    styles.item,
                                    (typeof state === 'object'
                                      ? state.includes(tag)
                                      : state === tag) && styles.itemActive
                                  ]}
                                  hitSlop={HIT_SLOP}
                                  onPress={() => $.onSelect(item.type, tag)}
                                  onLongPress={
                                    multiSelect
                                      ? () => $.onSelect(item.type, tag, true)
                                      : undefined
                                  }
                                >
                                  <Text size={11}>{tag}</Text>
                                  <Heatmap right={-1} id={eventId} value={tag} mini />
                                </Touchable>
                              ))}
                            </Flex>
                          ))}
                        </Flex>
                      ) : (
                        <>
                          {item.login && !$.isLogin ? (
                            <Text style={_.ml.sm} size={11} type='sub' lineHeight={16}>
                              {i18n.login()}后显示
                            </Text>
                          ) : (
                            item.data.map(i => (
                              <Touchable
                                key={i}
                                style={[
                                  styles.item,
                                  (typeof state === 'object'
                                    ? state.includes(i)
                                    : state === i) && styles.itemActive
                                ]}
                                hitSlop={HIT_SLOP}
                                onPress={() => $.onSelect(item.type, i)}
                              >
                                <Text size={11}>{i}</Text>
                                <Heatmap right={-1} id={eventId} value={i} mini />
                              </Touchable>
                            ))
                          )}
                        </>
                      )}
                    </ScrollView>
                  </Flex>
                </Flex.Item>
              </Flex>
            )
          })}
        <Flex style={_.mt.sm} justify='center'>
          <Touchable style={styles.more} onPress={$.onExpand}>
            <Text size={11} lineHeight={12} type='icon' bold>
              {expand ? '收起' : '更多'}选项
            </Text>
          </Touchable>
        </Flex>
        <Flex style={[_.container.wind, _.mt.md]}>
          <Flex.Item>
            <Text size={10} type='sub'>
              {data.list.length} 条记录
              {!!query?.tags?.length && ` · ${query?.tags?.join(' · ')}`}
            </Text>
          </Flex.Item>
          {!!lastUpdate && (
            <Text size={10} type='sub'>
              最后更新 {lastUpdate}
            </Text>
          )}
        </Flex>
      </View>
    )
  }
)

function scrollToX(scrollView, data, value, width = 50) {
  if (scrollView && value) {
    const index = data.findIndex(i => i == value)
    if (index >= 4) {
      setTimeout(() => {
        scrollView.scrollTo(
          {
            x: (index - 2) * width,
            y: 0,
            animated: true
          },
          1
        )
      }, 80)
    }
  }
}
