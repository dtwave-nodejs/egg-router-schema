'use strict';

/**
 * Egg.js 路由装饰器
 */

require('reflect-metadata');

const METHOD_FLAG = Symbol('egg-router-schema#METHOD');

const METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
};

const toString = Object.prototype.toString;
const routers = [];



/**
 * 绑定路由
 * @param {Egg.Application} app - egg application
 * @param {Object} options? 配置
 */
const bind = (app, options = { prefix: '/', validator: null }) => {
  app.router.prefix(options.prefix);
  routers.forEach(r => {
    app.router[r.method](r.path, options.validator(r.schema) ,async ctx => {
      const instance = new r.target.constructor(ctx);
      await r.controller.call(instance);
    });
  });
};



/**
 * 一级路由
 * @param {String} prefix 一级路由
 */
const namespace = (prefix) => {
  return (target, key, descriptor) => {
    const metadatas = Reflect.getMetadata(METHOD_FLAG, target.prototype);
    toString.call(metadatas) === '[object Array]' && metadatas.forEach(meta => {
      routers.push({
        path: `${prefix}${meta.path}`,
        method: meta.method,
        controller: meta.fn,
        schema: meta.schema,
        target: meta.target,
      });
    });
    return descriptor;
  }
}

const createMappingDecorator = (method) => (path, schema) => {
  return (target, key, descriptor) => {
    let meta = Reflect.getMetadata(METHOD_FLAG, target);
    const targetValue = {
      path,
      method,
      schema: schema || {},
      target,
      fn: descriptor.value,
    };
    meta ? meta.push(targetValue) : (meta = [targetValue]);
    Reflect.defineMetadata(METHOD_FLAG, meta, target);
    return descriptor;
  }
}


module.exports = {
  bind,
  GET: createMappingDecorator(METHOD.GET),
  POST: createMappingDecorator(METHOD.POST),
  PUT: createMappingDecorator(METHOD.PUT),
  DELETE: createMappingDecorator(METHOD.DELETE),
  namespace,
};