import * as Egg from 'egg';

declare namespace EggRouterSchema {

  function bind(app: Egg.Application, {
    prefix: string,
    validator: any,
  }): void;

  function namespace(prefix: string): any;

  function GET(path: string, schema?: object): any;
  function POST(path: string, schema?: object): any;
  function PUT(path: string, schema?: object): any;
  function DELETE(path: string, schema?: object): any;
}

export = EggRouterSchema;