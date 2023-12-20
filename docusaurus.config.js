// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
require('dotenv').config()

const math = require('remark-math')
const katex = require('rehype-katex')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Waku',
  url: 'https://url',
  baseUrl: '/',

  markdown: {
    mermaid: true,
  },

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      '@acid-info/logos-docusaurus-preset',
      /** @type {import('@acid-info/logos-docusaurus-preset').PluginOptions} */
      ({
        businessUnit: 'VacResearch',
        theme: {
          name: 'default',
          options: {
            customCss: [require.resolve('./src/css/custom.scss')],
            docs: {
              default: {
                sidebar: {
                  hide: true,
                },
              },
            },
          },
        },
        pages: false,
        docs: {
          id: 'rfc',
          routeBasePath: '/',
          path: 'docs',
          breadcrumbs: false,
          remarkPlugins: [math],
          rehypePlugins: [katex],
          sidebarItemsGenerator: async args => {
            let sidebar = await args.defaultSidebarItemsGenerator(args)

            {
              const statuses = ['raw', 'draft', 'stable', 'deprecated']

              const specsCategoryIndex = sidebar.findIndex(
                si =>
                  si.type === 'category' &&
                  si.items.some(
                    item =>
                      (item.type === 'doc' && item.id.startsWith('specs/')) ||
                      (item.type === 'category' &&
                        item.link?.type === 'doc' &&
                        item.link.id.startsWith('specs/')),
                  ),
              )

              const newCategories = []

              const specDocs = args.docs.filter(
                doc =>
                  doc.id.startsWith('specs/') && doc.id.split('/').length <= 3,
              )

              newCategories.push(
                ...statuses.map(status => ({
                  type: 'category',
                  // @ts-ignore
                  label: status[0].toUpperCase() + status.slice(1),
                  items: specDocs
                    .filter(doc => doc.frontMatter.status === status)
                    .map(doc => ({
                      type: 'doc',
                      id: doc.id,
                      label: doc.frontMatter.sidebar_label ?? doc.title,
                    })),
                })),
              )

              // @ts-ignore
              sidebar = [
                ...sidebar.slice(0, specsCategoryIndex),
                ...newCategories,
                ...sidebar.slice(specsCategoryIndex + 1),
              ]
            }

            return sidebar
          },
        },
        og: {},
      }),
    ],
  ],

  plugins: [
    // [
    //   '@docusaurus/plugin-content-docs',
    //   /** @type {import('@docusaurus/plugin-content-docs').PluginOptions} */
    //   ({}),
    // ],
  ],

  themeConfig:
    /** @type {import('@acid-info/logos-docusaurus-preset').ThemeConfig} */
    ({
      colorMode: {
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        hideOnScroll: true,
        items: [
          {
            type: 'search',
          },
          {
            label: 'About Vac',
            href: 'https://vac.dev',
          },
          {
            label: 'Research Blog',
            href: 'https://vac.dev/rlog',
          },
          {
            label: 'Join Us',
            href: 'https://vac.dev/join-us',
          },
        ],
      },
      footer: {
        links: [
          {
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/vacp2p',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/PQFdubGt6d',
              },
              {
                label: 'Github',
                href: 'https://github.com/vacp2p',
              },
            ],
          },
          {
            items: [
              {
                label: 'Work With Us',
                href: 'https://jobs.status.im/',
              },
              {
                label: 'Terms & Conditions',
                to: '/terms',
              },
            ],
          },
        ],
      },
    }),

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
}

module.exports = config
