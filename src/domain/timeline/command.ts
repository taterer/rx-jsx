import { commandFactory } from "../../utils/commandFactory"

export enum TimelineEvent {
  add = 'add',
  achieve = 'achieve'
}

export enum Icon {
  airline_seat_recline_extra = 'airline_seat_recline_extra',
  add_circle = 'add_circle',
  ac_unit = 'ac_unit',
  android = 'android',
  audiotrack = 'audiotrack',
  directions_run = 'directions_run',
  done = 'done',
  face = 'face',
  flare = 'flare',
  hotel = 'hotel',
  image = 'image',
  message = 'message',
  mouse = 'mouse',
  movie = 'movie',
  navigation = 'navigation',
  palette = 'palette',
  pets = 'pets',
  photo = 'photo',
  photo_camera = 'photo_camera',
  power_settings_new = 'power_settings_new',
  priority_high = 'priority_high',
  rowing = 'rowing',
  save = 'save',
  sentiment_very_dissatisfied = 'sentiment_very_dissatisfied',
  sentiment_dissatisfied = 'sentiment_dissatisfied',
  sentiment_neutral = 'sentiment_neutral',
  sentiment_satisfied = 'sentiment_satisfied',
  sentiment_very_satisfied = 'sentiment_very_satisfied',
  settings = 'settings',
  spa = 'spa',
  terrain = 'terrain',
  thumb_up = 'thumb_up',
  thumb_down = 'thumb_down',
  timer_10 = 'timer_10',
  timer_3 = 'timer_3',
  toys = 'toys',
  train = 'train',
  warning = 'warning',
  work = 'work',
}

export interface nextTimelineEvent {
  icon: Icon | 'star',
  color?: string,
  message?: string
}

export const [nextTimelineEvent$, nextTimelineEvent] = commandFactory<nextTimelineEvent>()

export const [achieveTimeline$, achieveTimeline] = commandFactory<undefined>()
