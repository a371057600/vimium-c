export interface EscF {
  <T extends Exclude<HandlerResult, HandlerResult.ExitPassMode>> (this: void, i: T): T;
  (this: void, i: HandlerResult.ExitPassMode): unknown;
}
export type XrayedObject<T extends object> = T & { wrappedJSObject: T }

export let VOther: BrowserType = !(Build.BTypes & ~BrowserType.Chrome) || !(Build.BTypes & ~BrowserType.Firefox)
    || !(Build.BTypes & ~BrowserType.Edge)
    ? Build.BTypes as number
    : Build.BTypes & BrowserType.Edge && !!(window as {} as {StyleMedia: unknown}).StyleMedia ? BrowserType.Edge
    : Build.BTypes & BrowserType.Firefox && browser ? BrowserType.Firefox
    : BrowserType.Chrome
export function set_VOther (_newRealBrowser: BrowserType): void { VOther = _newRealBrowser }

/** its initial value should be 0, need by {@link #hook} */
export let chromeVer_: BrowserVer = 0 // should be used only if BTypes includes Chrome
export function set_chromeVer_ (_newRealChromeVer: BrowserVer): void { chromeVer_ = _newRealChromeVer }

export const isTop = top === window
export const injector = VimiumInjector
export const doc = document
export const loc_ = location
export const initialDocState = doc.readyState

let esc: EscF | null

/** ==== Status ==== */

export { esc as isAlive_ }

export let isEnabled_ = false
export function set_isEnabled_ (_newIsEnabled: boolean): void { isEnabled_ = _newIsEnabled }

export let isLocked_: 0 | /** locked */ 1 | /** locked and disabled (even with a few hooked keys) */ 3 = 0
export function set_isLocked_ (_newIsLocked: typeof isLocked_): void { isLocked_ = _newIsLocked }

export let readyState_: Document["readyState"] = initialDocState
export function set_readyState_ (_newReadyState: Document["readyState"]): void { readyState_ = _newReadyState }

export let allowRAF_: BOOL = 1
export function set_allowRAF_ (_newAllowRAF: BOOL): void { allowRAF_ = _newAllowRAF }

/** ==== Cache ==== */

export let fgCache: OnlyEnsureItemsNonNull<SettingsNS.FrontendSettingCache>
export function set_fgCache (_newCache: SettingsNS.FrontendSettingCache): void { fgCache = _newCache as typeof fgCache }

export let clickable_: ElementSet
export function set_clickable_ (_newClickable: ElementSet): void { clickable_ = _newClickable }

export let keydownEvents_: KeydownCacheArray;
export function set_keydownEvents_ (_newKeydownEvents: KeydownCacheArray): void { keydownEvents_ = _newKeydownEvents }
export const setupKeydownEvents = function (arr?: KeydownCacheArray): KeydownCacheArray | boolean {
  if (!arr) { return keydownEvents_; }
  return !isEnabled_ || !(keydownEvents_ = arr);
} as {
  (this: void, srcCacheArray: KeydownCacheArray): boolean
  (this: void): KeydownCacheArray
}

/** ==== util functions ==== */

export { esc }
export function set_esc (_newEsc: EscF): void { esc = _newEsc }

export let vApi: VApiTy
export function set_vApi (_newVApi: VApiTy): void { vApi = _newVApi }

let i18n_getMsg: typeof chrome.i18n.getMessage
export let VTr: VTransType = (tid, args) => i18n_getMsg("" + tid, args)
export function set_VTr (_newVTr: VTransType): void { VTr = _newVTr }
export function set_i18n_getMsg (_newGetMsg: typeof i18n_getMsg): void { i18n_getMsg = _newGetMsg }

export const callFunc = (callback: (this: void) => any): void => { callback(); }

export const locHref = () => loc_.href

export const getTime = Date.now

export let onWndFocus = function (this: void): void { /* empty */ }
export function set_onWndFocus (_newOnWndFocus: (this: void) => void): void { onWndFocus = _newOnWndFocus; }

export const safeObj = Object.create as { (o: null): any; <T>(o: null): SafeDict<T> }

export const safer: <T extends object> (opt: T) => T & SafeObject
    = Build.MinCVer < BrowserVer.Min$Object$$setPrototypeOf && Build.BTypes & BrowserType.Chrome
        && !Object.setPrototypeOf
      ? <T extends object> (obj: T): T & SafeObject => { (obj as any).__proto__ = null; return obj as T & SafeObject; }
      : <T extends object> (opt: T): T & SafeObject => Object.setPrototypeOf(opt, null);

export let weakRef_ = (Build.BTypes & BrowserType.ChromeOrFirefox ? <T extends object>(val: T | null | undefined
      ): WeakRef<T> | null | undefined => val && new (WeakRef as WeakRefConstructor)(val)
    : (_newObj: object) => _newObj) as {
  <T extends object>(val: T): WeakRef<T>
  <T extends object>(val: T | null): WeakRef<T> | null
  <T extends object>(val: T | null | undefined): WeakRef<T> | null | undefined
}
export const deref_ = !(Build.BTypes & BrowserType.ChromeOrFirefox) ? weakRef_ as any as never
    : WeakRef ? <T extends object>(val: WeakRef<T> | null | undefined
      ): T | null | undefined => val && val.deref()
    : (weakRef_ = ((val: object) => val) as any) as never

export const raw_unwrap_ff = Build.BTypes & BrowserType.Firefox ? <T extends object> (val: T): T | undefined => {
  return (val as XrayedObject<T>).wrappedJSObject
} : 0 as never

export const unwrap_ff = (!(Build.BTypes & BrowserType.Firefox) ? 0 as never
    : <T extends object> (obj: T): T => (obj as XrayedObject<T>).wrappedJSObject || obj) as {
  <T extends SafeElement>(obj: T): T
  (obj: Element): unknown
  <T extends object>(obj: T): T extends XrayedObject<infer S> ? S : T
}

type TimerFunc<R> = (func: (this: void, fake?: TimerType.fake) => void, time: number) => R
export let timeout_: TimerFunc<ValidTimeoutID> =
    (Build.NDEBUG ? setTimeout : (func, timeout) => setTimeout(func, timeout)) as TimerFunc<ValidTimeoutID>
export let interval_: TimerFunc<ValidIntervalID> =
    (Build.NDEBUG ? setInterval : (func, period) => setInterval(func, period)) as TimerFunc<ValidIntervalID>
export const clearTimeout_: (timer: ValidTimeoutID) => void =
    Build.NDEBUG ? clearTimeout as never : (timer) => clearTimeout(timer as number)
export const clearInterval_: (timer: ValidIntervalID) => void =
    Build.NDEBUG ? clearInterval as never : (timer) => clearInterval(timer as number)

export function replaceBrokenTimerFunc (_newTimerFunc: TimerFunc<number>): void {
  timeout_ = interval_ = _newTimerFunc as TimerFunc<TimerID & number>
}

/**
 * @param target Default to `window`
 * @param eventType string
 * @param func Default to `Stop_`
 * @param disable Default to `0`
 * @param activeMode Default to `{passive: true, capture: true}`; `1` means `passive: false`;
 *        on Firefox, `3` means "on bubbling and not passive"
 */
export const setupEventListener =
  <T extends EventTarget, Active extends 3 | 1 | 0 | undefined = undefined, E extends string = string> (
    target: T | 0, eventType: E
    , func?: ((this: T, e: E extends keyof HTMLElementEventMap
      ? Active extends 1 ? HTMLElementEventMap[E] & ToPrevent : HTMLElementEventMap[E]
      : Active extends 1 ? EventToPrevent : Event) => void) | null | EventListenerObject
    , disable?: boolean | BOOL, activeMode?: Active): void => {
  (disable ? removeEventListener : addEventListener).call(target as unknown as Window || window, eventType,
    <(this: T, e: EventToPrevent) => void> func || Stop_,
    Build.BTypes & BrowserType.Firefox && activeMode === 3 ? !1
    : {passive: !activeMode, capture: true} as EventListenerOptions | boolean as boolean)
}

export const suppressCommonEvents = (target: Window | SafeHTMLElement, extraEvents: string): void => {
    // note: if wheel is listened, then mousewheel won't be dispatched even on Chrome 35
  for (const i of (VTr(kTip.kCommonEvents) + extraEvents).split(" ")) {
    setupEventListener(target, i);
  }
}

export const Stop_ = (event: Pick<Event, "stopImmediatePropagation">): void => { event.stopImmediatePropagation(); }

export const isJSUrl = (str: string): boolean => (<RegExpI & RegExpOne> /^javascript:/i).test(str)

let imgExtRe_: RegExpI | undefined
export const isImageUrl = (str: string | null): boolean => {
  if (!str || str[0] === "#" || str.length < 5 || isJSUrl(str)) {
    return false;
  }
  const end = str.lastIndexOf("#") + 1 || str.length;
  // eslint-disable-next-line @typescript-eslint/ban-types
  str = str.substring!(str.lastIndexOf("/", str.lastIndexOf("?") + 1 || end), end);
  return (imgExtRe_ || (imgExtRe_ = createRegExp(kTip.imgExt, "i"))).test(str)
}

export const recordLog = (tip: kTip | string): void => {
  console.log(tip > 0 ? VTr(<kTip> tip) : tip, loc_.pathname.replace(<RegExpOne> /^.*(\/[^\/]+\/?)$/, "$1"), getTime())
}

export const parseSedOptions = (opts: UserSedOptions): ParsedSedOpts => {
  const sed = opts.sed
  return isTY(sed, kTY.obj) && sed || { r: sed, k: opts.sedKeys || opts.sedKey }
}

export const escapeAllForRe = (str: string): string => str.replace(<RegExpG> /[$()*+.?\[\\\]\^{|}]/g, "\\$&")

export const createRegExp = <S extends kTip, T extends "g" | "i" | ""> (pattern: S, flags: T
    ): T extends "" ? RegExpOne : T extends "i" ? RegExpI : RegExpG =>
    <any> new RegExp(VTr(<kTip> pattern), flags as "g")

export const tryCreateRegExp = <T extends "g" | "gi" | "gim" | "gm" | "i" | "u" | ""> (pattern: string, flags: T
    ): (T extends "" ? RegExpOne : T extends "i" ? RegExpI : RegExpG) | void => {
  try { return <any> new RegExp(pattern, flags as "g") } catch {}
}

/** ==== shortcuts of constant code ==== */

const TYPES = ["string", "object", "function", "number"]
export { TYPES as OBJECT_TYPES }
export const isTY = ((obj: any, ty?: kTY): boolean => typeof obj == TYPES[ty || kTY.str]) as {
  <T extends kTY> (obj: any, ty: T): obj is (T extends kTY.str ? string
      : T extends kTY.obj ? object : T extends kTY.func ? Function : T extends kTY.num ? number : never)
  (obj: any): obj is string
}

export const Lower = (str: string): string => str.toLowerCase()

export const math = Math
export const max_ = Build.NDEBUG ? math.max : (...args: number[]): number => math.max(...args)
export const min_ = Build.NDEBUG ? math.min : (...args: number[]): number => math.min(...args)

export function includes_<T> (this: T[], el: T): boolean { return this.indexOf(el) >= 0 }
