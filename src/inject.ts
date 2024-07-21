import { createIsolatedComponent } from './isolated-element'
import { applyPosition, mountUI } from './mount-ui'
import type { ShadowUIInstance, ShadowUIOptions } from './type'

/**
 * Create a content script UI inside a [`ShadowRoot`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot).
 */
export async function createShadowRootUI<TMounted>(
  options: ShadowUIOptions<TMounted>,
): Promise<ShadowUIInstance<TMounted>> {
  const {
    isolatedContainer: contentContainer,
    wrapperElement: hostElement,
    shadowRoot,
  } = await createIsolatedComponent({
    name: options.name,
    styleOptions: options.styleOptions,
    mode: options.mode ?? 'open',
    eventIsolation: options.eventIsolation ?? false,
  })

  if (options.onCustomize)
    options.onCustomize(contentContainer, hostElement)

  let mounted: TMounted | undefined

  const mount = () => {
    mountUI(hostElement, options)
    applyPosition(hostElement, shadowRoot.querySelector('html'), options)
    mounted = options.onMount(contentContainer, shadowRoot, hostElement)
  }

  const remove = () => {
    options.onRemove?.(mounted)
    hostElement.remove()
    while (contentContainer.lastChild)
      contentContainer.removeChild(contentContainer.lastChild)

    mounted = undefined
  }

  return {
    shadowRoot,
    hostElement,
    contentContainer,
    mount,
    remove,
    get mounted() {
      return mounted
    },
  }
}
