import { tag } from "@taterer/rxjs-debugger"
import {
  fromEvent,
  Observable,
  of,
  takeUntil
} from "rxjs"
import { Route } from "../../domain/route"
import { complete$, ExerciseModule } from "../../views/Training"

const title = '1'
const path = `/${Route.training}/${title}`

export default function Exercise ({ destruction$ }) {
  const button$ = of(
    <div class='btn green'>BUTTON</div>
  )

  button$
  .pipe(
    takeUntil(destruction$)
  )
  .subscribe(button => {
    // button is the green button we want to attach a listener to
    let observable: Observable<any>

    // create an observable for click events on the button element
    // EG: observable = fromEvent(button, 'click')

    // automatically subscribe to our newly created observable
    if (observable) {
      observable
      .pipe(
        tag({ name: `Exercise ${title} Button`, color: 'green' }),
        takeUntil(destruction$)
      )
      .subscribe(() => complete$.next(undefined))
    }
  })

  return (
    <div>
      <h3>Exercise {title}</h3>
      <div>
        The first thing we need is an observable. In order to pipe or subscribe, we need some source.
        <br />
        <br />
        There are many forms of observables. Intervals as an example will emit every x milliseconds.
        Any <a href="https://www.w3schools.com/jsref/dom_obj_event.asp" target="_blank">DOM Events</a> can be turned into an observable.
        <br />
        <br />
        Let's create an observable. In src/components/Exercises/Exercise1.tsx file update the code to create an observable for clicks on the button below.
        <br />
        <br />
        <div single$={button$} />{/* FYI this is where the rx-jsx library comes in, it will look for single$ (and multi$), subscribe to the observable, and mount the latest inside of this element (or append only for multi) */}
        <br />
        <br />
        Once we have an observable, we can subscribe to the events, combine the events with others, and create the flow for our application.
        <br />
        <br />
        In this exercise, the subscriber is already wired up.
        Once the observable is setup, we'll just need to click the button and emit an event to complete the exercise.
        <br />
        <br />
        We'll look at alternative solutions in the next exercise.
      </div>
    </div>
  )
}

export const exercise: ExerciseModule = {
  Exercise,
  path,
  title
}
