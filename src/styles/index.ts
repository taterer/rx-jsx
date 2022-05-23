import { css, cx } from "@emotion/css"

export const panel = cx('card-panel', css`
  width: 100%;
  max-width: 800px;
  
  @media (max-width: 600px) {
    padding: 10px 0px;
  }
`)
