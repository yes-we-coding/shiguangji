---
title: GnuTLS 错误的真相：HTTPS 推送需要的不是证书，是 TTY
date: 2026-08-08
excerpt: 一次"明明 TLS 握手正常、curl 通、ls-remote 也通"的诡异 push 失败。最后定位到根因是 HTTPS 认证需要交互式输入，而当前环境没有 TTY。换成 SSH Key 解决。
tags: [Git, 运维]
---

之前给博客做完 SEO / a11y 的优化，提交了两个 commit 后发现推不上 GitHub。先后撞到两条报错：

```
# 第一次
fatal: could not read Username for 'https://github.com': 
No such device or address

# 第二次
fatal: unable to access 'https://github.com/...': 
GnuTLS recv error (-110): The TLS connection was non-properly terminated.
```

第一条其实已经把真相说出来了——**"could not read Username"**，问题出在没有 TTY。但我没认真读，转头去查第二条的"TLS"，绕了一圈。

## 一层一层排查

### 网络层

```
curl https://github.com        → HTTP 200, 1.2s
curl https://api.github.com   → HTTP 200, 0.5s
nslookup github.com           → 20.205.243.166
```

通。

### Git 协议层

```
git ls-remote https://github.com/yes-we-coding/shiguangji.git HEAD
→ c208a1a240fe4c24a8f112c71eafe569bf4846fd   HEAD
```

读操作**也通**——公开仓库的 clone / fetch / pull 不需要认证。

### push 才挂

同样协议、同样域名，只有 push 失败。说明网络层没问题，**问题在认证**。

## 真相：不是 TLS，是 TTY

Git 用 HTTPS 推送时需要认证（Username + Password）。如果当前仓库没配 credential helper，Git 会**试图弹出交互式提示**：

```
Username for 'https://github.com': 
```

但我这个环境是个**没有 TTY 的沙盒**——没有终端、没有 stdin。Git 弹不出这个提示，于是在认证阶段就崩了。

第一条报错 `"could not read Username: No such device or address"` 是真相；第二条 `GnuTLS recv error` 是 Git 在等用户输入时连接被对端关闭，错误信息被简化成了"TLS terminated"。**TLS 早就成功了，问题从来不在那**。

> 错误信息有时会指向错误的方向。读错的字面意思，会走错排查路线。

## 修复：SSH Key

SSH 协议走公钥认证，**完全不需要交互式输入**，正好治这个病。

```bash
# 1. 生成 key（无密码短语，省得每次 push 还要敲）
ssh-keygen -t ed25519 -C "deploy-bot" \
  -f ~/.ssh/github_repo -N ""

# 2. 启动 ssh-agent 并加载
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/github_repo

# 3. 写 config，让 github.com 自动用这个 key
cat >> ~/.ssh/config << 'CFG'
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_repo
    IdentitiesOnly yes
    AddKeysToAgent yes
CFG

# 4. 切 remote 到 SSH
git remote set-url origin git@github.com:USER/REPO.git
```

最后把**公钥**（`~/.ssh/github_repo.pub` 的内容）粘贴到：

👉 https://github.com/settings/keys

加完后 `ssh -T git@github.com` 应该看到：

```
Hi USER! You've successfully authenticated, 
but GitHub does not provide shell access.
```

这就是通了。从那以后 `git push` 直接走 SSH，再也不需要交互。

## 经验

几个值得记住的点：

1. **错误信息要交叉验证**。看到"TLS error"先别急着排查证书，用 curl + ls-remote 各打一遍——如果都通，TLS 没问题，问题在上层
2. **HTTPS 的 git push 几乎是唯一一个还要交互式认证的常见 Git 操作**。clone / fetch / pull 都不用认证，只有 push 要。配 SSH key 是治本的方案
3. **沙盒 / 容器 / CI 环境的"无 TTY"是个隐形坑**。很多 Git / docker login / npm login 命令都默认假设有 TTY，遇到这类环境就哑火
4. **SSH 公钥是设计成可以公开分享的**。任何需要 push 的沙盒生成一对 key、公钥加到 GitHub、私钥留在沙盒——比传 PAT 安全得多。PAT 是 bearer token，泄露就完了

> 排错时最浪费时间的不是问题本身，是错误信息指向了错误的方向。
