# egg-router-schema
Egg.js 路由指定、参数校验装饰器

``` ts
// controller/example.ts
import { Controller } from 'egg';
import { namespace, GET } from 'egg-router-schema';
import schema from '../schema/example';

@namespace('/example')
export default class ExampleController extends Controller {

  /**
   * 获取租户下的所有用户信息
   */
  @GET('/:tenantId/users', schema.getUsersByTenantId)
  public async getUsersByTenantId() {
    const { ctx, service } = this;
    const { tenantId } = ctx.params;
    const users: object[] = await service.uic.getUsersByTenantId(tenantId);
    ctx.body = users;
  }

}
```

``` ts
// app/router.ts
import { Application } from 'egg';
import * as EggRouter from 'egg-router-schema';

export default (app: Application) => {
  EggRouter.bind(app, { validator: app.middleware.paramValid, prefix: '/' });
};
```
