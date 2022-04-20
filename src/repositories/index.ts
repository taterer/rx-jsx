import { indexedDBfactory } from '../utils/indexedDB'

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

export const indexedDB = indexedDbPersistence()

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

export type Stroke = Persistable & {
  stroke: boolean
}
