import { css } from "@emotion/css"
import { from, interval, of, Subject, Subscription, timer } from "rxjs"
import { scan, takeUntil, withLatestFrom, concatMap, map } from "rxjs/operators"
import { tag } from "@taterer/rxjs-debugger";
import { Route } from "../../domain/route"
import { complete$ } from "../../views/Training"

const title = '5'
const path = `/${Route.training}/${title}`

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

  const threeSecond$ = of(
    <i class="material-icons dp48">timer_3</i>
  )
  const interval$ = interval(animationTiming.duration)
  const subscription$ = new Subject<Subscription>();
  const subscriptions$ = subscription$
  .pipe(
    scan((acc, subscription) => {
      acc.push(subscription)
      return acc
    }, [] as Subscription[])
  )

  const unsubscribe$ = subscription$
  .pipe(
    map(() => <div
      disabled
      class='waves-effect waves-light btn red'
      onclick={function () {
      }}>
      Unsubscribe
    </div>),
    takeUntil(destruction$)
  )

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

  // example array that self completes
  subscription$.next(
    from([1, 2, 3, 4, 5])
    .pipe(
      concatMap(() => timer(1000)), // slow it down so we can see it separated in the timeline
      tag({ name: `Exercise ${title} Self Cleaning`, color: 'blue' })
    )
    .subscribe()
  )

  subscription$.next(
    interval$
    .pipe(
      tag({ name: `Exercise ${title} Subscription`, color: 'green' }),
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
      <div single$={threeSecond$} />
      <br />
      <br />
      When each subscription is setup with takeUntil, it will unsubscribe and clean up whenever the observable inside takeUntil emits.
      <br />
      <br />
      <div multi$={unsubscribe$} class={css`
        display: flex;
        flex-direction: column;
      `} />
      <br />
      <br />
      Modify the code to takeUntil destructionStream$ emits.
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

export const exercise = {
  Exercise,
  path,
  title
}
