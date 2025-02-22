<script>
import DruxtModule from 'druxt/dist/components/DruxtModule.vue'

// Extract the DruxtModule model watch.
const modelWatch = DruxtModule.watch.model
delete DruxtModule.watch.model

/**
 * Renders a Drupal Field using Drupals by field type and formatter settings.
 *
 * @example
 * <DruxtField
 *   :schema="{
 *     id: 'field_summary',
 *     label: {
 *       position: 'above',
 *       text: 'Summary',
 *     },
 *     type: 'basic_string'
 *   }"
 *   value="A wholesome pasta bake is the ultimate comfort food. This delicious bake is super quick to prepare and an ideal midweek meal for all the family."
 * />
 */
export default {
  name: 'DruxtField',

  extends: DruxtModule,

  /** */
  props: {
    /**
     * JSON:API errors.
     *
     * @type {object[]}
     */
    errors: {
      type: Array,
      default: () => [],
    },

    /**
     * `true` if this field is a JSON:API relationship.
     *
     * @type {boolean}
     * @default false
     */
    relationship: {
      type: Boolean,
      default: false
    },

    /**
     * Drupal Field schema object.
     *
     * @type {object}
     */
    schema: {
      type: Object,
      required: true
    },

    /**
     * @deprecated
     */
    options: {
      type: Object,
      default: () => ({})
    },

    /**
     * The Field value.
     *
     * @type {(array|boolean|number|object|string)}
     * @model
     */
    value: {
      type: [Array, Boolean, Number, String, Object],
      default: undefined,
    },
  },

  fetchKey(getCounter) {
    const parent = (this.$parent || {}).entity || ((this.$parent || {}).$parent || {}).entity || {}
    const parts = ['DruxtField', parent.type, parent.id, this.schema.id].filter((o) => o)
    return [...parts, getCounter(parts.join(':'))].join(':')
  },

  /**
   * @property {object} model - The model object.
   */
  data: ({ value }) => ({
    model: value,
  }),

  /** */
  computed: {
    /**
     * The Field data.
     *
     * @type {(array|boolean|number|object|string)}
     */
    data: ({ model }) => model,

    /**
     * Field is Boolean?
     *
     * @type {boolean}
     */
    isBoolean: ({ schema }) => ['boolean_checkbox'].includes(schema.type),

    /**
     * Field is DateTime?
     *
     * @type {boolean}
     */
    isDateTime: ({ schema }) => ['datetime_timestamp'].includes(schema.type),

    /**
     * Field is File?
     *
     * @type {boolean}
     */
    isFile: ({ schema }) => ['file_default', 'file_generic'].includes(schema.type),

    /**
     * Field is Image?
     *
     * @type {boolean}
     */
    isImage: ({ schema }) => ['image', 'image_image', 'responsive_image'].includes(schema.type),

    /**
     * Field is Link?
     *
     * @type {boolean}
     */
    isLink: ({ schema }) => ['link'].includes(schema.type),

    /**
     * Field is multi-cardinality.
     *
     * @type {boolean}
     */
    isMultiple: ({ schema }) => (schema.cardinality || 1) !== 1,

    /**
     * Field is Text?
     *
     * @type {boolean}
     */
    isText: ({ schema }) => ['number_integer', 'string_textfield'].includes(schema.type),

    /**
     * The Field label display settings.
     *
     * @type {object}
     * @default { position: 'hidden' }
     */
    label: ({ schema }) =>
      schema.config.schemaType === 'form'
        ? { ...schema.label, text: (schema.label || {}).text || schema.id[0].toUpperCase() + schema.id.substring(1) }
        : ((schema || {}).label || {}).text
        ? schema.label
        : { position: 'hidden' },
  },

  watch: {
    errors() {
      this.component.props.errors = this.errors
      this.component.propsData.errors = this.errors
    },

    model() {
      // Sanitize empty string based fields.
      if (this.model === '') { this.model = undefined }

      // Invoke the DruxtModule model watch callback.
      modelWatch.call(this)
    },
  },

  /** DruxtModule settings */
  druxt: {
    /**
     * Provides the available component naming options for the Druxt Wrapper.
     *
     * @param {object} context - The module component ViewModel.
     * @returns {ComponentOptions}
     */
    componentOptions: ({ schema }) => ([
      [schema.type || 'undefined', schema.id, (schema.config || {}).schemaType],
      [schema.type || 'undefined', (schema.config || {}).schemaType],
      ['default', (schema.config || {}).schemaType],
    ]),

    /**
     * Provides propsData for the DruxtWrapper.
     *
     * @param {object} context - The module component ViewModel.
     * @returns {PropsData}
     */
    propsData: ({ errors, model, relationship, schema }) => ({ errors, relationship, schema, value: model }),

    /**
     * Provides the scoped slots object for the Module render function.
     *
     * A scoped slot per field item is provided, with support for:
     * - File, Image, Link, Number, Text and other View fields.
     * - Boolean, Date/Time, Text and other Form fields.
     * - Entitiy references.
     *
     * A scoped slot is provided for the label, as well as label-above and
     * label-inline depending on the field schema.
     *
     * A default slot is provided with debug information if Nuxt is in
     * development mode.
     *
     * @example <caption>DruxtField**SchemaType**.vue</caption> @lang vue
     * <template>
     *   <div>
     *     <slot name="label" />
     *     <slot name="field-0" />
     *   </div>
     * </template>
     *
     * @return {ScopedSlots} The Scoped slots object.
     */
    slots(h) {
      const scopedSlots = {}
      const { schemaType } = ((this.schema || {}).config || {})
      const self = this

      // Label(s).
      if ((this.label || {}).text) {
        scopedSlots.label = (attrs) => h('strong', { attrs }, [`${this.label.text}:`])
        if (this.label.position && ['above', 'inline'].includes(this.label.position)) {
          scopedSlots[`label-${this.label.position}`] = scopedSlots.label
        }
      }

      const items = (this.model || {}).data
        ? Array.isArray(this.model.data) ? this.model.data : [this.model.data]
        : Array.isArray(this.model) ? this.model : [this.model]

      // Render a slot for each field delta.
      for (const delta in items) {
        const setModel = (value, fallback = undefined) => {
          value = value || fallback
          self.relationship
            ? self.isMultiple
              ? self.model.data[delta] = value
              : self.model.data = value
            : self.isMultiple
              ? self.model[delta] = value
              : self.model = value
        }

        const item = items[delta]
        scopedSlots[`field-${delta}`] = (attrs) => {
          // Boolean: Form.
          if (this.isBoolean && schemaType === 'form') {
            return h('div', [h('input', {
              attrs,
              domProps: {
                checked: item,
                type: 'checkbox',
              },
              on: {
                input(e) { setModel(e.target.checked, false) }
              }
            })])
          }

          // Date/Time: Form.
          if (this.isDateTime && schemaType === 'form') {
            return h('div', [h('input', {
              attrs,
              domProps: {
                placeholder: this.schema.settings.display.placeholder,
                type: 'datetime-local',
                value: (item || '').split('+')[0],
              },
              on: {
                input(e) {
                  const value = [e.target.value, (item || '').split('+')[1]].filter((s) => s).join('+')
                  setModel(value)
                }
              }
            })])
          }

          // File: View.
          if (this.isFile && schemaType === 'view') {
            return h('DruxtEntity', {
              attrs,
              props: {
                langcode: this.lang,
                type: item.type,
                uuid: item.id
              },
              scopedSlots: { default: ({ entity }) => h('a', {
                domProps: {
                  href: (entity.attributes.uri || {}).url,
                  target: '_blank',
                },
              }, [entity.attributes.filename]) }
            })
          }

          // Image: View
          if (this.isImage && schemaType === 'view') {
            return h('DruxtEntity', {
              attrs,
              props: {
                langcode: this.lang,
                type: item.type,
                uuid: item.id
              },
              scopedSlots: { default: ({ entity }) => h('img', {
                domProps: {
                  src: (entity.attributes.uri || {}).url
                }
              })}
            })
          }

          // Link: View.
          if (this.isLink && schemaType === 'view') {
            if (!(item || {}).uri) return
            return /^(?:[a-z]+:)?\/\//i.test(item.uri)
              ? h('a', { attrs, domProps: { href: item.uri, target: '_blank' } }, [item.title])
              : h('NuxtLink', { attrs, props: { to: item.uri.replace('internal:', '') } }, [item.title])
          }

          // Text: Form.
          if (this.isText && schemaType === 'form') {
            return h('div', [h('input', {
              attrs,
              domProps: {
                placeholder: this.schema.settings.display.placeholder,
                size: this.schema.settings.display.size,
                value: item,
              },
              on: {
                input(e) {
                  setModel(e.target.value)
                }
              }
            })])
          }

          // Relationship: View.
          if (this.relationship && (item || {}).id && schemaType === 'view') {
            return h('DruxtEntity', {
              attrs,
              props: {
                langcode: this.lang,
                mode: this.schema.settings.display.view_mode || 'default',
                type: item.type,
                uuid: item.id,
              },
            })
          }

          // Relationship: Form.
          if (this.relationship && (item || {}).id && schemaType === 'form') {
            return h('details', [h('DruxtEntityForm', {
              attrs,
              props: {
                langcode: this.lang,
                mode: this.schema.settings.display.view_mode || 'default',
                type: item.type,
                uuid: item.id,
              },
            })])
          }

          // Fallback: View.
          if (schemaType === 'view') {
            // Return data if data is a basic native.
            if (['number', 'string'].includes(typeof item)) {
              return h('div', { attrs, domProps: { innerHTML: item } })
            }

            // Return `.processed` or `.value` if present.
            if (((item || {}).processed || (item || {}).value)) {
              return h('div', { attrs, domProps: { innerHTML: item.processed || item.value } })
            }
          }

          // Fallback: Form: Other fields render a textarea.
          if (schemaType === 'form') {
            return h('div', [h('textarea', {
              attrs,
              domProps: {
                placeholder: this.schema.settings.display.placeholder,
                rows: this.schema.settings.display.rows,
                value: typeof item === 'object'
                  ? JSON.stringify(item, null, "  ")
                  : item
              },
              on: {
                input(e) {
                  let value = e.target.value
                  try {
                    value = JSON.parse(e.target.value)
                  } catch(err) {
                    // TODO: Handle error
                  }
                  setModel(value)
                }
              }
            })])
          }

          // Fallback: Provide debug data.
          if (this.$nuxt.context.isDev) {
            const summary = `Missing Vue template for '${this.schema.id} (${this.schema.type}')`
            const description = [
              h('p', 'Create a Druxt theme component to render the field.'),
            ]
            return h('DruxtDebug',
              { props: { summary } },
              [
                h('div', description),
                !!this.component.options.length && h('DruxtDevelTemplate', { props: { options: this.component.options }}),
                h('details', [h('summary', 'Data'), h('pre', [h('code', [JSON.stringify(item, null, '  ')])])]),
                !!this.schema && h('details', [h('summary', 'Schema'), h('pre', [h('code', [JSON.stringify(this.schema, null, '  ')])])])
              ]
            )
          }
        }
      }

      // Default slot to add label to field as required.
      scopedSlots.default = (attrs) => {
        const fields = items.map((item, delta) => scopedSlots[`field-${delta}`](attrs))
        if (schemaType === 'form' && scopedSlots.label) {
          return h('label', [
            scopedSlots.label(attrs),
            h('br'),
            fields
          ])
        }
        else if (this.label.position && scopedSlots[`label-${this.label.position}`]) {
          return [scopedSlots[`label-${this.label.position}`](attrs), fields]
        }
        return [fields]
      }

      return scopedSlots
    },

    /**
     * Druxt development template tool configuration.
     */
    template: {
      mixins: {
        'DruxtFieldMixin': 'druxt-entity'
      }
    }
  },
}

/**
 * Provides the available naming options for the Wrapper component.
 *
 * @typedef {array[]} ComponentOptions
 *
 * @example @lang js
 * [
 *   'DruxtField[Type][Id][SchemaType][Langcode]',
 *   'DruxtField[Type][Id][SchemaType]',
 *   'DruxtField[Type][Id][Langcode]',
 *   'DruxtField[Type][Id]',
 *   'DruxtField[Type][SchemaType][Langcode]',
 *   'DruxtField[Type][SchemaType]',
 *   'DruxtField[Default][SchemaType][Langcode]',
 *   'DruxtField[Default][SchemaType]',
 *   'DruxtField[Type][Langcode]',
 *   'DruxtField[Type]',
 *   'DruxtField[Default][Langcode]',
 *   'DruxtField[Default]',
 * ]
 *
 * @example <caption>Media field</caption> @lang js
 * [
 *   'DruxtFieldEntityReferenceEntityViewFieldMediaImageViewEn',
 *   'DruxtFieldEntityReferenceEntityViewFieldMediaImageView',
 *   'DruxtFieldEntityReferenceEntityViewFieldMediaImageEn',
 *   'DruxtFieldEntityReferenceEntityViewFieldMediaImage',
 *   'DruxtFieldEntityReferenceEntityViewViewEn',
 *   'DruxtFieldEntityReferenceEntityViewView',
 *   'DruxtFieldDefaultViewEn',
 *   'DruxtFieldDefaultView',
 *   'DruxtFieldEntityReferenceEntityViewEn',
 *   'DruxtFieldEntityReferenceEntityView',
 *   'DruxtFieldDefaultEn',
 *   'DruxtFieldDefault',
 * ]
 */

/**
 * Provides propsData for use in the Wrapper component.
 *
 * @typedef {object} PropsData
 * @param {object[]} errors - JSON:API errors.
 * @param {boolean} relationship - Field relationship status.
 * @param {object} schema - Drupal Field schema information.
 * @param {object} value - The Field value.
 *
 * @example @lang js
 * {
 *   errors: [],
 *   relationship: true,
 *   schema: {
 *     config: {},
 *     description: '',
 *     id: 'field_media_image',
 *     label: {},
 *     required: true,
 *     settings: {},
 *     thirdPartySettings: [],
 *     type: 'entity_reference_entity_view',
 *     weight: 4,
 *   },
 *   value: {
 *     data: {
 *       id: '71a90e86-55b6-40fe-b77d-552dca1bee77',
 *       type: 'media--image',
 *     },
 *     links: {},
 *   },
 * }
 */

/**
 * Provides scoped slots for use in the Wrapper component.
 *
 * @typedef {object} ScopedSlots
 * @param {function} field-# - A slot per field item, e.g. `field-0`.
 * @param {function} label - The field label.
 * @param {function} label-above - The field label, if label position is 'above'.
 * @param {function} label-inline - The field label, if label position is 'inline'.
 * @param {function} default - The appropriate label and fields.
 */
</script>
