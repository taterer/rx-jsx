import { css, cx } from "@emotion/css";
import { takeUntil, withLatestFrom } from "rxjs/operators";
import { Route } from "../../domain/route";
import { pathname$, pathnameChange$ } from "../../domain/route/query";
import { toElement$, _withAnimationFrame_ } from "../../jsx";
import { panel } from "../../styles";
import { exercise0  } from "../../components/Exercises/Exercise0";
import { exercise1  } from "../../components/Exercises/Exercise1";
import { exercise2  } from "../../components/Exercises/Exercise2";
import { exercise3  } from "../../components/Exercises/Exercise3";
import { exercise4  } from "../../components/Exercises/Exercise4";
import { pushHistory, replaceHistory } from "../../domain/route/command";
import NavbarItem from "./NavbarItem";
import { Subject } from "rxjs";
import { tag } from "../../utils/tag";

const exercises = [
  exercise0,
  exercise1,
  exercise2,
  exercise3,
  exercise4,
]

export const complete$ = new Subject()

export default function Training ({ destruction$ }) {
  const [content$, setContent] = toElement$(destruction$)
  const [back$, setBack] = toElement$(destruction$)
  const [forward$, setForward] = toElement$(destruction$)

  pathname$
  .pipe(
    _withAnimationFrame_,
    takeUntil(destruction$)
  )
  .subscribe(pathname => {
    // redirect "/training" to "/training/1"
    if (pathname === '/' || pathname === `/${Route.training}`) {
      replaceHistory({ url: exercise0.path })
    }
    // set content to appropriate exercise
    exercises.some((exercise, index) => {
      if (exercise.path === pathname) {
        setContent(<exercise.Exercise destruction$={pathnameChange$} />)
        if (index > 0) {
          setBack(
            <div
              onclick={() => pushHistory({ url: exercises[index - 1].path })}
              class={cx('btn blue', css`
              display: flex;
              justify-content: center;
            `)}>
              <i class="material-icons dp48">arrow_back</i>
              Back
            </div>
          )
        } else {
          setBack(<div />)
        }
        if (exercises.length -1 > index) {
          setForward(
            <div
              disabled
              onclick={() => pushHistory({ url: exercises[index + 1].path })}
              class={cx('btn blue', css`
                display: flex;
                justify-content: center;
              `)}>
              Next
              <i class="material-icons dp48">arrow_forward</i>
            </div>
          )
        } else {
          setForward(<div />)
        }
        return true
      }
    })
  })

  complete$
  .pipe(
    tag({ name: 'Complete', color: 'gold', icon: 'star', tap: true }),
    withLatestFrom(forward$),
    takeUntil(destruction$)
  )
  .subscribe(([timelineEvent, forward]) => {
    forward.removeAttribute('disabled')
  })

  return (
    <div class={css`
      max-width: 800px;
      width: 100%;
    `}>
      <div class={css`
        display: flex;
        flex-direction: column;
      `}>
        <nav class='blue' style='width: fit-content;'>
          <ul id='nav-mobile'>
            {exercises.map(exercise => <NavbarItem destruction$={destruction$} path={exercise.path} title={exercise.title} />)}
          </ul>
        </nav>
        <div class={panel}>
          <div element$={content$} />
        </div>
        <div class={css`
          width: 100%;
          display: flex;
          justify-content: space-between;
        `}>
          <div element$={back$} />
          <div element$={forward$} />
        </div>
      </div>
    </div>
  )
}
