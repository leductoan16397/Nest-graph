import { faker } from '@faker-js/faker';
import { appendFileSync } from 'fs';
import { json2csvAsync } from 'json-2-csv';

const start = async () => {
  console.time('test');
  const user = [];
  for (let index = 0; index < 10000; index++) {
    const element = {
      title: faker.lorem.lines(1),
      content: faker.lorem.paragraphs(
        faker.datatype.number({ min: 5, max: 10 }),
      ),
      description: faker.lorem.paragraph(1),
    };

    user.push(element);
    console.log(element);
  }
  const userJson = await json2csvAsync(user, {
    delimiter: {
      field: '|',
    },
  });
  appendFileSync('blog.csv', userJson);
  console.timeEnd('test');
};

start();
