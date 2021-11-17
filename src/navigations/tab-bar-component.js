/*
 * @Author: czy0729
 * @Date: 2020-06-04 15:30:16
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-11-18 01:40:39
 */
import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react'
import BottomTabBar from '@components/@/react-navigation-tabs/BottomTabBar'
import { BlurView as RNBlurView } from '@react-native-community/blur'
import { BlurView as ExpoBlurView } from '@screens/_'
import { IOS } from '@constants'
import { _, systemStore } from '@stores'

function TabBarComponent(props) {
  const styles = memoStyles()
  if (IOS) {
    return (
      <ExpoBlurView style={styles.blurView}>
        <BottomTabBar {...props} style={styles.tabBarComponent} />
      </ExpoBlurView>
    )
  }

  const { androidBlur } = systemStore.setting
  if (androidBlur) {
    return (
      <View style={styles.blurViewAndroid}>
        <RNBlurView
          blurAmount={40}
          overlayColor={_.select('rgba(255, 255, 255, 0.64)', 'rgba(0, 0, 0, 0.5)')}
        >
          <BottomTabBar {...props} style={styles.tabBarComponent} />
        </RNBlurView>
      </View>
    )
  }

  return (
    <View style={styles.tarBarView}>
      <BottomTabBar {...props} style={styles.tabBarComponent} />
    </View>
  )
}

export default observer(TabBarComponent)

const memoStyles = _.memoStyles(_ => ({
  blurView: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0
  },
  blurViewAndroid: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden'
  },
  tarBarView: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: _.select(
      'transparent',
      _.deepDark ? _._colorPlain : _._colorDarkModeLevel1
    ),
    borderTopWidth: _.select(_.hairlineWidth, 0),
    borderTopColor: _.colorBorder
  },
  tabBarComponent: {
    borderTopWidth: 0,
    backgroundColor: 'transparent'
  }
}))
