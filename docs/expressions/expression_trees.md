# Expression trees

When parsing an expression via `math.parse(expr)`, math.js generates an
expression tree and returns the root node of the tree. An expression tree can
be used to analyze, manipulate, and evaluate expressions.

Example:

```js
var node = math.parse('sqrt(2 + x)');
```

In this case, the expression `sqrt(2 + x)` is basically parsed as:

```
  FunctionNode    sqrt
                   |
  OperatorNode     +
                  / \
  ConstantNode   2   x   SymbolNode
```

Alternatively, this expression tree can be build by manually creating nodes:

```js
var node1 = new math.expression.node.ConstantNode(2);
var node2 = new math.expression.node.SymbolNode('x');
var node3 = new math.expression.node.OperatorNode('+', 'add', [node1, node2]);
var node4 = new math.expression.node.FunctionNode('sqrt', [node3]);
```

The resulting expression tree with root node `node4` is equal to the expression
tree generated by `math.parse('sqrt(2 + x)')`.


## API

### Methods

All nodes have the following methods:

- `clone() : Node`

  Recursively clone an expression tree.

- `compile(namespace: Object) : Object`

  Compile an expression into optimized JavaScript code.
  The expression is compiled against a namespace, typically `math`, needed to
  bind internally used functions. `compile` returns an object with a function
  `eval([scope])` to evaluate. Example:

  ```js
  var node = math.parse('2 + x'); // returns the root Node of an expression tree
  var code = node.compile(math);  // returns {eval: function (scope) {...}}
  var eval = code.eval({x: 3};    // returns 5
  ```

- `filter(test: function) : Array.<Node>`

  Filter nodes in an expression tree. The `test` function is called as
  `test(node: Node, index: string, parent: Node)` for every node in the tree,
  and must return a boolean. The function `filter` returns an array with nodes
  for which the test returned true. Example:

  ```js
  var node = math.parse('x^2 + x/4 + 3*y');
  var filtered = node.filter(function (node) {
    return node.type == 'SymbolNode' && node.name == 'x';
  });
  // returns an array with two entries: two SymbolNodes 'x'
  ```

- `toString() : string`

  Get a string representation of the parsed expression. This is not exactly
  the same as the original input. Example:
  ```js
  var node = math.parse('3+4*2');
  node.toString();  // returns '3 + (4 * 2)'
  ```
- `toTex(): string`

  Get a [LaTeX](http://en.wikipedia.org/wiki/LaTeX) representation of the
  expression. Example:
  ```js
  var node = math.parse('sqrt(2/3)');
  node.toTex(); // returns '\sqrt{\frac{2}{3}}'
  ```

- `transform(callback: function)`

  Transform an expression tree via a transform function. Similar to `Array.map`,
  but recursively executed on all nodes in the expression tree.
  The callback function is a mapping function accepting a node, and returning
  a replacement for the node or the original node. Function `callback` is
  called as `callback(node: Node, index: string, parent: Node)` for every node
  in the tree, and must return a `Node`. The `transform` first creates a clone
  of the expression tree, so the original tree is left unchanged.

  For example, to replace all nodes of type `SymbolNode` having name 'x' with a
  ConstantNode with value 2:

  ```js
  var node = math.parse('x^2 + 5*x');
  var transformed = node.transform(function (node, index, parent) {
    if (node.type == 'SymbolNode' && node.name == 'x') {
      return new math.expression.node.ConstantNode(2);
    }
    else {
      return node;
    }
  });
  transformed.toString(); // returns '(2 ^ 2) + (5 * 2)'
  ```

- `traverse(callback)`

  Recursively traverse all nodes in a node tree. Executes given callback for
  this node and each of its child nodes. Similar to `Array.forEach`, except
  recursive.
  The callback function is a mapping function accepting a node, and returning
  a replacement for the node or the original node. Function `callback` is
  called as `callback(node: Node, index: string, parent: Node)` for every node
  in the tree. Example:

  ```js
  var node = math.parse('2 + x');
  node.traverse(function (node, index, parent) {
    switch (node.type) {
      case 'OperatorNode': console.log(node.type, node.op); break;
      case 'ConstantNode': console.log(node.type, node.value); break;
      case 'SymbolNode': console.log(node.type, node.name); break;
      default: console.log(node.type);
    }
  });
  // outputs:
  //   OperatorNode +
  //   ConstantNode 2
  //   SymbolNode x
  ```


### Static methods

- `Node.isNode(object) : boolean`

  Test whether an object is a `Node`. Returns `true` when `object` is an
  instance of `Node`, else returns `false`.


### Properties

Each `Node` has the following properties:

- `type: string`

  The type of the node, for example `'SymbolNode'`.


## Nodes

math.js has the following types of nodes. All nodes are available at the
namespace `math.expression.node`.

### ArrayNode

#### Construction
`new ArrayNode(nodes: Node[])`

#### Properties

- `nodes: Node[]`

#### Syntax example
`[1, 2, 3]`


### AssignmentNode

#### Construction
`new AssignmentNode(name: string, expr: Node)`

#### Properties

- `name: string`
- `expr: Node`

#### Syntax example
`a = 3`


### BlockNode

#### Construction
```
block = new BlockNode()
block.add(expr: Node, visible: boolean)
```

#### Properties

- `blocks: Array.<{node: Node, visible: boolean}>`

#### Syntax example
`a=1; b=2; c=3`


### ConditionalNode

#### Construction
`new ConditionalNode(condition: Node, trueExpr: Node, falseExpr: Node)`

#### Properties

- `condition: Node`
- `trueExpr: Node`
- `falseExpr: Node`

#### Syntax example
`a > 0 ? a : -a`


### ConstantNode

#### Construction
`new ConstantNode(value: * [, valueType: string])`

#### Properties

- `value: *`
- `valueType: string`

#### Syntax example
`2.4`


### FunctionAssignmentNode

#### Construction
`new FunctionAssignmentNode(name: string, params: string[], expr: Node)`

#### Properties

- `name: string`
- `params: string[]`
- `expr: Node`

#### Syntax example
`f(x) = x^2`


### FunctionNode

#### Construction
`new FunctionNode(name: string, args: Node[])`

#### Properties

- `symbol: Node`
- `args: Node[]`

#### Syntax example
`sqrt(4)`


### IndexNode

#### Construction
`new IndexNode(object: Node, ranges: Node[])`

#### Properties

- `object: Node`
- `ranges: Node[]`

#### Syntax example
`A[1:3, 2]`


### OperatorNode

#### Construction
`new OperatorNode(op: string, fn: string, args: Node[])`

#### Properties

- `op: string`
- `fn: string`
- `args: Node[]`

#### Syntax example
`2.3 + 5`


### RangeNode

#### Construction
`new RangeNode(params: Node)`

#### Properties

- `start: Node`
- `end: Node`
- `step: Node`

#### Syntax example
`1:10`
`0:2:10`


### SymbolNode

#### Construction
`new SymbolNode(name: string)`

#### Properties

- `name: string`

#### Syntax example
`x`


### UpdateNode

#### Construction
`new UpdateNode(index: IndexNode, expr: Node)`

#### Properties

- `index: IndexNode`
- `expr: Node`

#### Syntax example
`A[3, 1] = 4`