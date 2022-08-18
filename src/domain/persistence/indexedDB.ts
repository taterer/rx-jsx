import { Persistence } from "./repository"

/**
 * @param {string} databaseName
 * @param {number} version
 * @param {[{ name: string, options: {}, indices: [{ name: string, keyPath: string, options: {} }] }]} schema
 * @returns {{ indexedDB
 *  get: (tableName: string, key: { id: string }) => {}
 *  put: (tableName: string, key: { id: string }, value: {}) => {}
 * }} A document database
 */
export function indexedDBfactory (databaseName: string, version: number, schema): Promise<Persistence> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('This browser doesn\'t support IndexedDB'))
    }
    const DBOpenRequest = window.indexedDB.open(databaseName, version)
    DBOpenRequest.onsuccess = (e) => {
      const indexedDB = DBOpenRequest.result
      resolve({
        remove: (tableName, key) => remove(indexedDB, tableName, key),
        indexedDB,
        get: (tableName, key) => get(indexedDB, tableName, key),
        query: (tableName, key) => query(indexedDB, tableName, key),
        put: (tableName, key, value) => put(indexedDB, tableName, key, value)
      })
    }
    DBOpenRequest.onerror = (e) => {
      reject(e)
    }
    DBOpenRequest.onupgradeneeded = (event) => {
      const db = (event.target as any).result
      db.onerror = (event) => {
        reject(new Error(event))
      }
      schema.forEach(schema => {
        if (!db.objectStoreNames.contains(schema.name)) {
          const objectStore = db.createObjectStore(schema.name, schema.options)
          if (Array.isArray(schema.indices)) {
            schema.indices.forEach(index => {
              objectStore.createIndex(index.name, index.keyPath, index.options)
            })
          }
        }
      })
    }
  })
}

function indexedDBObjectStore (indexedDB, tableName) {
  const transaction = indexedDB.transaction([tableName], 'readwrite')
  transaction.onerror = (event) => {
    throw new Error(`Indexed db transaction error. Tablename: ${tableName}.`)
  }
  return transaction.objectStore(tableName)
}

async function get (db, tableName, key): Promise<object> {
  return new Promise((resolve, reject) => {
    const objectStore = indexedDBObjectStore(db, tableName)
    const index = getIndex(key)
    let request
    if (index) {
      request = objectStore.index(index).get(IDBKeyRange.only(key[index]))
    } else {
      request = objectStore.get(key)
    }
    request.onerror = event => {
      reject(new Error(`Indexed db objectStore get error. Tablename: ${tableName}. Key: ${JSON.stringify(key)}. Event: ${JSON.stringify(event)}`))
    }
    request.onsuccess = () => {
      resolve(request.result)
    }
  })
}

async function query (db, tableName, key?: string | object): Promise<object[]> {
  return new Promise((resolve, reject) => {
    const objectStore = indexedDBObjectStore(db, tableName)
    const index = getIndex(key)
    let request
    if (key && index) {
      request = objectStore.index(index).openCursor(IDBKeyRange.only(key[index]))
    } else {
      request = objectStore.openCursor(key)
    }
    request.onerror = event => {
      reject(new Error(`Indexed db objectStore getAll error. Tablename: ${tableName}. Event: ${JSON.stringify(event)}`))
    }
    const res: any[] = []
    request.onsuccess = event => {
      const cursor = event.target.result
      if (cursor) {
        res.push(cursor.value)
        cursor.continue()
      } else {
        resolve(res)
      }
    }
  })
}

async function put (db, tableName, key, value): Promise<object> {
  return new Promise((resolve, reject) => {
    const objectStore = indexedDBObjectStore(db, tableName)
    const objectStoreRequest = objectStore.put(value)
    objectStoreRequest.onerror = event => {
      reject(new Error(`Indexed db objectStore put error. Tablename: ${tableName}. Key: ${JSON.stringify(key)}. Event: ${JSON.stringify(event)}`))
    }
    objectStoreRequest.onsuccess = () => {
      resolve(objectStoreRequest.result)
    }
  })
}

async function remove (db, tableName, key): Promise<object> {
  return new Promise((resolve, reject) => {
    const objectStore = indexedDBObjectStore(db, tableName)
    const index = getIndex(key)
    let request
    if (index) {
      request = objectStore.index(index).delete(IDBKeyRange.only(key[index]))
    } else {
      request = objectStore.delete(key)
    }
    request.onerror = event => {
      reject(new Error(`Indexed db objectStore remove error. Tablename: ${tableName}. Key: ${JSON.stringify(key)}. Event: ${JSON.stringify(event)}`))
    }
    request.onsuccess = () => {
      resolve(request.result)
    }
  })
}

function getIndex (obj) {
  if (!obj || typeof obj !== 'object') {
    return
  }
  const keys = Object.keys(obj)
  if (keys.length > 1) {
    console.log(`ERROR: indexedDB expected only 1 key on the object. Found (${keys.length}): ${JSON.stringify(obj)}`)
  }
  return keys[0]
}
