import { Route } from "../../domain/route"
import { complete$ } from "../../views/Training"

const title = 'Intro'
const path = `/${Route.training}/intro`

export default function Exercise ({ destruction$ }) {
  setTimeout(() => {
    complete$.next(undefined)
  })
  return (
    <div>
      <h3>{title}</h3>
      <h5>What is an observable?</h5>
      Let's look at a hypothetical example: going on a date, or going to a job interview.
      At the end, they say they will call you. Great! You give them your phone number, and now your phone is an "observable" that might "emit" at anytime.
      They may never call, they may never stop calling you.
      <br />
      <br />
      What could go wrong? Well, you need a subscription to a cell phone provider in order to receive incoming calls.
      Without a subscription, nothing happens.
      <br />
      <br />
      <h5>Subscriptions</h5>
      Subscriptions are setup with an "Observer" which consists of 3 functions (or none of them): next, error, and complete.
      What do you do when the observable emits? Do you answer the call, filter the call, get a new phone number?
      <br />
      <br />
      That's pretty much it. All of the functions in the RxJS library help you setup observables in particular ways more easily, and transform the data through a pipe, but only ever doing anything with an active subscription.
      <h4>Why?</h4>
      Why use an observable instead of a promise, or callback?
      <br />
      <br />
      Consider the phone example. It is simple to emit a "call" which is picked up by interested parties.
      The NSA can make a backup for you, while you are talking.
      If it was a promise, or callback you wouldn't be able to simply make another subscription,
      you would need to change the module to also callback the NSA. It is a distributed paradigm.
      <br />
      <br />
      Using the RxJS observable pattern, and keeping pipes clean (subscriptions should be the only place for side effects)
      your code can be more declarative, because nothing happens without a subscription, and data should be the defacto form of <a href='https://en.wikipedia.org/wiki/Coupling_(computer_programming)' target='_blank'>coupling</a>.
      <br />
      <br />
      "We are not aware of any languages that provide asynchronous communication with dynamic processes.
      Although such languages may exist, this combination appears to provide an embarrassment of riches not needed for expressive power."
      -<a href='https://dl.acm.org/doi/10.1145/512644.512658' target='_blank'>M.I.T. Lab, C.M.U. CS</a>
      <br />
      <br />
    </div>
  )
}

export const exerciseIntro = {
  Exercise,
  path,
  title
}
