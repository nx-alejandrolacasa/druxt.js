# druxt-views

## 0.20.0

### Minor Changes

- 2f2a7cce: Added watch for 'arguments' prop.

### Patch Changes

- fc811db3: Add DruxtModule props to component module stories.
- Updated dependencies [49b67872]
  - druxt-router@0.28.0
  - druxt-blocks@0.16.3
  - druxt-entity@0.26.0
  - druxt@0.20.0

## 0.19.1

### Patch Changes

- ffd9d542: Fixed undefined errors in DruxtView watch methods.
- 45e14b84: Fixed support for nuxt/storybook.
- Updated dependencies [352b7a51]
  - druxt@0.19.3
  - druxt-entity@0.25.1
  - druxt-blocks@0.16.2
  - druxt-router@0.27.4

## 0.19.0

### Minor Changes

- be21952: Added langcode and prefix support to DruxtView component and Vuex store.

  ⚠ Potential breaking change

  ```diff
  - $store.state['druxt/views'].results.frontpage.page_1
  + $store.state['druxt/views'].results.frontpage.page_1[undefined]
  + $store.state['druxt/views'].results.frontpage.page_1.en
  + $store.state['druxt/views'].results.frontpage.page_1.es
  ```

- be21952: Added langcode to component mixins.
- be21952: Added multilingual support to Views block components.

### Patch Changes

- Updated dependencies [be21952]
  - druxt@0.19.0
  - druxt-router@0.27.0
  - druxt-blocks@0.16.0
  - druxt-entity@0.25.0

## 0.18.2

### Patch Changes

- c6d7c83: Fixed available component options.
- 540afca: Updated drupal-jsonapi-params to 2.0.0
- Updated dependencies [540afca]
  - druxt-blocks@0.15.2
  - druxt@0.18.2
  - druxt-entity@0.24.3

## 0.18.1

### Patch Changes

- Updated dependencies [e3d5238]
  - druxt@0.18.0
  - druxt-blocks@0.15.1
  - druxt-entity@0.24.2
  - druxt-router@0.26.1

## 0.18.0

### Minor Changes

- b79701c: feat(#249): Improved DruxtView storybook stories and documentation.

### Patch Changes

- d7e92b2: feat(#249): Fixed errors in storybook.
- Updated dependencies [b79701c]
  - druxt-router@0.26.0
  - druxt-blocks@0.15.0
  - druxt@0.17.0
  - druxt-entity@0.24.0

## 0.17.2

### Patch Changes

- Updated dependencies [60ee4e8]
  - druxt-entity@0.23.0
  - druxt-blocks@0.14.5

## 0.17.1

### Patch Changes

- Updated dependencies [7b749bd]
  - druxt@0.16.0
  - druxt-entity@0.22.0
  - druxt-router@0.25.0
  - druxt-blocks@0.14.4

## 0.17.0

### Minor Changes

- 7709ece: Fixed DruxtViewsFilter render method

  ⚠ Potential breaking change

  _**Note:** This may change the markup of a Druxt View filter component._

### Patch Changes

- Updated dependencies [2ae1d6d]
  - druxt@0.15.0
  - druxt-blocks@0.14.3
  - druxt-entity@0.21.4
  - druxt-router@0.24.2

## 0.16.2

### Patch Changes

- Updated dependencies [45bc0b9]
  - druxt@0.14.0
  - druxt-blocks@0.14.2
  - druxt-entity@0.21.3
  - druxt-router@0.24.1

## 0.16.1

### Patch Changes

- Updated dependencies [9161b38]
  - druxt-router@0.24.0
  - druxt-blocks@0.14.1
  - druxt-entity@0.21.2

## 0.16.0

### Minor Changes

- e7b1533: Refactored DruxtModule fetch hooks

### Patch Changes

- d80f5d4: Fixed issue with undefined wrapper in DruxtViewsFilter
- Updated dependencies [025315a]
  - druxt-entity@0.21.0
  - druxt-blocks@0.14.0
  - druxt@0.13.0
  - druxt-router@0.23.0

## 0.15.0

### Minor Changes

- c769243: Added support for Contextual filters (arguments)

  ```vue
  <DruxtView
    :arguments="[1, 2, 3]"
    displayid="block_1"
    view-id="articles_aside"
  />
  ```

### Patch Changes

- Updated dependencies [4504a2f]
  - druxt@0.12.0
  - druxt-router@0.22.0
  - druxt-entity@0.20.0
  - druxt-blocks@0.13.1

## 0.14.1

### Patch Changes

- b9e5839: Fixed missing templates in package

## 0.14.0

### Minor Changes

- dae345e: Moved `$druxtViews` plugin settings to `$druxt.settings.views`
- dae345e: Added module level options
- 8d28c18: Updated storybook integration

### Patch Changes

- 4da7fd3: Fixed errors when no props provided to component
- Updated dependencies [9d905e8]
  - druxt-router@0.21.0
  - druxt-blocks@0.13.0
  - druxt-entity@0.19.0
  - druxt@0.11.0

## 0.13.0

### Minor Changes

- 715e5ef: Updated component registration method to use the Nuxt `components:dirs` hook

### Patch Changes

- 49454cb: Fixed path to components in Storybook
- Updated dependencies [1ab762c]
  - druxt-router@0.20.0
  - druxt-blocks@0.12.0
  - druxt@0.10.0
  - druxt-entity@0.18.0

## 0.12.1

### Patch Changes

- c4616df: Fixed dependencies
- Updated dependencies [c4616df]
  - druxt-blocks@0.11.1
  - druxt-entity@0.17.1
  - druxt-router@0.19.1

## 0.12.0

### Minor Changes

- 21170fb: Moved Vue components out of bundle

  ⚠ Potential breaking change

  _**Note:** This only effects custom Druxt modules and implementations._

  ```diff
  -import { DruxtView } from 'druxt-views'
  +import DruxtView from 'druxt-views/dist/components/DruxtView.vue'
  ```

### Patch Changes

- Updated dependencies [21170fb]
  - druxt-blocks@0.11.0
  - druxt@0.9.0
  - druxt-entity@0.17.0
  - druxt-router@0.19.0

## 0.11.0

### Minor Changes

- Added support for default template injection

  - For details, see the [Druxt 0.8.0 release notes](/api/packages/druxt/CHANGELOG#080)

- Added ability to load by UUID or View ID

## 0.10.0

### Minor Changes

- Added empty content to results slot if no results

## 0.9.3

### Patch Changes

- Fixed issue with model filter forcing a refresh

## 0.9.2

### Patch Changes

- Added fetchKey to fix hydration issues

## 0.9.1

### Patch Changes

- Fixed issue with default view mode value

## 0.9.0

### Minor Changes

- Added ability to filter JSON:API fields
- Refactored components to use DruxtModule
- Fixed issues with Storybook integration

## 0.8.3

### Patch Changes

- Fixed missing attachement Views

## 0.8.2

### Patch Changes

- Fixed issues with Storybook integration

## 0.8.1

### Patch Changes

- Fixed issues with Storybook integration
- Fixed missing attachements Views

## 0.8.0

### Minor Changes

- Added Storybook intergration
- Fixed broken View results

## 0.7.2

### Patch Changes

- Fixed broken View results

## 0.7.1

### Patch Changes

- Fixed deprecation notice

## 0.7.0

### Minor Changes

- Refactored module to use DruxtClient/DruxtStore
- Added pagination
- Added exposed sorts
- Added exposed filters
- Added Views Vuex store

## 0.6.2

### Patch Changes

- Fixed issue with View display data

## 0.6.1

### Patch Changes

- Updated dependencies

## 0.6.0

### Minor Changes

- Added DruxtRouter View component
- Updated dependencies

## 0.5.1

### Patch Changes

- Updated dependencies

## 0.5.0

### Minor Changes

- Added support for DruxtComponentMixin
- Updated dependencies

## 0.4.2

### Patch Changes

- Updated attachment_before/after slots
- Updated dependencies

## 0.4.1

### Patch Changes

- Added attachment_before/after slots

## 0.4.0

### Minor Changes

## 0.3.0

### Minor Changes

## 0.2.1

### Patch Changes

## 0.2.0

### Minor Changes

## 0.1.0

### Initial release
