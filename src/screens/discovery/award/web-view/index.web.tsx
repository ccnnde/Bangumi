/*
 * @Author: czy0729
 * @Date: 2023-10-21 17:24:16
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-10-21 17:46:06
 */
import React from 'react'
import { ScrollView } from '@components'
import { appNavigate, navigationReference } from '@utils'
import { useMount } from '@utils/hooks'
import { HOST, IMG_DEFAULT } from '@constants'

function WebView({ source }) {
  useMount(() => {
    setTimeout(() => {
      const parent = document.querySelector('div.component-webview')

      parent.addEventListener('click', function (event) {
        // @ts-ignore
        if (event.target.closest('a.component-webview-link')) {
          event.preventDefault()

          // @ts-ignore
          const dataHref = event.target.closest('a').getAttribute('data-href')
          appNavigate(dataHref, navigationReference())
        }
      })
    }, 2000)
  })

  const __html = source.html
    .replace(/<(script)\b[^<]*(?:(?!<\/(script)>)<[^<]*)*<\/(script)>/g, '')
    .replace(/href="\//g, `href="${HOST}/`)
    .replace(/src="\/img\/no_icon_subject.png"/g, `src="${IMG_DEFAULT}"`)
    .replace(/<a href="/g, '<a class="component-webview-link" data-href="')
  return (
    <ScrollView>
      <div className='component-webview' dangerouslySetInnerHTML={{ __html }} />
    </ScrollView>
  )
}

export default WebView
