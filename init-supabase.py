#!/usr/bin/env python3
"""
SKYWORTH 新站 Supabase 自动建表脚本
通过 Supabase Management API 远程执行 SQL（无需打开 SQL Editor）。

用法：
  1. 在 Supabase 控制台生成 Access Token：
     头像 → Account settings → Access Tokens → Generate new token
     （权限勾选 read/write，名字随意）
  2. 执行：
     python3 init-supabase.py <你的sbp_token>
"""
import json
import sys
import urllib.request
import urllib.error

PROJECT_REF = "sqvmjdvuijzzehivmkgl"  # skyworth-new 项目 ref
API_HOST = "https://api.supabase.com"
SQL_FILE = "supabase-init.sql"


def main():
    if len(sys.argv) < 2:
        print("用法: python3 init-supabase.py <sbp_token>")
        sys.exit(1)
    token = sys.argv[1].strip()

    with open(SQL_FILE, "r", encoding="utf-8") as f:
        sql = f.read()

    url = f"{API_HOST}/v1/projects/{PROJECT_REF}/database/query"
    req = urllib.request.Request(
        url,
        data=json.dumps({"query": sql}).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
            "Accept": "*/*",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8")
            print(f"HTTP {resp.status}")
            print("执行结果:", body if body else "(Success, no rows returned)")
            print("\n✅ 建表成功！")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"HTTP {e.code}")
        print("错误:", body)
        sys.exit(1)


if __name__ == "__main__":
    main()
