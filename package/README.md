# Rx-JSX

A familiar way to develop a front end using JSX, but without React. Prop drilling and lifecycle events are all replaced with simply RxJS.

## Why use RxJSX?

You prefer functional (reactive) programming, you'd rather not learn more abstractions on top of html to change styles, classes, or add event listeners. Minimalist code, with no magic: it does exactly what you expect it to do.

## Getting Started

### Install

`yarn add @taterer/rx-jsx rxjs`

or

`npm i --save @taterer/rx-jsx rxjs`

### Setup

.babelrc

```
{
  "plugins": [
    ["@babel/transform-react-jsx", { "pragma": "jsx" }]
  ]
}
```

### Import

```
import '@taterer/rx-jsx' // this must be imported before any JSX is rendered
import App from './App'

document.getElementById('root')?.appendChild(<App />);
```

### Define

This is enough to render JSX at any depth. App is expected to be a function that returns JSX. EG:

```
const App = () => <div />
```

The element can be defined with styles, class, events, or with children. EG:

```
const App = () => <div>
  <Route />
  <div class='panel' style="width: 100%;" onclick={() => console.log('clicked')} />
</div>
```

## How to use

A full example codebase with exercises for training can be found at: https://github.com/taterer/rx-jsx

### single$

Define single$ on an html element. When the JSX element is created it will automatically subscribe to the observable passed to single$. The observable should emit HTML elements. EG:

```
import { css } from '@emotion/css'
import { of } from 'rxjs'

export default function App () {
  const mainElement$ = of(
    <div class={css`
      display: flex;
      height: 100%;
      width: 100%;
    `}>
      Basic
    </div>
  )
  return (
    <div single$={mainElement$} />
  )
}
```

Using single$ will replace the HTML element with the latest emission. When single$ or multi$ has a pipe using takeUntil, it will remove the root element upon completion.

### multi$

The multi$ property does the exact same thing as single$, except that it is append only. The previous element will not be removed with a new emission of the observable.

### Best practices

- Name observables/subjects using the $ suffix.
- Always use a destruction$ observable in a takeUntil as the last operator in pipes before passing them to single$, multi$, or creating any subscriptions.
- If things are not rendering properly, try withAnimationFrame. `import { withAnimationFrame } from @taterer/rx-jsx`
- It can be useful to throw in a share() when setting up an observable for single$/multi$ so that other subscriptions end up with the same JSX element.
- Use RxJS Debugger for tracking emissions https://www.npmjs.com/package/@taterer/rxjs-debugger
