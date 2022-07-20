import { takeUntil } from "rxjs"
import { toElement$ } from "../../jsx"

const animationTiming = {
  duration: 5000,
  iterations: Infinity
}

export default function ({ destruction$, color, icon, particles }) {
  const [explosion$] = toElement$(destruction$)

  explosion$
  .pipe(
    takeUntil(destruction$)
  )
  .subscribe(explosionElement => {
    const particleDeg = 360 / particles
    new Array(particles).fill(0).forEach((i, index) => {
      const element: Element = <i style={`position: absolute; margin-top: -24px; color: ${color};`} class="material-icons dp48">{icon}</i>
      explosionElement.appendChild(element)
      element.animate(
        [
          { transform: `rotate(${index * particleDeg}deg) translate(0px)` },
          { transform: `rotate(${index * particleDeg + 90}deg) translate(0, -50px)` },
          { transform: `rotate(${index * particleDeg + 180}deg) translate(0, -50px)` },
          { transform: `rotate(360deg) translate(0px)` },
          { transform: `rotate(360deg) translate(0px)scale(2)` },
          { transform: `rotate(360deg) translate(0px)scale(1)` },
          { transform: `rotate(360deg) translate(0px)scale(2)` },
          { transform: `rotate(360deg) translate(0px)scale(1)` },
        ],
        animationTiming
      )
    })
  })

  return <div element$={explosion$} style='position: relative;' />
}
