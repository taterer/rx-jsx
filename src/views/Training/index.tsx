import { css, cx } from "@emotion/css";
import { map, share, takeUntil, withLatestFrom } from "rxjs/operators";
import { tag } from "@taterer/rxjs-debugger";
import { Route } from "../../domain/route";
import { pathname$, pathnameChange$ } from "../../domain/route/query";
import { withAnimationFrame } from "@taterer/rx-jsx";
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
import { Observable, Subject } from "rxjs";

export interface ExerciseModule {
  Exercise: Function
  path: string,
  title: string
}

const exercises: ExerciseModule[] = [
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
  pathname$
  .pipe(
    takeUntil(destruction$)
  )
  .subscribe(pathname => {
    // redirect "/training" to "/training/1"
    if (pathname === '/' || pathname === `/${Route.training}`) {
      replaceHistory({ url: landing.path })
    }
  })

  const activeExerciseIndex$: Observable<number> = pathname$
  .pipe(
    withAnimationFrame,
    map(pathname => exercises.findIndex(exercise => exercise.path === pathname)),
  )

  const content$ = activeExerciseIndex$
  .pipe(
    map(index => {
      const Exercise = exercises[index].Exercise
      return <Exercise destruction$={pathnameChange$} />
    }),
    share(),
    takeUntil(destruction$)
  )

  const back$ = activeExerciseIndex$
  .pipe(
    map(index => {
      if (index > 0) {
        return (
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
      }
    }),
    share(),
    takeUntil(destruction$)
  )

  const next$ = activeExerciseIndex$
  .pipe(
    map(index => {
      if (exercises.length -1 > index) {
        return (
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
      }
    }),
    share(),
    takeUntil(destruction$)
  )

  complete$
  .pipe(
    tag({ name: 'Complete', color: 'gold', icon: 'star' }),
    withLatestFrom(next$),
    takeUntil(destruction$)
  )
  .subscribe(([timelineEvent, forward]) => {
    if (forward) {
      forward.removeAttribute('disabled')
    }
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
          <div single$={content$} />
        </div>
        <div class={css`
          width: 100%;
          display: flex;
          justify-content: space-between;
        `}>
          <div single$={back$} />
          <div single$={next$} />
        </div>
      </div>
    </div>
  )
}
