import axios from 'axios'
import Url from 'url-parse'

class DruxtRouter {
  /**
   * Constructor.
   *
   * @param string baseURL
   * @param object options
   */
  constructor (baseURL, options = {}) {
    // Check for URL.
    if (!baseURL) {
      throw new Error('The \'baseURL\' parameter is required.')
    }

    // Setup Axios.
    let axiosSettings = { baseURL }
    if (typeof options.axios === 'object') {
      axiosSettings = Object.assign(axiosSettings, options.axios)
      delete options.axios
    }
    this.axios = axios.create(axiosSettings)

    this.options = {
      endpoint: '/jsonapi',
      types: [
        {
          type: 'entity',
          canonical: route => route.entity.canonical,
          component: 'druxt-entity',
          property: 'entity',
          props: route => ({
            type: route.jsonapi.resourceName,
            uuid: route.entity.uuid
          })
        },
        {
          type: 'views',
          canonical: route => route.resolved,
          component: 'druxt-view',
          property: 'view',
          props: route => ({
            view: route.view.view_id,
            display: route.view.display_id
          })
        }
      ],

      ...options
    }
  }

  /**
   * Returns Drupal entity and route for given path.
   *
   * @param string path
   */
  async get (path) {
    const route = await this.getRoute(path)
    if (route.error) {
      return { route }
    }

    const redirect = this.getRedirect(path, route)

    return { redirect, route }
  }

  /**
   * @param object route
   */
  getRedirect (path, route) {
    // Redirect to route provided redirect.
    if (Array.isArray(route.redirect) && typeof route.redirect[0].to !== 'undefined') {
      return route.redirect[0].to
    }

    // Redirect to root if route is home path but path isn't root.
    if (route.isHomePath) {
      if (path !== '/') {
        return '/'
      }

      return false
    }

    // Redirect if path does not match resolved clean url path.
    if (typeof route.canonical === 'string') {
      const url = new Url(route.canonical)

      if (path !== url.pathname) {
        return url.pathname
      }
    }

    return false
  }

  /**
   * Get a JSON:API resource by type and ID.
   *
   * @param string type
   * @param string id
   */
  async getResource (query = {}) {
    const { id, type } = query
    if (!id || !type) {
      return false
    }

    // @TODO - Get URL from index.
    const url = `${this.options.endpoint}/${type.replace('--', '/')}/${id}`
    const resource = await this.axios.get(url)

    return resource.data.data
  }

  /**
   * Get a JSON:API resource by Drupal route.
   *
   * @param object route
   */
  getResourceByRoute (route) {
    return this.getResource({ id: route.entity.uuid, type: route.jsonapi.resourceName })
  }

  /**
   * Get routing data from Decoupled Router.
   *
   * @param string path
   */
  async getRoute (path) {
    // @TODO - Add validation/error handling.
    const url = `/router/translate-path?path=${path}`

    const response = await this.axios.get(url, {
      // Prevent invalid routes (404) from throwing validation errors.
      validateStatus: status => status < 500
    })

    const data = {
      isHomePath: false,
      jsonapi: {},
      label: false,
      redirect: false,

      ...response.data
    }

    let route = {
      error: false,
      type: false,
      canonical: false,
      component: false,
      isHomePath: data.isHomePath,
      jsonapi: data.jsonapi,
      label: data.label,
      props: false,
      redirect: data.redirect
    }

    // Determine route type by configuration.
    // @TODO - Move type to Decoupled router.
    // @SEE  - https://www.drupal.org/project/decoupled_router/issues/3146024
    for (const key in this.options.types) {
      const type = {
        ...this.options.types[key]
      }

      if (typeof type.property !== 'string' || typeof data[type.property] === 'undefined') {
        continue
      }
      delete type.property

      // Construct canonical link.
      if (typeof type.canonical === 'function') {
        type.canonical = type.canonical(data)
      }

      // Construct props.
      if (typeof type.props === 'function') {
        type.props = type.props(data)
      }

      // Merge type
      route = {
        ...route,
        ...type
      }
      break
    }

    // Process Axios error.
    if (!(response.status >= 200 && response.status < 300)) {
      route.error = {
        statusCode: response.status,
        message: response.statusText
      }
    }

    return route
  }
}

export { DruxtRouter }
