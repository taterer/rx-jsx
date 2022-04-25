import { v4 as uuid } from 'uuid'
import { from } from 'rxjs'
import { indexedDBfactory } from '../utils/indexedDB'
import { combineLatestWith, concatMap, map } from 'rxjs/operators'

export type Persistable = {
  id: string
  created_at: Date
}

export type Persistence = {
  indexedDB?: any
  put: (tableName: string, key: string | object, value: any) => Promise<object>
  get: (tableName: string, key: string | object) => Promise<object>
  query: (tableName: string, key?: string | object) => Promise<object[]>
  remove: (tableName: string, key: string | object) => Promise<object>
}

export enum Tables {
  strokes = 'strokes'
}

export type Stroke = Persistable & {
  stroke: boolean
}

export async function indexedDbPersistence () {
  const databaseName = 'db-jsx-rxjs'

  try {
    // Increment the version number anytime the database schema changes
    const indexedDB = await indexedDBfactory(databaseName, 1, [
      {
        name: Tables.strokes,
        options: {
          keyPath: 'id'
        }
      }
    ])

    return indexedDB
  } catch (err) {
    console.log('oooops', err)
    // return localstorage version
  }
}

export const indexedDB$ = from(indexedDbPersistence())

export const _withIndexedDB_ = combineLatestWith<Persistable, [Persistence]>(indexedDB$)

export const _mapToPersistable_ = map<any, Persistable>(value => {
  if (!value.id) {
    value.id = uuid()
  }
  if (!value.created_at) {
    value.created_at = Date.now()
  }
  return value
})

export function _concatMapPersist_ (tableName: string) {
  return concatMap<[Persistable, Persistence], any>(([value, persistence]) => persistence.put(tableName, { id: value.id }, value))
}
