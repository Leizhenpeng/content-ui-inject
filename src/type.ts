/**
 * Options that can be passed into `createIsolatedElement`.
 */
export interface IsolatedElementOptions {
  /**
   * A unique HTML tag name (two words, kebab case - [see spec](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)) used when defining the web component used internally. Don't use the same name twice for different UIs.
   * @example "sticky-note"
   * @example "anime-skip-player"
   * @example "github-better-line-count-diff"
   */
  name: string
  /**
   * See [`ShadowRoot.mode`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/mode).
   * @default 'closed'
   */
  mode?: 'open' | 'closed'
  /**
   * Either the URL to a CSS file or the text contents of a CSS file. The styles will be mounted inside the shadow DOM so they don't effect the rest of the page.
   */
  styleOptions?: { url: string } | { textContent: string }
  /**
   * When enabled, `event.stopPropagation` will be called on events trying to bubble out of the shadow root.
   *
   * - Set to `true` to stop the propagation of a default set of events, `["keyup", "keydown", "keypress"]`
   * - Set to an array of event names to stop the propagation of a custom list of events
   */
  eventIsolation?: boolean | string[]
}

export type AppendMode = 'last' | 'first' | 'replace' | 'before' | 'after' | ((anchor: Element, ui: Element) => void)

export type Anchor = string | Element | null | undefined | (() => string | Element | null | undefined)

export interface InjectOptions {
  injectAnchor?: Anchor
  injectMode?: AppendMode
}

export type OverlayAlignment =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export interface OverlayPositionOptions {
  position: 'overlay'
  /**
   * The `z-index` used on the `wrapper` element. Set to a positive number to show your UI over website
   * content.
   */
  zIndex?: number
  /**
   * When using `type: "overlay"`, the mounted element is 0px by 0px in size. Alignment specifies
   * which corner is aligned with that 0x0 pixel space.
   *
   * ![Visualization of alignment options](https://wxt.dev/content-script-ui-alignment.png)
   *
   * @default "top-left"
   */
  alignment?: OverlayAlignment
}

export interface InlinePositionOptions {
  position: 'inline'
}

export interface ModalPositionOptions {
  position: 'modal'
  /**
   * The `z-index` used on the `shadowHost`. Set to a positive number to show your UI over website
   * content.
   */
  zIndex?: number
}

/**
 * Choose between `"overlay"`,`"inline"`,  or `"modal" `types.
 *
 * ![Visualization of different types](https://wxt.dev/content-script-ui-type.png)
 */
export type PositionOptions =
  | InlinePositionOptions
  | OverlayPositionOptions
  | ModalPositionOptions

// contentUI
export type ContentUIOptions<TMounted> = PositionOptions & InjectOptions & {
  onRemove?: (mounted: TMounted | undefined) => void
}

export type ShadowUIOptions<TMounted> =
  ContentUIOptions<TMounted> & IsolatedElementOptions & {
    onMount: (
      uiContainer: HTMLElement,
      shadow: ShadowRoot,
      shadowHost: HTMLElement,
    ) => TMounted
  }

export interface UIInstance<TMounted> {
  mount: () => void
  remove: () => void
  mounted: TMounted | undefined
}

export interface ShadowUIInstance<TMounted>
  extends UIInstance<TMounted> {

  hostElement: HTMLElement
  contentContainer: HTMLElement
  shadowRoot: ShadowRoot
}
