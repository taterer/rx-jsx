import './index.scss'

export default function Button ({ button$, title }) {
  return (
    <div class="mdc-touch-target-wrapper">
      <button element$={button$} class="mdc-button mdc-button--touch mdc-button--raised">
        <span class="mdc-button__ripple"></span>
        <span class="mdc-button__touch"></span>
        <span class="mdc-button__label">{title}</span>
      </button>
    </div>
  )
}
