import { css } from "@emotion/css"
import { interval, Subject, Subscription } from "rxjs"
import { scan, takeUntil, withLatestFrom } from "rxjs/operators"
import { tag } from "@taterer/rxjs-debugger";
import { Route } from "../../domain/route"
import { toElement$ } from "../../jsx"
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

  return (
    <div>
      <h3>Exercise {title}</h3>
      If you are coming from the previous exercise, you might notice that there are still events firing in the timeline. Uh-oh! This website must be buggy. We didn't clean up the subscriptions!
      <br />
      <br />
      It may be easy to forget to subscribe, but it's usually pretty straightforward to figure that out. How do you know if you forget to unsubscribe? Well, you might notice a memory leak. Let's find a better way.
      <br />
      <br />
      <div>
        <i element$={threeSecond$} class="material-icons dp48">timer_3</i>
      </div>
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
      <div element$={subElement$} class={css`
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
