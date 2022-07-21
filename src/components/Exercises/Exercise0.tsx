import { Subject, takeUntil } from "rxjs"
import { Route } from "../../domain/route"
import { Icon } from "../../domain/timeline/command"
import { toElement$ } from "../../jsx"
import { tag } from "../../utils/tag"
import { complete$ } from "../../views/Training"

const title = 'Home'
const path = `/${Route.training}/0`

export default function Exercise ({ destruction$ }) {
  const [blueButton$] = toElement$(destruction$)

  const red$ = new Subject()
  const blue$ = new Subject()

  red$
  .pipe(
    tag({ name: 'Exercise 1 Red', color: 'red', icon: Icon.message }),
    takeUntil(destruction$),
  )
  .subscribe()

  blue$
  .pipe(
    tag({ name: 'Exercise 1 Blue', color: 'blue', icon: Icon.message }),
    takeUntil(destruction$),
  )
  .subscribe()

  return (
    <div>
      <div>
        <h3>Welcome</h3>
        Practice working with RxJS, and take your Observables to the .next() level!
        <br />
        <br />
        Each exercise will prompt you to change the code. The code you will change is in the corresponding exercise file in the repository `src/components/Exercises`.
        <br />
        <br />
        While working on each exercise, there will be two visual time lines you can use to debug your code. One shows a scrolling timeline of events, while the other retains the full history.
        <br />
        <br />
        Click on the buttons below to see how it looks.
        <br />
        <div
          class='waves-effect waves-light btn red'
          onclick={() => red$.next(undefined)}>
          Red
        </div>
        <div element$={blueButton$}
          class='waves-effect waves-light btn blue'
          onclick={() => blue$.next(undefined)}>
          Blue
        </div>
        <br />
        <br />
        In order to move to the next exercise, the requirements presented by the exercise must be met. There will be comments in the code indicating where the changes should be made. When the requirementsare are met you will see a golden star in the timeline.
        <br />
        <br />
        Click on the star button to move on to the first exercise.
        <br />
        <div element$={blueButton$}
          class='waves-effect waves-light btn orange'
          onclick={() => complete$.next(undefined)}>
          Star
        </div>
      </div>
    </div>
  )
}

export const exercise0 = {
  Exercise,
  path,
  title
}
