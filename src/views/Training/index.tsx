import { css, cx } from "@emotion/css";
import { takeUntil, withLatestFrom } from "rxjs/operators";
import { tag } from "@taterer/rxjs-debugger";
import { Route } from "../../domain/route";
import { pathname$, pathnameChange$ } from "../../domain/route/query";
import { toElement$, _withAnimationFrame_ } from "../../jsx";
import { panel } from "../../styles";
import { intro  } from "../../components/Exercises/Intro";
import { landing  } from "../../components/Exercises/Landing";
import { exercise as exercise1  } from "../../components/Exercises/Exercise1";
import { exercise as exercise2  } from "../../components/Exercises/Exercise2";
import { exercise as exercise3  } from "../../components/Exercises/Exercise3";
import { exercise as exercise4  } from "../../components/Exercises/Exercise4";
import { exercise as exercise5  } from "../../components/Exercises/Exercise5";
import { pushHistory, replaceHistory } from "../../domain/route/command";
import NavbarItem from "./NavbarItem";
import { Subject } from "rxjs";

const exercises = [
  landing,
  intro,
  exercise1,
  exercise2,
  exercise3,
  exercise4,
  exercise5,
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
      replaceHistory({ url: landing.path })
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
    tag({ name: 'Complete', color: 'gold', icon: 'star' }),
    withLatestFrom(forward$),
    takeUntil(destruction$)
  )
  .subscribe(([timelineEvent, forward]) => {
    forward.removeAttribute('disabled')
  })

  return (
    <div class={css`
      max-width: 800px;
      margin-left: 70px;
      width: calc(100% - 70px);
    `}>
      <div class={css`
        display: flex;
        flex-direction: column;
      `}>
        <nav class={cx('blue', css`
          width: fit-content;
          position: fixed;
          left: 0px;
          height: calc(100% - 64px);
          overflow-y: auto;
        `)}>
          <ul id='nav-mobile' class={css`
            display: flex;
            flex-direction: column;
          `}>
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
