import { css } from "@emotion/css"
import { from, interval, Subject, Subscription, timer } from "rxjs"
import { scan, takeUntil, tap, withLatestFrom, concatMap } from "rxjs/operators"
import { Route } from "../../domain/route"
import { toElement$, _withAnimationFrame_ } from "../../jsx"
import { tag } from "../../utils/tag"
import { complete$ } from "../../views/Training"

const title = '3'
const path = `/${Route.training}/3`

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
  .subscribe(([subscription, subElement]) => {
    subElement.appendChild(<div
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
      complete$.next(undefined)
      success = true
    }
  })

  const destructionStream$ = new Subject()

  destructionStream$
  .pipe(
    withLatestFrom(subElement$),
    tag({ name: 'Exercise 3 Destruction', color: 'red' }),
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
      tag({ name: 'Exercise 3 Self Cleaning', color: 'blue' })
    )
    .subscribe()
  )

  subscription$.next(
    interval$
    .pipe(
      tag({ name: 'Exercise 3 Subscription', color: 'green' }),
      /* 
        Take until should go here
      */              
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

export const exercise3 = {
  Exercise,
  path,
  title
}
