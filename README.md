# Escalator

Version 1.0.0

## Description

Inspired by piece of code written by my co-worker [Miguel](https://github.com/RMiguelRivero), I decided to write a small tool that creates an escalator container. Container keeps a list of sections, each with own range which, when exceeded, escalates to the next section. In the end everything lands in a special EXCEED section, which aggregates everything that exceeded the highest section set by user.

## Public methods

Methods described below are meant to be public and can be safely used.

All the methods below are fully chainable. Getters return values.

### Creating object

```javascript
escalator(...sections);
```

Sections will be stored in order they were passed to the function: first section is the highest, second is the next, etc., and the last one is the lowest. Later this will be used to escalate values up.

#### `sections` item

An object describing a single section of the escalator container.

Fields:

* `name` (required) — name of the section. Theoretically should be a string but there is no check for that so feel free. Cannot be empty, though.
* `value` (default: `0`) — value of the section. Should be a number type, otherwise might not work.
* `range` (default: `10`) —  range of the section. After it’s exceeded, it escalates to the higher section.

### Config: `immutable`

Defaul value: `false`

By default escalator container is a mutable object so all the operations will mutate the same object. When set to `true` though, it will spawn a new instance with each `increase` and `decrease` operation, as well as config methods.

#### Method `setImmutable`

Sets property to `true`. Note: it will freeze (very much like `Object.freeze()`) current object. The operation is irreversible (unless you change it yourself on the object but we’re all grown-ups and this is JavaScript, where you can do anything, so feel free).

#### Method `setMutable`

Creates a clone of current object with `immutable` property set to `false`.

### Config: `expendable`

Default value: `false`

When set to `true`, will display special EXCEED section in `print()` and `printFull()` methods. By default EXCEED section is treated as a storage for unwanted values that escalated beyond its purpose, allowing values inside the object to work in cycles. But the information is never lost.

#### Method `setExpendable()`

Sets property to `true`.

**Note:** When object is immutable, it will clone current object with property new value.

#### Method `setCyclic()`

Sets property to `false`.

**Note:** When object is immutable, it will clone current object with property new value.

### Config: `separator`

Default value: `':'`

Separator that is used by `print()` method. Setting this property to empty string and keeping range of 10, container would work as a big integer. 

#### Method `setSeparator(value)`

Sets property to passed value. If `value` is omitted it reverts to `';'`.

**Note:** There is no validation if value is actually a string, so beware of passing `null` or `{ some: 'object' }`.

### Method `clone()`

Returns identical object.

### Method `increase(sectionName, value)`

Sets a new value for given section and escalate up the sections in case of exceeding range(s). If `sectionName` is omitted, it will use the lowest section name. If `value` is omitted, it will revert to `1`.

**Note:** When object is immutable, it will clone current object with property new value.

### Method `decrease(sectionName, value)`

Sets a new value for given section and escalate up the sections in case of exceeding range(s). If `sectionName` is omitted, it will use the lowest section name. If `value` is omitted, it will revert to `1`.

**Note:** When object is immutable, it will clone current object with property new value.

### Getter `getValue(sectionName)`

Will return a `value` of given section. When `sectionName` omitted... just don’t omit it.

### Getter `getRange(sectionName)`

Will return a `range` of given section. When `sectionName` omitted... just don’t omit it.

### Getter `getExcess()`

Will return `value` of EXCEED section. There is no method returning range of this section because it is always `Infinity`.

### Getter `print()`

Returns string representation of all the values join with defined separator.

### Getter `printFull()`

Returns string representation of all the objects with name, value, and range detailed. Possibly useful for debug purposes. 

## Private methods

Methods that will (or will not) be described in this section are meant to be private and while using them is not prohibited in any capacity, they might be changed or removed without any warning. 

## Examples

```javascript
// somewhere on top
import escalator from './some-path-to/escalator.js';
```

### Creating an object

```javascript
const counter = escalator({ name: 'counter' });
console.log(counter.print()); // "0"

const otherCounter = escalator({ name: 'counter', value: 63 });
console.log(otherCounter.print()); // "63"
```

### Increasing and decreasing values

```javascript
const clock = escalator(
    { name: 'hours', value: 3, range: 24 },
    { name: 'minutes', value: 7, range: 60 },
);
console.log(counter.print()); // "3:07"

clock.increase('minutes', 2);
console.log(clock.print()); // "3:09"

clock.increase('minutes', 52);
console.log(clock.print()); // "4:01"

clock.increase('minutes', 120);
console.log(clock.print()); // "6:01"

clock.decrease('minutes', 120);
console.log(clock.print()); // "4:01"

clock.decrease('minutes', 52);
console.log(clock.print()); // "3:09"

clock.decrease('minutes', 2);
console.log(clock.print()); // "3:07"
```

### Immutability

```javascript
const objectOne = escalator({ name: 'generic name', value: 5 }).setImmutable();

console.log(objectOne.increase('generic name').print()); // "6"
console.log(objectOne.print()); // "5"
```

Of course in the first case we loose reference to the object after it was console.logged but perhaps that is something that somebody might want to do sometime. This is the world of JavaScript, after all.

## TODO

* TypeScript definitions. While I am not a fan of TypeScript, it can help some IDEs to display better hints. Might be worth it.  

Also, according to TDD file, the following,

```javascript
// it('should allow to add sections')
// it('should allow to remove sections')
// it('should allow to get an array with names')
// it('should allow to get an array with values')
// it('should allow to get an array with ranges')
// it('should allow to merge (add) two matching escalators')
// it('should not allow to go to minus values')
```
