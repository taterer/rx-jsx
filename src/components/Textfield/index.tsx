import './index.scss'
import { animationFrameScheduler, Subject } from "rxjs";
import { css, cx } from '@emotion/css';
import { MDCTextField } from '@material/textfield';
import { toElement$ } from "../../jsx";

export default function ({ input$, title, id }: { input$: Subject<Element>, title: string, id?: string }) {
  const [textfield$] = toElement$(input$)
  textfield$.subscribe({
    next: textfield => {
      animationFrameScheduler.schedule(() => {
        new MDCTextField(textfield)
      })
    }
  })

  return (
    <label element$={textfield$} class={cx("mdc-text-field mdc-text-field--filled", css`
      margin: 10px;
    `)}>
      <span class="mdc-text-field__ripple"></span>
      <input element$={input$} type="text" class="mdc-text-field__input" aria-labelledby={`${id || title}-label`} name={title} />
      <span class="mdc-floating-label" id={`${id || title}-label`}>{title}</span>
      <span class="mdc-line-ripple"></span>
    </label>
  )
}
