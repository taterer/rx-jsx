import { Observable } from "rxjs";

export function monitor (observables: Observable<any>[]) {
  console.log('WARNING: Monitor should not be left in the program')
  observables.forEach((obs, index) => {
    obs.subscribe(i => console.log(index, i, ' --- ', i.map && i.map(j => j.mesh.uniqueId).join(', ')))
  })
}
