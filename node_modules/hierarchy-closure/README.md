[![NPM Version](https://badge.fury.io/js/hierarchy-closure.png)](https://npmjs.org/package/hierarchy-closure)
[![Build Status](https://travis-ci.org/ericprud/hierarchy-closure.svg?branch=master)](https://travis-ci.org/ericprud/hierarchy-closure)
[![Coverage Status](https://coveralls.io/repos/github/ericprud/hierarchy-closure/badge.svg?branch=master)](https://coveralls.io/github/ericprud/hierarchy-closure?branch=master)

# hierarchy-closure
Maintain simple hierarchy by adding members in any order.


## install

```
npm install --save hierarchy-closure
```

## use

``` javascript
// create hierarchy
t = Hierarchy.create()
// add single entry B->C
t.add('B', 'C')
// add single entry B->C
t.add('B', 'C')
// add child C->D
t.add('C', 'D')
// add disconnected entry F->G
t.add('F', 'G')
// add parent E->F
t.add('E', 'F')
// add middle D->E
t.add('D', 'E')
// add top A->B
t.add('A', 'B')
// add bottom G->H
t.add('G', 'H')
// add redundant entry (no effect)
t.add('A', 'B')
```

## results

``` javascript
{ add: t.add,
  roots: {A: {B: {C: {D: {E: {F: {G: {H: {}}}}}}}}},
  parents: {
    A: [],
    B: ['A'],
    C: ['B', 'A'],
    D: ['C', 'B', 'A'],
    E: ['D', 'C', 'B', 'A'],
    F: ['E', 'D', 'C', 'B', 'A'],
    G: ['F', 'E', 'D', 'C', 'B', 'A'],
    H: ['G', 'F', 'E', 'D', 'C', 'B', 'A']
  },
  children: {
    A: ['B', 'C', 'D', 'E', 'F', 'G', 'H'],
    B: ['C', 'D', 'E', 'F', 'G', 'H'],
    C: ['D', 'E', 'F', 'G', 'H'],
    D: ['E', 'F', 'G', 'H'],
    E: ['F', 'G', 'H'],
    F: ['G', 'H'],
    G: ['H'],
    H: []
  }
}
```
