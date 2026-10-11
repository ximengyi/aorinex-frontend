// 与后端 app/constants/ErrorCode.php 保持一致；后端 msg 保留具体校验上下文。
const API_ERROR_MESSAGES: Record<string, string> = {
  400: '输入参数有误',
  401: '未登录，请登录!',
  403: '无权限访问该资源',
  404: '404 not found',
  429: '请求过于频繁，请稍后再试',
  500: '系统错误，请稍后重试',
  1000: '数据保存失败',
  1001: '账号名或密码错误',
  1002: '当前账户已经被禁用',
  1003: '用户不存在',
  1004: '验证码错误或已过期',
  1005: '验证码发送失败',
  1006: '密码长度至少6位',
  1007: '密码重置失败',
  1008: '该手机号已被使用',
  1009: '密码修改失败',
  1010: '手机号更换失败',
  1011: '两次输入的密码不一致',
  2001: '权限不能为空',
  2002: '权限标识已存在',
  2003: '不能将自己设为父级',
  2004: '角色名称已存在',
  2005: '部分权限规则不存在',
  2006: '权限规则不存在',
  2007: '角色不存在',
  2008: '用户名已存在',
  2009: '手机号已存在',
  2010: '邮箱已存在',
  2011: '部分角色不存在',
  2012: '账号不存在',
  2110: '存在子菜单，禁止删除',
  2111: '禁止操作超级管理员',
};

export function getApiErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== 'object') {
    return fallback;
  }

  const body = data as Record<string, unknown>;
  if (body.code === 0 || body.code === '0') {
    return fallback;
  }

  if (typeof body.msg === 'string' && body.msg.trim()) {
    return body.msg.trim();
  }

  const code = body.code;
  if (
    (typeof code === 'number' || typeof code === 'string') &&
    Object.hasOwn(API_ERROR_MESSAGES, code)
  ) {
    return API_ERROR_MESSAGES[String(code)] ?? fallback;
  }

  for (const message of [body.error, body.message]) {
    if (typeof message === 'string' && message.trim()) {
      return message.trim();
    }
  }

  return fallback;
}
