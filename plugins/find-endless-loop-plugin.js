const t = require("@babel/types");

// 用于生成唯一的计数变量名
let countVariableId = 0;

module.exports = function declare() {
  return {
    name: "find-endless-loop",
    visitor: {
      WhileStatement(path, state) {
        handleLoop(path, state);
      },
      ForStatement(path, state) {
        handleLoop(path, state);
      },
    },
  };

  function handleLoop(path, state) {
    // 创建一个唯一的计数变量名
    const countVariableName = `endless_loop_count${countVariableId++}`;

    // 创建一个变量声明节点
    const declaration = t.variableDeclaration("let", [
      t.variableDeclarator(
        t.identifier(countVariableName),
        t.numericLiteral(0)
      ),
    ]);

    // 在循环语句之前插入变量声明
    path.insertBefore(declaration);

    // 创建 count += 1; 的表达式，使用唯一的计数变量
    const incrementExpression = t.expressionStatement(
      t.assignmentExpression(
        "+=",
        t.identifier(countVariableName),
        t.numericLiteral(1)
      )
    );

    // 在循环内部的代码块中插入 count += 1;，使用唯一的计数变量
    path.get("body").pushContainer("body", incrementExpression);

    // 从插件参数中获取循环次数限制
    const { loopLimit = 10000 } = state.opts; 

    // 创建条件检查和错误抛出的代码，使用唯一的计数变量和动态的循环次数限制
    const condition = t.binaryExpression(
      ">=",
      t.identifier(countVariableName),
      t.numericLiteral(loopLimit)
    );
    const throwStatement = t.throwStatement(
      t.newExpression(t.identifier("Error"), [t.stringLiteral("死循环了---")])
    );

    // 在循环内部的代码块中插入条件检查和错误抛出的代码，使用唯一的计数变量和动态的循环次数限制
    path
      .get("body")
      .pushContainer("body", t.ifStatement(condition, throwStatement));
  }
};
