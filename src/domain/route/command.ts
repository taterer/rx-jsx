import { commandFactory } from "../../utils/commandFactory"

export interface PushHistory {
  url: string
}

export const [pushHistory$, pushHistory] = commandFactory<PushHistory>()

export interface ReplaceHistory {
  url: string
}

export const [replaceHistory$, replaceHistory] = commandFactory<ReplaceHistory>()
