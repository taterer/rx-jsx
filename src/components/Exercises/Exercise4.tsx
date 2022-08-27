import { css } from "@emotion/css"
import { interval, of, Subject, Subscription } from "rxjs"
import { map, scan, takeUntil, withLatestFrom } from "rxjs/operators"
import { tag } from "@taterer/rxjs-debugger";
import { Route } from "../../domain/route"
import { complete$ } from "../../views/Training"

const title = '4'
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
    map(subscription => <div
      class='waves-effect waves-light btn red'
      onclick={function () {
        /*
        This is where we are manually calling unsubscribe on each subscription
        and what could be returned inside of a useEffect function in React
        */
        // use the subscription variable here to unsubscribe
        // this.remove() // optionally remove the unsubscribe element
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

  return (
    <div>
      <h3>Exercise {title}</h3>
      If you are coming from the previous exercise, you might notice that there are still events firing in the timeline. Uh-oh! This website must be buggy. We didn't clean up the subscriptions!
      <br />
      <br />
      It may be easy to forget to subscribe, but it's usually pretty straightforward to figure that out. How do you know if you forget to unsubscribe? Well, you might notice a memory leak. Let's find a better way.
      <br />
      <br />
      <div single$={threeSecond$} />
      <br />
      Make a few subscribtions by clicking Subscribe (at least 2).
      <br />
      <br />
      <div
        class='waves-effect waves-light btn green'
        onclick={() => {
          subscription$.next(
            interval$
            .pipe(
              tag({ name: `Exercise ${title} Subscription`, color: 'green' }),
            )
            .subscribe())
        }}>
        Subscribe
      </div>
      <br />
      <br />
      One way we could solve this is just manually calling unsubscribe on every subscription. This could be done automatically in the cleanup of a useEffect where the subscription is created.
      <br />
      <br />
      Update the onclick handler for the Unsubscribe buttons to unsubscribe, and remove the element.
      <br />
      <br />
      <div multi$={unsubscribe$} class={css`
        display: flex;
        flex-direction: column;
      `} />
    </div>
  )
}

export const exercise = {
  Exercise,
  path,
  title
}
