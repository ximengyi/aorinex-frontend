import {
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';

import { describe, expect, it, vi } from 'vitest';

import { getApiErrorMessage } from './error-message';

const fallback = '服务器内部错误';

describe('getApiErrorMessage', () => {
  it.each([
    [{ code: 1001, msg: '账号名或密码错误' }, '账号名或密码错误'],
    [{ code: 400, msg: '姓名不能为空' }, '姓名不能为空'],
    [{ code: 1001 }, '账号名或密码错误'],
    [{ code: '1002', msg: '  ' }, '当前账户已经被禁用'],
    [{ code: 2008 }, '用户名已存在'],
    [{ code: 2110 }, '存在子菜单，禁止删除'],
    [{ code: 401 }, '未登录，请登录!'],
    [{ code: 403, msg: '无权限访问该资源' }, '无权限访问该资源'],
    [{ code: 429 }, '请求过于频繁，请稍后再试'],
    [{ code: 500 }, '系统错误，请稍后重试'],
    [{ code: 9999, msg: '新的业务错误' }, '新的业务错误'],
    [{ error: '兼容旧接口' }, '兼容旧接口'],
    [{ message: '兼容 message' }, '兼容 message'],
    [{ code: 'toString' }, fallback],
    [{ code: 9999, msg: { detail: 'invalid' } }, fallback],
    [{ code: 0, msg: 'success' }, fallback],
    [null, fallback],
    ['<html>Bad Gateway</html>', fallback],
  ])('resolves %j to %s', (body, expected) => {
    expect(getApiErrorMessage(body, fallback)).toBe(expected);
  });
});

function createClient(body: unknown) {
  const notify = vi.fn();
  const client = new RequestClient({
    adapter: async (config) => ({
      config,
      data: body,
      headers: {},
      status: 200,
      statusText: 'OK',
    }),
    responseReturn: 'data',
  });
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'code',
      dataField: 'data',
      successCode: 0,
    }),
  );
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((message, error) => {
      notify(getApiErrorMessage(error?.response?.data, message));
    }),
  );
  return { client, notify };
}

describe('api response interceptors', () => {
  it('rejects an HTTP 200 business failure and shows its message once', async () => {
    const body = { code: 1001, data: null, msg: '账号名或密码错误' };
    const { client, notify } = createClient(body);

    await expect(client.post('/auth/login', {})).rejects.toEqual(body);
    expect(notify).toHaveBeenCalledExactlyOnceWith('账号名或密码错误');
  });

  it('unwraps successful data without showing an error', async () => {
    const data = { status: 'ok' };
    const { client, notify } = createClient({ code: 0, data, msg: 'success' });

    await expect(client.get('/health')).resolves.toEqual(data);
    expect(notify).not.toHaveBeenCalled();
  });
});
