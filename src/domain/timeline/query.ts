import { map, merge } from 'rxjs'
import { nextTimelineEvent$, achieveTimeline$ } from './command'

export const timelineEvents$ = merge(nextTimelineEvent$, achieveTimeline$.pipe(map(() => ({ icon: 'star', color: 'gold' }))))
