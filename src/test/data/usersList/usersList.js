import usersListData from './user-list-data.json';
import { matchSorter } from 'match-sorter';

let usersList = [...usersListData]

async function create(user) {
   usersList.push(user)
   return user
}

async function read(userId) {
   return usersList.find(user => user.id === userId)
}

async function readManyNotInList(ids) {
   return usersList.filter(user => !ids.includes(user.id))
}

async function query(search) {
   return matchSorter(usersList, search, {
      keys: [
         'title',
         'author',
         'publisher',
         { threshold: matchSorter.rankings.CONTAINS, key: 'synopsis' },
      ],
   })
}

async function reset() {
   usersList = [...usersListData]
}

export { create, query, read, readManyNotInList, reset }
