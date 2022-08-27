import { fromEvent, of, Subject, switchMap, takeUntil } from "rxjs"
import { tag, Icon } from "@taterer/rxjs-debugger";
import { Route } from "../../domain/route"
import { complete$ } from "../../views/Training"

const title = 'Intro'
const path = `/${Route.training}/intro`

export default function Exercise ({ destruction$ }) {
  const blueButton$ = of(
    <div class='waves-effect waves-light btn blue'>BLUE</div>
  )

  const blueButtonClick = blueButton$
  .pipe(
    switchMap(blueButton => fromEvent(blueButton, 'click')),
    takeUntil(destruction$)
  )

  blueButtonClick.subscribe(() => blue$.next(undefined))

  const red$ = new Subject()
  const blue$ = new Subject()

  red$
  .pipe(
    tag({ name: 'Welcome Red', color: 'red', icon: Icon.hotel }),
    takeUntil(destruction$),
  )
  .subscribe()

  blue$
  .pipe(
    tag({ name: 'Welcome Blue', color: 'blue', icon: Icon.train }),
    takeUntil(destruction$),
  )
  .subscribe()

  return (
    <div>
      <div>
        <h3>Intro</h3>
        Practice working with RxJS, and take your Observables to the .next() level!
        <br />
        <br />
        To work through the exercises, clone the RxJS repo from <a href="https://github.com/taterer/rx-jsx" target="_blank">https://github.com/taterer/rx-jsx</a>.
        <br />
        <br />
        Each exercise will prompt you to change the code. The code you will change is in the corresponding exercise file in the repository `src/components/Exercises`.
        <br />
        <br />
        While working on each exercise, use the <a href='https://www.npmjs.com/package/@taterer/rxjs-debugger' target='_blank'>RxJS Debugger</a> in the bottom left. It shows any active subscriptions that have been tagged, and any events going through them. Tagged pipes will also have corresponding logs in the console.
        <br />
        <br />
        Click on the buttons below to see how it looks.
        <br />
        <div
          class='waves-effect waves-light btn red'
          onclick={() => red$.next(undefined)}>
          Red
        </div>
        <span single$={blueButton$}></span>
        <br />
        <br />
        In order to move to the next exercise, the requirements presented by the exercise must be met. There will be comments in the code indicating where the changes should be made. When the requirements are are met you will see a golden star in the timeline.
        <br />
        <br />
        Click on the star button to move on to the first exercise.
        <br />
        <div class='waves-effect waves-light btn orange'
          onclick={() => complete$.next(undefined)}>
          Star
        </div>
      </div>
    </div>
  )
}

export const intro = {
  Exercise,
  path,
  title
}
