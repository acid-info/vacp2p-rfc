import { ThemeClassNames } from '@docusaurus/theme-common'
import { useDoc } from '@docusaurus/theme-common/internal'
import MDXHeading from '@theme/MDXComponents/Heading'
import MDXContent from '@theme/MDXContent'
import clsx from 'clsx'
import React from 'react'
import { HeaderProps as HeaderPropsType } from '../../../types'
import styles from './styles.module.scss'

const settings: HeaderPropsType = {
  badges: {
    status: {
      raw: {
        color: 'lightgrey',
      },
      draft: {
        color: 'blue',
      },
      stable: {
        color: 'green',
      },
      deprecated: {
        color: 'yellowgreen',
      },
    },
  },
  metadata: [
    {
      key: 'status',
      label: 'Status',
    },
    {
      key: 'version',
      label: 'Version',
    },
    {
      key: 'editor',
      label: 'Editors',
      parse: value =>
        (Array.isArray(value) ? value : [value])
          .map(editor =>
            editor.replace(
              /<\s*\[?\s*([^\]]*?@[^\]]*?)\s*\]?\s*>/g,
              '<a href="mailto:$1" target="_blank">$1</a>',
            ),
          )
          .join(', '),
    },
    {
      key: 'contributors',
      label: 'Contributors',
      parse: value =>
        (Array.isArray(value) ? value : [value])
          .map(editor =>
            editor.replace(
              /<\s*\[?\s*([^\]]*?@[^\]]*?)\s*\]?\s*>/g,
              '<a href="mailto:$1" target="_blank">$1</a>',
            ),
          )
          .join(', '),
    },
  ],
}

function useSyntheticTitle() {
  const { metadata, frontMatter, contentTitle } = useDoc()
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined'
  if (!shouldRender) {
    return null
  }
  return metadata.title
}

const useHeaderProperties = () => {
  const { frontMatter } = useDoc()
  const { name, hide_header } = frontMatter as any

  const badges = Object.entries(settings.badges || {})
    .map(([key, badge]) => {
      const value = frontMatter[key]
      if (!value || !badge[value]) return null

      const url =
        badge[value].url ??
        `https://img.shields.io/badge/${key}-${value}-${badge[value].color ??
          'lightgrey'}?style=flat-square`

      return {
        key,
        value,
        url,
      }
    })
    .filter(Boolean)

  const metadata = (settings.metadata ?? [])
    .map(m => {
      const value = frontMatter[m.key]

      if (!value) return null

      return {
        key: m.key,
        label: m.label ?? m.key,
        value: m.parse ? m.parse(value) : value,
      }
    })
    .filter(Boolean)

  return {
    render: !hide_header,
    name,
    badges,
    metadata,
  }
}

const HeaderProps = () => {
  const { render, name, badges, metadata } = useHeaderProperties()

  if (!render) return null

  return (
    <div>
      {name && <MDXHeading as="h2">{name}</MDXHeading>}
      {badges.length > 0 && (
        <div className={styles.badges}>
          {badges.map(badge => (
            <img className={styles.badge} src={badge.url} />
          ))}
        </div>
      )}
      {metadata.length > 0 && (
        <ul className={styles.metadata}>
          {metadata.map(m => (
            <li>
              {m.label}: <span dangerouslySetInnerHTML={{ __html: m.value }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function DocItemContent({ children }) {
  const syntheticTitle = useSyntheticTitle()

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle && (
        <header>
          <MDXHeading as="h1">{syntheticTitle}</MDXHeading>
        </header>
      )}
      <HeaderProps />
      <MDXContent>{children}</MDXContent>
    </div>
  )
}
