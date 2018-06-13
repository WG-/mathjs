// test transpose
const assert = require('assert'), math = require('../../../src/index'), ctranspose = math.ctranspose

describe('ctranspose', function () {
  it('should transpose a real scalar', function () {
    assert.deepEqual(ctranspose(3), 3)
  })

  it('should conjugate a complex scalar', function () {
    assert.deepEqual(ctranspose(math.complex(3, 4)), math.complex(3, -4))
  })

  it('should transpose a vector', function () {
    assert.deepEqual(ctranspose([1, 2, 3]), [1, 2, 3])
    assert.deepEqual(ctranspose(math.matrix([1, 2, 3]).toArray()), [1, 2, 3])
  })

  it('should conjgate a complex vector', function () {
    const a = math.complex(1, 2)
    const b = math.complex(3, 4)
    const c = math.complex(5, 6)
    const aH = math.complex(1, -2)
    const bH = math.complex(3, -4)
    const cH = math.complex(5, -6)
    assert.deepEqual(ctranspose([a, b, c]), [aH, bH, cH])
    assert.deepEqual(ctranspose(math.matrix([a, b, c])).toArray(), [aH, bH, cH])
  })

  it('should transpose a 2d matrix', function () {
    assert.deepEqual(ctranspose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]])
    assert.deepEqual(ctranspose(math.matrix([[1, 2, 3], [4, 5, 6]]).toArray()), [[1, 4], [2, 5], [3, 6]])
    assert.deepEqual(ctranspose([[1, 2], [3, 4]]), [[1, 3], [2, 4]])
    assert.deepEqual(ctranspose([[1, 2, 3, 4]]), [[1], [2], [3], [4]])
  })

  it('should conjugate transpose a 2d complex matrix', function () {
    const a = math.complex(1, 2)
    const b = math.complex(3, 4)
    const c = math.complex(5, 6)
    const d = math.complex(7, 8)
    const e = math.complex(9, 10)
    const f = math.complex(11, 12)
    const aH = math.complex(1, -2)
    const bH = math.complex(3, -4)
    const cH = math.complex(5, -6)
    const dH = math.complex(7, -8)
    const eH = math.complex(9, -10)
    const fH = math.complex(11, -12)
    assert.deepEqual(ctranspose([[a, b, c], [d, e, f]]), [[aH, dH], [bH, eH], [cH, fH]])
    assert.deepEqual(ctranspose(math.matrix([[a, b, c], [d, e, f]])).toArray(), [[aH, dH], [bH, eH], [cH, fH]])
    assert.deepEqual(ctranspose([[a, b], [c, d]]), [[aH, cH], [bH, dH]])
    assert.deepEqual(ctranspose([[a, b, c, d]]), [[aH], [bH], [cH], [dH]])
  })

  it('should throw an error for invalid matrix transpose', function () {
    assert.throws(function () {
      assert.deepEqual(ctranspose([[]]), [[]]) // size [2,0]
    })
    assert.throws(function () {
      ctranspose([[[1], [2]], [[3], [4]]]) // size [2,2,1]
    })
  })

  it('should throw an error if called with an invalid number of arguments', function () {
    assert.throws(function () { ctranspose() }, /TypeError: Too few arguments/)
    assert.throws(function () { ctranspose([1, 2], 2) }, /TypeError: Too many arguments/)
  })

  describe('DenseMatrix', function () {
    it('should transpose a 2d matrix', function () {
      const a = math.complex(1, 2)
      const b = math.complex(3, 4)
      const c = math.complex(5, 6)
      const d = math.complex(7, 8)
      const e = math.complex(9, 10)
      const f = math.complex(11, 12)
      const aH = math.complex(1, -2)
      const bH = math.complex(3, -4)
      const cH = math.complex(5, -6)
      const dH = math.complex(7, -8)
      const eH = math.complex(9, -10)
      const fH = math.complex(11, -12)
      let m = math.matrix([[a, b, c], [d, e, f]])
      let t = ctranspose(m)
      assert.deepEqual(t.valueOf(), [[aH, dH], [bH, eH], [cH, fH]])

      m = math.matrix([[a, b], [c, d], [e, f]])
      t = ctranspose(m)
      assert.deepEqual(t.toArray(), [[aH, cH, eH], [bH, dH, fH]])

      m = math.matrix([[a, b], [c, d]])
      t = ctranspose(m)
      assert.deepEqual(t.valueOf(), [[aH, cH], [bH, dH]])

      m = math.matrix([[a, b, c, d]])
      t = ctranspose(m)
      assert.deepEqual(t.valueOf(), [[aH], [bH], [cH], [dH]])

      m = math.matrix([[a, b], [c, d]], 'dense', 'number')
      t = ctranspose(m)
      assert.deepEqual(t.valueOf(), [[aH, cH], [bH, dH]])
      assert.ok(t.datatype() === 'number')
    })

    it('should throw an error for invalid matrix transpose', function () {
      let m = math.matrix([[]])
      assert.throws(function () { transpose(m) })

      m = math.matrix([[[1], [2]], [[3], [4]]])
      assert.throws(function () { transpose(m) })
    })
  })

  describe('SparseMatrix', function () {
    it('should transpose a 2d matrix', function () {
      const a = math.complex(1, 2)
      const b = math.complex(3, 4)
      const c = math.complex(5, 6)
      const d = math.complex(7, 8)
      const e = math.complex(9, 10)
      const f = math.complex(11, 12)
      const aH = math.complex(1, -2)
      const bH = math.complex(3, -4)
      const cH = math.complex(5, -6)
      const dH = math.complex(7, -8)
      const eH = math.complex(9, -10)
      const fH = math.complex(11, -12)
      let m = math.sparse([[a, b, c], [d, e, f]])
      let t = ctranspose(m)
      assert.deepEqual(t.valueOf(), [[aH, dH], [bH, eH], [cH, fH]])

      m = math.sparse([[a, b], [c, d], [e, f]])
      t = ctranspose(m)
      assert.deepEqual(t.toArray(), [[aH, cH, eH], [bH, dH, fH]])

      m = math.sparse([[a, b], [c, d]])
      t = ctranspose(m)
      assert.deepEqual(t.valueOf(), [[aH, cH], [bH, dH]])

      /* Failing test, but I'm not sure if would be expected to pass */
      /*
      m = math.sparse([[1,2,3,4]], 'number')
      t = ctranspose(m)
      assert.deepEqual(t.valueOf(), [[1],[2],[3],[4]])
      assert.ok(t.datatype() === 'number')
      */
    })

    it('should throw an error for invalid matrix transpose', function () {
      const m = math.matrix([[]], 'sparse')
      assert.throws(function () { transpose(m) })
    })
  })

  it('should LaTeX transpose', function () {
    const expression = math.parse('ctranspose([[1+2i,3+4i],[5+6i,7+8i]])')
    assert.equal(expression.toTex(), '\\left(\\begin{bmatrix}1+2~ i&3+4~ i\\\\5+6~ i&7+8~ i\\\\\\end{bmatrix}\\right)^H')
  })
})