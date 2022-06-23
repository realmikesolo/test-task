import { s } from '@sapphire/shapeshift';
import { AsyncQueue } from './async-queue';
import { loadConfig } from './config';
import { IncrementalMap } from './incremental-map';

const queue = new AsyncQueue();

const task = async <T>(value: T): Promise<void> => {
  await new Promise((r) => setTimeout(r, 100 * Math.random()));
  console.log(value);
};

(async () => {
  console.log('Config');
  process.env['RABBITMQ_USER'] = 'solo';
  process.env['RABBITMQ_PASSWORD'] = '123';
  const config = loadConfig({
    RABBITMQ_HOST: {
      type: String,
      mod: 'READ', // моды доступа
      default: 'localhost', // дефолтные значения
      validate: s.string, // использовать любимый валидатор
    },
    RABBITMQ_PORT: {
      type: Number,
      mod: 'READ',
      default: 80,
    },
    RABBITMQ_USER: {
      type: String,
      mod: 'WRITE',
    },
    RABBITMQ_PASSWORD: {
      type: String,
      mod: 'LOCK',
    },
  });

  console.log(config);

  console.log('IncrementalMap');

  const map = new IncrementalMap<string, number>();

  map.snapshot(0);

  map.set('key', 10);
  console.log(map.get('key'));

  map.snapshot(1);

  map.set('key', 20);
  console.log(map.get('key'));

  map.snapshot(0);
  console.log(map.get('key'));

  console.log('AsyncQueue');

  await Promise.all([
    queue.add(() => task(1)),
    queue.add(() => task(2)),
    queue.add(() => task(3)),
    queue.add(() => task(4)),
  ]);
})();
