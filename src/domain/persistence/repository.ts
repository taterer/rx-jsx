import { v4 as uuid } from 'uuid'
import { from, Observable, Subscription } from 'rxjs'
import { indexedDBfactory } from './indexedDB'
import { concatMap, map, shareReplay, takeUntil, withLatestFrom } from 'rxjs/operators'

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
  strokes = 'strokes',
  code = 'code'
}

export type Stroke = Persistable & {
  stroke: boolean
}

async function indexedDbPersistence () {
  const databaseName = 'db-tater-calc'

  try {
    // Increment the version number anytime the database schema changes
    const indexedDB = await indexedDBfactory(databaseName, 2, [
      {
        name: Tables.strokes,
        options: {
          keyPath: 'id'
        }
      },
      {
        name: Tables.code,
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

export const indexedDB$ = from(indexedDbPersistence()).pipe(shareReplay(1))

export function withIndexedDB_<T> () {
  return withLatestFrom<T, [Persistence]>(indexedDB$)
}

export function mapToPersistable_<T> () {
  return map<any, T & Persistable>(value => {
    if (!value.id) {
      value.id = uuid()
    }
    if (!value.created_at) {
      value.created_at = Date.now()
    }
    return value
  })
}

export function concatMapPersist_ (tableName: string) {
  return concatMap<[Persistable, Persistence], any>(([value, persistence]) => persistence.put(tableName, { id: value.id }, value))
}

export function subscribeAndPersist<T> (
  destruction$: Observable<any>,
  observable$: Observable<T>,
  tableName: Tables,
  mapFunction: (value: T) => T & Persistable
  ): Subscription {

  return observable$
  .pipe(
    map(mapFunction),
    withIndexedDB_(),
    concatMapPersist_(tableName),
    takeUntil(destruction$)
  )
  .subscribe()
}

export function concatMapRemove_ (tableName: string) {
  return concatMap<[Persistable, Persistence], any>(([value, persistence]) => persistence.remove(tableName, value))
}

export function subscribeAndRemove<T> (
  destruction$: Observable<any>,
  observable$: Observable<T>,
  tableName: Tables,
  mapFunction: (value: T) => Persistable | { id: string } | string
  ): Subscription {

  return observable$
  .pipe(
    map<any, any>(mapFunction),
    withIndexedDB_(),
    concatMapRemove_(tableName),
    takeUntil(destruction$)
  )
  .subscribe()
}
