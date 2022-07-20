import { Route } from "../../domain/route"
import { achieveTimeline, nextTimelineEvent, Icon } from "../../domain/timeline/command"
import { toElement$ } from "../../jsx"

const title = 'Home'
const path = `/${Route.training}/0`

export default function Exercise ({ destruction$ }) {
  const [blueButton$] = toElement$(destruction$)

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
          onclick={() => nextTimelineEvent({ icon: Icon.mouse, color: 'red' })}>
          Red
        </div>
        <div element$={blueButton$}
          class='waves-effect waves-light btn blue'
          onclick={() => nextTimelineEvent({ icon: Icon.mouse, color: 'blue' })}>
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
          onclick={() => achieveTimeline(undefined)}>
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
