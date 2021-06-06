import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import mockAxios from 'jest-mock-axios'

import { DruxtClient, DruxtStore } from 'druxt'
import { DruxtBlock } from '..'

// Setup local vue instance.
const localVue = createLocalVue()
localVue.use(Vuex)

let store

const mountComponent = (propsData = {}, options = {}, mocks = {}) => {
  mocks = {
    $druxtBlocks: {
      options: {
        query: {
          fields: [],
        },
      },
    },
    $fetchState: { pending: false },
    $nuxt: {
      context: {
        isDev: false,
      }
    },
    ...mocks
  }
  return mount(DruxtBlock, { localVue, mocks, propsData, store, ...options })
}

describe('Component - DruxtBlock', () => {
  beforeEach(() => {
    mockAxios.reset()

    // Setup vuex store.
    store = new Vuex.Store()

    DruxtStore({ store })
    store.$druxt = new DruxtClient('https://demo-api.druxtjs.org')

    store.app = { context: { error: jest.fn() }, store }
  })

  test('uuid', async () => {
    const wrapper = mountComponent({ uuid: '9d3d3a23-69f5-4c2d-9a00-287492a52987' })
    await wrapper.vm.$options.fetch.call(wrapper.vm)

    // Props
    expect(wrapper.vm.id).toBe(null)
    expect(wrapper.vm.uuid).toBe('9d3d3a23-69f5-4c2d-9a00-287492a52987')

    // DruxtModule
    expect(wrapper.vm.component.options).toStrictEqual([
      'DruxtBlockSystemBrandingBlockHeaderUmami',
      'DruxtBlockSystemBrandingBlockHeader',
      'DruxtBlockSystemBrandingBlockUmami',
      'DruxtBlockSystemBrandingBlock',
      'DruxtBlockDefault',
    ])
    expect(wrapper.vm.component.is).toBe('DruxtWrapper')

    // Default slot.
    expect(wrapper.vm.getScopedSlots().default()).toBe(null)
  })

  test('uuid - pluginId', async () => {
    const wrapper = mountComponent({ uuid: '06251689-406e-4dc4-aab1-5fcf0e5f9ecb' })
    await wrapper.vm.$options.fetch.call(wrapper.vm)

    // DruxtModule
    expect(wrapper.vm.component.options.length).toBe(9)
    expect(wrapper.vm.component.options).toStrictEqual([
      'DruxtBlockBlockContent9aadf4a1Ded64017A10dA5e043396edfBannerTopUmami',
      'DruxtBlockBlockContent9aadf4a1Ded64017A10dA5e043396edfBannerTop',
      'DruxtBlockBlockContent9aadf4a1Ded64017A10dA5e043396edfUmami',
      'DruxtBlockBlockContentBannerTopUmami',
      'DruxtBlockBlockContent9aadf4a1Ded64017A10dA5e043396edf',
      'DruxtBlockBlockContentBannerTop',
      'DruxtBlockBlockContentUmami',
      'DruxtBlockBlockContent',
      'DruxtBlockDefault',
    ])
  })

  test('id', async () => {
    const wrapper = mountComponent({ id: 'umami_branding' })
    await wrapper.vm.$options.fetch.call(wrapper.vm)

    // Props
    expect(wrapper.vm.id).toBe('umami_branding')
    expect(wrapper.vm.uuid).toBe(null)

    // DruxtModule
    expect(wrapper.vm.component.options).toStrictEqual([
      'DruxtBlockSystemBrandingBlockHeaderUmami',
      'DruxtBlockSystemBrandingBlockHeader',
      'DruxtBlockSystemBrandingBlockUmami',
      'DruxtBlockSystemBrandingBlock',
      'DruxtBlockDefault',
    ])

    expect(wrapper.vm.component.is).toBe('DruxtWrapper')
  })

  test('dev mode slot', async () => {
    const mocks = {
      $nuxt: {
        context: {
          isDev: true,
        },
      },
    }
    const wrapper = mountComponent({ uuid: '9d3d3a23-69f5-4c2d-9a00-287492a52987' }, {}, mocks)
    await wrapper.vm.$options.fetch.call(wrapper.vm)

    // Default slot.
    const slot = wrapper.vm.getScopedSlots().default()
    expect(slot.tag).toBe('details')
  })

  test('custom default slot', async () => {
    const scopedSlots = { default: jest.fn() }
    const wrapper = mountComponent({ uuid: '06251689-406e-4dc4-aab1-5fcf0e5f9ecb' }, { scopedSlots })
    await wrapper.vm.$options.fetch.call(wrapper.vm)

    wrapper.vm.getScopedSlots().default.call()
    expect(scopedSlots.default).toHaveBeenCalledWith({
      block: wrapper.vm.block,
    })
  })
})
