import { faker } from '@faker-js/faker';

function buildUser(overrides) {
   return {
      ID: faker.datatype.uuid(),
      Name: faker.internet.userName("John", "Doe"),
      password: faker.internet.password(),
      Email: faker.internet.email("John", "Doe"),
      ...overrides,
   }
}

function buildUserList(overrides) {
   return {
      id: faker.datatype.uuid(),
      name: faker.name.fullName(),
      email: faker.internet.email(),
      gender: faker.name.sex(),
      role: faker.helpers.arrayElement(['admin', 'normal']),
      ...overrides,
   }
}

function buildSuppliesList(overrides) {
   return {
      id: faker.datatype.number({ max: 10 }),
      product: faker.commerce.product(),
      quantity: faker.datatype.number({ max: 100 }) + ' ' + faker.helpers.arrayElement(['KG', 'Gram', 'Bag', 'Pic', 'Pack']),
      ...overrides,
   }
}

function buildRequestsList(overriders) {
   return {
      id: faker.datatype.number(),
      email: faker.internet.email(),
      employeeName: faker.name.fullName(),
      requestedDate: faker.date.birthdate({ min: 2022, max: 2022, mode: 'year' }),
      dueDate: faker.date.birthdate({ min: 2022, max: 2022, mode: 'year' }),
      lastStatusUpdate: faker.date.birthdate({ min: 2022, max: 2022, mode: 'year' }),
      status: faker.helpers.arrayElement(['approved', 'rejected', 'pending']),
      requestList: createUsers(faker.datatype.number({ min: 1, max: 5 }))
   }
}

function buildReqSupplyData(overriders) {
   return {
      "id": faker.datatype.number({ max: 10 }),
      "quantity": faker.datatype.number({ max: 100 })
   }
}

function createUsers(numUsers = 5) {
   return new Array(numUsers).fill(undefined).map(buildReqSupplyData);
}

// function buildListItem(overrides = {}) {
//    const {
//       bookId = overrides.book ? overrides.book.id : faker.datatype.uuid(),
//       startDate = faker.date.past(2).getTime(),
//       finishDate = faker.date.between(new Date(startDate), new Date()).getTime(),
//       owner = { ownerId: faker.datatype.uuid() },
//    } = overrides
//    return {
//       id: faker.datatype.uuid(),
//       bookId,
//       ownerId: owner.id,
//       rating: faker.datatype.number(5),
//       notes: faker.datatype.boolean() ? '' : faker.lorem.paragraph(),
//       finishDate,
//       startDate,
//       book: buildUserList({ id: bookId }),
//       ...overrides,
//    }
// }

export { buildUser, buildUserList, buildSuppliesList, buildRequestsList }
