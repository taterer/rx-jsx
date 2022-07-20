import { map, merge } from 'rxjs'
import { addTimelineEvent$, achieveTimeline$ } from './command'

export const timelineEvents$ = merge(addTimelineEvent$, achieveTimeline$.pipe(map(() => ({ icon: 'star', color: 'gold' }))))
