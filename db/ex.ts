import { faker } from '@faker-js/faker';
import { appendFileSync } from 'fs';
import { json2csvAsync } from 'json-2-csv';

const start = async () => {
  console.time('test');
  const user = [];
  for (let index = 0; index < 1000000000; index++) {
    const sex = faker.name.sexType();

    const element = {
      sex,
      firstName: faker.name.firstName(sex),
      lastName: faker.name.lastName(sex),
      age: faker.datatype.number({ max: 99, min: 1 }),
      address: `${faker.address.streetAddress()} - ${faker.address.city()} - ${faker.address.country()}`,
    };

    user.push(element);
    console.log(index);
  }
  const userJson = await json2csvAsync(user);
  appendFileSync('user.csv', userJson);
  console.timeEnd('test');
};

start();
