import { Route } from "../../domain/route"

const title = '123'
const path = `/${Route.training}/123`

export default function Exercise ({ destruction$ }) {
  return (
    <div>
      <h3>Exercise {title}</h3>
      <div>
        Stuff
      </div>
    </div>
  )
}

export const exercise123 = {
  Exercise,
  path,
  title
}
