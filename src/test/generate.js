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
      id: faker.datatype.number(),
      product: faker.commerce.product(),
      quantity: faker.datatype.number({ max: 100 }) + ' ' + faker.helpers.arrayElement(['KG', 'Gram', 'Bag', 'Pic', 'Pack']),
      ...overrides,
   }
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

export { buildUser, buildUserList, buildSuppliesList }
