import { interval, of, Subject, Subscription } from "rxjs"
import { share, takeUntil } from "rxjs/operators"
import { tag } from "@taterer/rxjs-debugger";
import { Route } from "../../domain/route"
import { complete$ } from "../../views/Training"

const title = '3'
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
  const event$ = new Subject()
  const threeSecond$ = of(
    <i class="material-icons dp48">timer_3</i>
  )
  const interval$ = interval(animationTiming.duration)
  const subscriptions: Subscription[] = []
  const sharedInterval$ = interval$
  .pipe(
    tag({ name: `Exercise ${title} Shared`, color: 'green' }),
    share()
  )
  const subscription = undefined // create a new subscription of the sharedInterval$ observable
  // EG: sharedInterval$.subscribe()

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
    takeUntil(destruction$)
  )
  .subscribe(() => {
    if (!success && subscription && subscriptions.length) {
      complete$.next(undefined)
      success = true
    }
  })

  return (
    <div>
      <h3>Exercise {title}</h3>
      When you create a pipe, it's easy to forget to subscribe. The pipe will be created, but no events will actually be processed until you subscribe.
      <br />
      <br />
      <div single$={threeSecond$} />
      <br />
      Not only will no events be handled, the event emitter itself will not be created. This animation is deceiving, because nothing is being emitted. An interval is created when you click subscribe.
      <br />
      <br />
      See what happens when you click subscribe multiple times.
      <br />
      <br />
      <div
        class='waves-effect waves-light btn green'
        onclick={() => {
          subscriptions.push(
            interval$ // change this to sharedInterval$
            .pipe(
              tag({ name: `Exercise ${title} Subscription`, color: 'green' })
            )
            .subscribe(i => event$.next(undefined))
          )
        }}>
        Subscribe
      </div>
      <br />
      <br />
      The messages are not in sync with each other, or the animation which began when the component mounted, since they are all on their own 3 second intervals.
      <br />
      <br />
      Let's sync them all with the animation. Change the subscription from using "interval$" to "sharedInterval$" and then double click on Subscribe again.
      <br />
      <br />
      The sharedInterval$ uses "share()" in its pipe, which means it will not create a new interval for each subscription, but use the same underlying observable. This is the same behaviour you see with subjects: multicast.
      <br />
      <br />
      This got us most of the way there, but it's still not in sync with the animation. As a simple exercise, let's keep it simple, and just subscribe immediately, so the interval matches the animation. Create a subscription to sharedInterval$ when we create the "subscription" const.
      <br />
      <br />
      Ahh, it's much nicer when things line up.
      <br />
      <br />
      Unless you skipped changing the interval$ to sharedInterval$, but that's fine. Let's move onto the next exercise.
    </div>
  )
}

export const exercise = {
  Exercise,
  path,
  title
}
