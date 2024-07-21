import type { Anchor, InjectOptions, PositionOptions } from './type'

function getElementByXPath(xpath: string): Element | undefined {
  const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
  return (result.singleNodeValue as Element) ?? undefined
}

function getElementBySelector(selector: string): Element | undefined {
  return document.querySelector<Element>(selector) ?? undefined
}

function resolveInjectAnchor(injectAnchor: Anchor) {
  return typeof injectAnchor === 'function' ? injectAnchor() : injectAnchor
}

export function getAnchor(anchor: Anchor) {
  if (anchor == null)
    return document.body

  const resolved = resolveInjectAnchor(anchor)

  if (typeof resolved === 'string')
    return resolved.startsWith('/') ? getElementByXPath(resolved) : getElementBySelector(resolved)

  return resolved as Element
}

export function mountUI(root: HTMLElement, options: InjectOptions) {
  const anchor = getAnchor(options.injectAnchor)
  if (anchor == null)
    throw new Error('Failed to mount content script UI: could not find anchor element')

  switch (options.injectMode) {
    case undefined:
    case 'last':
      anchor.append(root)
      break
    case 'first':
      anchor.prepend(root)
      break
    case 'replace':
      anchor.replaceWith(root)
      break
    case 'after':
      anchor.parentElement?.insertBefore(root, anchor.nextElementSibling)
      break
    case 'before':
      anchor.parentElement?.insertBefore(root, anchor)
      break
    default:
      options.injectMode(anchor, root)
      break
  }
}

export function applyPosition(
  rootElement: HTMLElement,
  targetElement: HTMLElement | undefined | null,
  options: PositionOptions,
): void {
  if (options.position === 'inline')
    return

  if (options.zIndex != null)
    rootElement.style.zIndex = String(options.zIndex)

  rootElement.style.overflow = 'visible'
  rootElement.style.position = 'relative'
  rootElement.style.width = '0'
  rootElement.style.height = '0'
  rootElement.style.display = 'block'

  if (targetElement) {
    if (options.position === 'overlay') {
      targetElement.style.position = 'absolute'
      if (options.alignment?.startsWith('bottom-'))
        targetElement.style.bottom = '0'
      else
        targetElement.style.top = '0'

      if (options.alignment?.endsWith('-right'))
        targetElement.style.right = '0'
      else
        targetElement.style.left = '0'
    }
    else {
      targetElement.style.position = 'fixed'
      targetElement.style.top = '0'
      targetElement.style.bottom = '0'
      targetElement.style.left = '0'
      targetElement.style.right = '0'
    }
  }
}
