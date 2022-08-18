import { Subject, takeUntil } from "rxjs"
import { Route } from "../../domain/route"
import { complete$ } from "../../views/Training"

const title = '2'
const path = `/${Route.training}/${title}`

export default function Exercise ({ destruction$ }) {
  const buttonClick$ = new Subject()
  
  buttonClick$
  .pipe(
    takeUntil(destruction$)
  ).subscribe(() => complete$.next(undefined))

  function clickHandler () {
    // EG: buttonClick$.next(undefined)
  }

  return (
    <div>
      <h3>Exercise {title}</h3>
      <div>
        Another core tool in RxJS is the subject. Subjects are "multicast" meaning each subscription shares the same underlying observable, but we'll talk about that more in the next exercise.
        <br />
        <br />
        A subject gives us the ability to easily push into a pipe, when there isn't an event handler that can be easily wrapped as an observable.
        <br />
        <br />
        To accomplish the same task as the previous exercise, let's use a subject. In the code you will see the "buttonClick$" subject. Note the use of "$" in naming observables and subjects.
        <br />
        <br />
        The subject does not have an underlying event that causes it to emit. It is waiting to be written to.
        It's like promising someone their phone will ring when someone calls their number, before giving them a phone.
        We don't know the exact source, but we have the destination setup for the events.
        <br />
        <br />
        It is important to avoid prescribing the ultimate destinations (the subscribers), because we don't need or want to know all of the users of an observable. This allows us to create pure code.
        <br />
        <br />
        The subject bridges the gap between events of possibly unknown origin or origins, and the subscribers.
        Subscribers have something to subscribe to, before event emitters are created.
        <br />
        <br />
        Subject in hand, let's create an onclick handler for the button below.
        <br />
        <br />
        <div
          class='btn green'
          // onclick={clickHandler}
          >BUTTON</div>
        <br />
        <br />
        Make sure the clickHandler is pushing "undefined" to the complete$ subject.
        Once the onclick handler is setup, we'll just need to click the button and emit an event to complete the exercise.
        <br />
        <br />
        We'll practice creating subscriptions in the next exercise.
      </div>
    </div>
  )
}

export const exercise = {
  Exercise,
  path,
  title
}
