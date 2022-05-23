import { BehaviorSubject, Observable, Subject } from "rxjs"

/*
Reminder to review the theory in the README
*/

export function commandFactory<T> (defaultValue?: T): [Observable<T>, (event: T) => void] {
  const subject$ = defaultValue ? new BehaviorSubject(defaultValue) : new Subject<T>()

  function addEvent (event: T) {
    subject$.next(event)
  }
  return [
    subject$.asObservable(),
    addEvent
  ]
}
