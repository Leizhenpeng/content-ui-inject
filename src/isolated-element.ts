import isValidCustomElementName from 'is-potential-custom-element-name'
import type { IsolatedElementOptions } from './type'

/**
 * Create an HTML element that has isolated styles from the rest of the page.
 * @param {IsolatedElementOptions} options - The options for creating the isolated element.
 * @returns {Promise<{ wrapperElement: HTMLElement; isolatedContainer: HTMLElement; shadowRoot: ShadowRoot; }>}
 * - A `wrapperElement` that can be added to the DOM
 * - The `shadowRoot`
 * - An `isolatedContainer` that you should mount your UI to.
 *
 * @example
 * const { isolatedContainer, wrapperElement } = await createIsolatedComponent({
 *   name: 'example-ui',
 *   styleOptions: { textContent: "p { color: red }" },
 *   eventIsolation: true // or ['keydown', 'keyup', 'keypress']
 * });
 *
 * // Create and mount your app inside the isolation
 * const ui = document.createElement("p");
 * ui.textContent = "Example UI";
 * isolatedContainer.appendChild(ui);
 *
 * // Add the UI to the DOM
 * document.body.appendChild(wrapperElement);
 */
export async function createIsolatedComponent(options: IsolatedElementOptions): Promise<{
  wrapperElement: HTMLElement
  isolatedContainer: HTMLElement
  shadowRoot: ShadowRoot
}> {
  const { name, mode = 'closed', styleOptions, eventIsolation = false } = options

  if (!isValidCustomElementName(name)) {
    throw new Error(
            `"${name}" is not a valid custom element name. It must be two words and kebab-case, with a few exceptions. See spec for more details: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name`,
    )
  }

  const wrapperElement = document.createElement(name)
  const shadowRoot = wrapperElement.attachShadow({ mode })
  const isolatedContainer = document.createElement('html')
  const isolatedBody = document.createElement('body')
  const isolatedHead = document.createElement('head')

  if (styleOptions) {
    const style = document.createElement('style')
    try {
      style.textContent = 'url' in styleOptions
        ? await fetch(styleOptions.url).then(res => res.text())
        : styleOptions.textContent
    }
    catch (error) {
      console.error('Failed to load CSS:', error)
      throw new Error('Failed to load CSS')
    }
    isolatedHead.appendChild(style)
  }

  isolatedContainer.appendChild(isolatedHead)
  isolatedContainer.appendChild(isolatedBody)
  shadowRoot.appendChild(isolatedContainer)

  if (eventIsolation) {
    const eventTypes = Array.isArray(eventIsolation) ? eventIsolation : ['keydown', 'keyup', 'keypress']
    eventTypes.forEach((eventType) => {
      isolatedBody.addEventListener(eventType, e => e.stopPropagation())
    })
  }

  return {
    wrapperElement,
    shadowRoot,
    isolatedContainer: isolatedBody,
  }
}
