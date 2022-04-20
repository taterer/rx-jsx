import { v4 as uuid } from 'uuid'
import { from } from 'rxjs'
import { combineLatestWith, concatMap, map } from 'rxjs/operators'
import { indexedDB, Persistable, Persistence, Tables } from '../repositories'


export const _mapToPersistable_ = map<any, Persistable>(value => {
  if (!value.id) {
    value.id = uuid()
  }
  if (!value.created_at) {
    value.created_at = Date.now()
  }
  return value
})

function _concatMapPersist_ (tableName: string) {
  return concatMap<[Persistable, Persistence], any>(([value, persistence]) => persistence.put(tableName, { id: value.id }, value))
}

export const indexedDB$ = from(indexedDB)

export const _withIndexedDB_ = combineLatestWith<Persistable, [Persistence]>(indexedDB$)

export const _persist_ = {
  [Tables.strokes]: _concatMapPersist_(Tables.strokes)
}
