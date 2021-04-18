module.exports = function (plop) {
  // controller generator
  plop.setGenerator('controller', {
    description: 'application controller logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'controller name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/controllers/{{camelCase name}}.ts',
        templateFile: 'plop-templates/controller.hbs',
      },
      {
        type: 'add',
        path: 'src/controllers/{{camelCase name}}.test.ts',
        templateFile: 'plop-templates/controllerTest.hbs',
      },
    ],
  });
  plop.setGenerator('model', {
    description: 'Application model',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'model name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/controllers/{{camelCase name}}.ts',
        templateFile: 'plop-templates/controller.hbs',
      },
      {
        type: 'add',
        path: 'src/controllers/{{camelCase name}}.test.ts',
        templateFile: 'plop-templates/controllerTest.hbs',
      },
      {
        type: 'add',
        path: 'src/models/{{camelCase name}}.ts',
        templateFile: 'plop-templates/model.hbs',
      },
    ],
  });
};
