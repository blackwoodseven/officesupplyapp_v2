import suppliesListData from './supplies-list-data.json';
import { matchSorter } from 'match-sorter';

let suppliesList = [...suppliesListData]

async function create(user) {
   suppliesList.push(user)
   return user
}

async function read(userId) {
   return suppliesList.find(user => user.id === userId)
}

async function readManyNotInList(ids) {
   return suppliesList.filter(user => !ids.includes(user.id))
}

async function query(search) {
   return matchSorter(suppliesList, search, {
      keys: [
         'title',
         'author',
         'publisher',
         { threshold: matchSorter.rankings.CONTAINS, key: 'synopsis' },
      ],
   })
}

async function reset() {
   suppliesList = [...suppliesListData]
}

export { create, query, read, readManyNotInList, reset }
