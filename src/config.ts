import { BaseValidator } from '@sapphire/shapeshift';

export function loadConfig<T extends Record<string, Item>>(
  obj: T,
): {
  [P in keyof T]: TypeResolver<T[P]['type']>;
} {
  const returnObj: Record<string, Item['default']> = {};

  Object.entries(obj).forEach(([key, item]) => {
    let value;

    if (process.env[key]) {
      switch (item.type) {
        case String:
          value = process.env[key];
          break;
        case Number:
          value = Number(process.env[key]);
          break;
        default:
          throw new Error('Unknown Type');
      }
    } else if (item.default) {
      value = item.default;
    } else {
      throw new Error('No variable');
    }

    item.validate?.parse(value);

    Object.defineProperty(returnObj, key, {
      value,
      configurable: item.mod === 'WRITE',
      writable: item.mod === 'WRITE',
      enumerable: item.mod !== 'LOCK',
    });
  });

  return returnObj as any;
}

interface Item {
  type: StringConstructor | NumberConstructor;
  mod: 'READ' | 'WRITE' | 'LOCK';
  default?: VariableType;
  validate?: BaseValidator<any>;
}

type VariableType = string | number | undefined;

type TypeResolver<T> = T extends StringConstructor ? string : T extends NumberConstructor ? number : never;
