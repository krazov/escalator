import { checkNames, spawn, printReducer, printFullReducer } from "./utils.js";

const { assign: extend } = Object;
const { abs, ceil, floor } = Math;

const EXCESS = Symbol('excess');

const Escalator = class Escalator {
    constructor(...sections) {
        if (!checkNames(sections)) {
            throw Error('Repeated or empty name!');
        }

        // otherwise,
        this.data = [
            spawn({
                name: EXCESS,
                value: 0,
                range: Infinity,
            }),
            ...sections.map(spawn),
        ].slice(sections[0].name == EXCESS ? 1 : 0);

        this.expandable = false;
        this.immutable = false; // TODO
        this.separator = ':';
    }

    clone() {
        return extend(new Escalator(...this.data), {
            expandable: this.expandable,
            immutable: this.immutable,
            separator: this.separator,
        });
    }

    // settings
    extend(props) {
        return extend(this.theRightObject, props);
    }

    setExpandable() {
        return this.extend({ expandable: true });
    }

    setCyclic() {
        return this.extend({ expandable: false });
    }

    setImmutable() {
        return this.extend({ immutable: true });
    }

    setMutable() {
        return this.extend({ immutable: false });
    }

    setSeparator(separator = ':') {
        return this.extend({ separator });
    }

    // operations
    increase(sectionName = this.lastSectionName, value = 1) {
        const object = this.theRightObject;

        const index = object.data.findIndex(({ name }) => name == sectionName);
        const element = object.data[index];

        element.value += value;

        if (element.value >= element.range) {
            let excess = floor(element.value / element.range);

            element.value = element.value % element.range;

            for (let i = index - 1; i > -1; i--) {
                const escalated = this.data[i];

                escalated.value += excess;

                if (escalated.value < escalated.range) {
                    break;
                }

                // otherwise,
                excess = floor(escalated.value / escalated.range);
                escalated.value = escalated.value % escalated.range;
            }
        }

        return object;
    }

    decrease(sectionName = this.lastSectionName, value = 1) {
        const object = this.theRightObject;

        const index = object.data.findIndex(({ name }) => name == sectionName);
        const element = object.data[index];

        element.value -= value;

        if (element.value < 0) {
            let excess = ceil(abs(element.value) / element.range);

            element.value = element.range - abs(element.value % element.range);

            for (let i = index - 1; i > -1; i--) {
                const escalated = this.data[i];

                escalated.value -= excess;

                if (escalated.value >= 0) {
                    break;
                }

                // otherwise,
                excess = ceil(abs(escalated.value) / escalated.range);
                escalated.value = escalated.range - abs(escalated.value %  escalated.range);
            }
        }

        return object;
    }

    // getters
    get theRightObject() {
        return this.immutable ? this.clone() : this;
    }

    get lastSectionName() {
        return this.data[this.data.length - 1].name;
    }

    getSection(sectionName) {
        return this.data.find(({ name }) => name == sectionName);
    }

    getValue(sectionName) {
        return this.getSection(sectionName).value;
    }

    getRange(sectionName) {
        return this.getSection(sectionName).range;
    }

    getExcess() {
        return this.getSection(EXCESS).value;
    }

    // others
    print() {
        return this.data
            .slice(this.expandable && this.data[0].value ? 0 : 1)
            .reduce(printReducer(this.separator), '');
    }

    printFull() {
        return this.data
            .slice(this.expandable && this.data[0].value ? 0 : 1)
            .reduce(printFullReducer, '');
    }
};

export default (...sections) => new Escalator(...sections);
