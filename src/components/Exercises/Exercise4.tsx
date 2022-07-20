import { tag } from "rxjs-spy/operators/tag"
import { css } from "@emotion/css"
import { from, interval, Subject, Subscription, timer } from "rxjs"
import { scan, takeUntil, tap, withLatestFrom, concatMap } from "rxjs/operators"
import { Route } from "../../domain/route"
import { achieveTimeline, nextTimelineEvent, Icon } from "../../domain/timeline/command"
import { toElement$, _withAnimationFrame_ } from "../../jsx"

const globalSubcription$ = new Subject<{ add: boolean, sub: Subscription }>()
const globalSubcriptions$ = globalSubcription$
.pipe(
  scan((acc, sub) => {
    if (sub.add) {
      acc.push(sub.sub)
      return acc
    } else {
      // console.log('sub', sub)
      return acc.filter(i => i !== sub.sub)
    }
  }, [] as Subscription[])
)

globalSubcriptions$.subscribe()

Subscription.prototype.add = function () {
  globalSubcription$.next({ add: true, sub: this })
  return Subscription.prototype.add
}
Subscription.prototype.unsubscribe = function () {
  globalSubcription$.next({ add: false, sub: this })
  return Subscription.prototype.unsubscribe
}

const title = '4'
const path = `/${Route.training}/4`

const animationTransform = [
  { transform: 'scale(2)' },
  { transform: 'scale(1)' },
]

const animationTiming = {
  duration: 3000,
  iterations: Infinity
}

export default function Exercise ({ destruction$ }) {
  let success

  const [subElement$] = toElement$(destruction$);
  const [threeSecond$] = toElement$(destruction$)
  const interval$ = interval(animationTiming.duration)
  const subscription$ = new Subject<Subscription>();
  const subscriptions$ = subscription$
  .pipe(
    scan((acc, subscription) => {
      acc.push(subscription)
      return acc
    }, [] as Subscription[])
  )

  subscription$
  .pipe(
    withLatestFrom(subElement$),
    takeUntil(destruction$)
  )
  .subscribe(([subscription, subElelement]) => {
    subElelement.appendChild(<div
      disabled
      class='waves-effect waves-light btn red'
      onclick={function () {
      }}>
      Unsubscribe
    </div>)
  })

  threeSecond$
  .pipe(
    takeUntil(destruction$)
  )
  .subscribe(threeSecond => {
    threeSecond.animate(animationTransform, animationTiming)
  })

  // success checker
  interval$
  .pipe(
    withLatestFrom(subscriptions$),
    takeUntil(destruction$)
  )
  .subscribe(([_, subscriptions]) => {
    if (!success && subscriptions.length > 1 && subscriptions.every(i => i.closed)) {
      achieveTimeline(undefined)
      success = true
    }
  })

  const destructionStream$ = new Subject()

  destructionStream$
  .pipe(
    withLatestFrom(subElement$),
    takeUntil(destruction$)
  )
  .subscribe(([_, subElement]) => {
    while (subElement.firstChild) {
      subElement.removeChild(subElement.firstChild)
    }
  })

  // example array that self completes
  subscription$.next(
    from([1, 2, 3, 4, 5])
    .pipe(
      concatMap(() => timer(1000)), // slow it down so we can see it separated in the timeline
      tag('from-1-5'),
    )
    .subscribe(i => {
      nextTimelineEvent({ icon: Icon.thumb_up, color: 'blue' })
    })
  )

  subscription$.next(
    interval$
    .pipe(
      tag('adhoc-sub'),
      takeUntil(destructionStream$),
      tap(() => nextTimelineEvent({ icon: Icon.message, color: 'green' }))
    )
    .subscribe()
  )

  return (
    <div>
      <h3>Exercise {title}</h3>
      Another way to clean up subscriptions (my preferred) is to use takeUntil().
      <br />
      <br />
      Some observables will clean themselves up. Subscriptions will clean themselves up whenever the observable emits "complete." Which never happens with an interval, but other things like from([1,2,3]) would complete immediately after emitting each item in the array. Or of(fetch(...)) would complete when the fetch promise resolves.
      <br />
      <br />
      One more example of a self completing subscription is with the "take()" operator. It will complete once the subscription receives the supplied number of emissions.
      <br />
      <br />
      <div>
        <i element$={threeSecond$} class="material-icons dp48">timer_3</i>
      </div>
      <br />
      <br />
      When each subscription is setup with takeUntil, it will unsubscribe and clean up whenever the observable inside takeUntil emits.
      <br />
      <br />
      <div element$={subElement$} class={css`
        display: flex;
        flex-direction: column;
      `} />
      <br />
      <br />
      Modify the code to takeUntil destructionStream$ emits. Note: the UI elements will be removed when you click Emit Destruction, but that doesn't necessarily mean the underlying subscriptions are completed.
      <br />
      <div
        class='waves-effect waves-light btn red'
        onclick={() => {
          destructionStream$.next(undefined)
        }}>
        Emit Destruction
      </div>
    </div>
  )
}

export const exercise4 = {
  Exercise,
  path,
  title
}
