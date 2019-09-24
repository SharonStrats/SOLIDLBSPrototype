const Hierarchy = require('../hierarchy-closure')

describe('hierarchy-closure', function () {
  let t// = Hierarchy.create()
  it('create hierarchy', function () {
    t = Hierarchy.create()
    expect(t).toEqual(
      { add: t.add,
        roots: {},
        parents: {},
        children: {}})
  })
  it('add single entry B->C', function () {
    t.add('B', 'C')
    expect(t).toEqual(
      { add: t.add,
        roots: {B: {C: {}}},
        parents: {B: [], C: ['B']},
        children: {B: ['C'], C: []}})
  })
  it('add child C->D', function () {
    t.add('C', 'D')
    expect(t).toEqual(
      { add: t.add,
        roots: {B: {C: {D: {}}}},
        parents: {B: [], C: ['B'], D: ['C', 'B']},
        children: {B: ['C', 'D'], C: ['D'], D: []}})
  })
  it('add disconnected entry F->G', function () {
    t.add('F', 'G')
    expect(t).toEqual(
      { add: t.add,
        roots: {B: {C: {D: {}}}, F: {G: {}}},
        parents: {B: [], C: ['B'], D: ['C', 'B'], F: [], G: ['F']},
        children: {B: ['C', 'D'], C: ['D'], D: [], F: ['G'], G: []}})
  })
  it('add parent E->F', function () {
    t.add('E', 'F')
    expect(t).toEqual(
      { add: t.add,
        roots: {B: {C: {D: {}}}, E: {F: {G: {}}}},
        parents: {B: [], C: ['B'], D: ['C', 'B'], E: [], F: ['E'], G: ['F', 'E']},
        children: {B: ['C', 'D'], C: ['D'], D: [], E: ['F', 'G'], F: ['G'], G: []}})
  })
  it('add middle D->E', function () {
    t.add('D', 'E')
    expect(t).toEqual(
      { add: t.add,
        roots: {B: {C: {D: {E: {F: {G: {}}}}}}},
        parents: {B: [], C: ['B'], D: ['C', 'B'], E: ['D', 'C', 'B'], F: ['E', 'D', 'C', 'B'], G: ['F', 'E', 'D', 'C', 'B']},
        children: {B: ['C', 'D', 'E', 'F', 'G'], C: ['D', 'E', 'F', 'G'], D: ['E', 'F', 'G'], E: ['F', 'G'], F: ['G'], G: []}})
  })
  it('add top A->B', function () {
    t.add('A', 'B')
    expect(t).toEqual(
      { add: t.add,
        roots: {A: {B: {C: {D: {E: {F: {G: {}}}}}}}},
        parents: {A: [], B: ['A'], C: ['B', 'A'], D: ['C', 'B', 'A'], E: ['D', 'C', 'B', 'A'], F: ['E', 'D', 'C', 'B', 'A'], G: ['F', 'E', 'D', 'C', 'B', 'A']},
        children: {A: ['B', 'C', 'D', 'E', 'F', 'G'], B: ['C', 'D', 'E', 'F', 'G'], C: ['D', 'E', 'F', 'G'], D: ['E', 'F', 'G'], E: ['F', 'G'], F: ['G'], G: []}})
  })
  it('add bottom G->H', function () {
    t.add('G', 'H')
    t.add('A', 'B')
    expect(t).toEqual(
      { add: t.add,
        roots: {A: {B: {C: {D: {E: {F: {G: {H: {}}}}}}}}},
        parents: {A: [], B: ['A'], C: ['B', 'A'], D: ['C', 'B', 'A'], E: ['D', 'C', 'B', 'A'], F: ['E', 'D', 'C', 'B', 'A'], G: ['F', 'E', 'D', 'C', 'B', 'A'], H: ['G', 'F', 'E', 'D', 'C', 'B', 'A']},
        children: {A: ['B', 'C', 'D', 'E', 'F', 'G', 'H'], B: ['C', 'D', 'E', 'F', 'G', 'H'], C: ['D', 'E', 'F', 'G', 'H'], D: ['E', 'F', 'G', 'H'], E: ['F', 'G', 'H'], F: ['G', 'H'], G: ['H'], H: []}})
  })
  // it('dump', function () {
  //   console.dir(t)
  //   expect(t.parents.B).toEqual([ 'A' ])
  // })
})
