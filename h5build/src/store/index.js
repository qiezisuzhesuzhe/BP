import Vue from 'vue'
import Vuex from 'vuex'
import { PACKAGES, TIMELINE, makeOrderNo } from '@/common/mock.js'

Vue.use(Vuex)

const STORAGE_KEY = 'ankang_store_v1'

function now() {
  return Date.now()
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}

export function fmtDate(ts) {
  const d = new Date(ts)
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}

export function fmtDateTime(ts) {
  const d = new Date(ts)
  return fmtDate(ts) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes())
}

function addMonths(ts, m) {
  const d = new Date(ts)
  d.setMonth(d.getMonth() + m)
  return d.getTime()
}

function uid(prefix) {
  return prefix + '_' + now().toString(36) + Math.floor(Math.random() * 1000)
}

const defaultProfile = {
  name: '张明远',
  avatarText: '张',
  phone: '138****6820',
  gender: '男',
  age: 54,
  height: 172,
  weight: 78,
  city: '上海 · 徐汇区',
  joinAt: '2026-05-12',
  tags: ['高血压 2 级', '低盐饮食中', '连续打卡 26 天']
}

function buildDefaultMessages() {
  return [
    {
      id: uid('m'),
      type: 'activity',
      icon: 'fa-solid fa-gift',
      color: '#f2c94c',
      title: '新人专享礼包',
      content: '首次购买健康管理服务包立减 100 元，可与限时折扣叠加使用。',
      time: fmtDateTime(now() - 86400000 * 2),
      read: false,
      link: ''
    },
    {
      id: uid('m'),
      type: 'doctor',
      icon: 'fa-solid fa-stethoscope',
      color: '#389a82',
      title: '医师团队提示',
      content: '您上次填写的血压值偏高（148/95 mmHg），建议尽快开始系统化管理。',
      time: fmtDateTime(now() - 86400000),
      read: false,
      link: ''
    }
  ]
}

function load() {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {}
  return null
}

const cache = load()

const store = new Vuex.Store({
  state: {
    profile: (cache && cache.profile) || defaultProfile,
    orders: (cache && cache.orders) || [],
    rights: (cache && cache.rights) || [],
    messages: (cache && cache.messages) || buildDefaultMessages(),
    chats: (cache && cache.chats) || {},
    currentDayIndex: 0
  },

  getters: {
    packages() {
      return PACKAGES
    },
    unreadCount(state) {
      return state.messages.filter((m) => !m.read).length
    },
    activeRight(state) {
      return state.rights.find((r) => r.status === 'active') || null
    },
    rightById(state) {
      return function (id) {
        return state.rights.find((r) => r.id === id) || null
      }
    },
    orderByNo(state) {
      return function (no) {
        return state.orders.find((o) => o.orderNo === no) || null
      }
    },
    paidOrders(state) {
      return state.orders.filter((o) => o.status === 'paid')
    },
    todayTimeline(state) {
      const r = state.rights.find((x) => x.chatStarted) || state.rights[0]
      const key = r ? r.pkgKey : 'hbp'
      const days = TIMELINE[key] || TIMELINE.hbp
      return {
        pkgKey: key,
        preview: !r,
        items: days[state.currentDayIndex] || days[0]
      }
    }
  },

  mutations: {
    SET_DAY(state, i) {
      state.currentDayIndex = i
    },
    UPDATE_PROFILE(state, patch) {
      state.profile = Object.assign({}, state.profile, patch)
    },
    ADD_ORDER(state, order) {
      state.orders.unshift(order)
    },
    PAY_ORDER(state, orderNo) {
      const o = state.orders.find((x) => x.orderNo === orderNo)
      if (o) {
        o.status = 'paid'
        o.payAt = fmtDateTime(now())
      }
    },
    ADD_RIGHT(state, right) {
      state.rights.unshift(right)
    },
    CANCEL_ORDER(state, orderNo) {
      const o = state.orders.find((x) => x.orderNo === orderNo)
      if (o && o.status === 'pending') o.status = 'canceled'
    },
    PATCH_RIGHT(state, payload) {
      const r = state.rights.find((x) => x.id === payload.id)
      if (r) Object.assign(r, payload.patch)
    },
    ADD_MESSAGES(state, list) {
      state.messages = list.concat(state.messages)
    },
    READ_MESSAGE(state, id) {
      const m = state.messages.find((x) => x.id === id)
      if (m) m.read = true
    },
    READ_ALL(state) {
      state.messages.forEach((m) => {
        m.read = true
      })
    },
    SAVE_CHAT(state, payload) {
      state.chats = Object.assign({}, state.chats, { [payload.rightId]: payload.data })
    },
    RESET_ALL(state) {
      state.orders = []
      state.rights = []
      state.chats = {}
      state.messages = buildDefaultMessages()
      state.profile = defaultProfile
    }
  },

  actions: {
    persist(context) {
      const s = context.state
      try {
        uni.setStorageSync(
          STORAGE_KEY,
          JSON.stringify({
            profile: s.profile,
            orders: s.orders,
            rights: s.rights,
            messages: s.messages,
            chats: s.chats
          })
        )
      } catch (e) {}
    },

    // 创建待支付订单
    createOrder(context, pkgId) {
      const pkg = PACKAGES.find((p) => p.id === pkgId)
      if (!pkg) return null
      const order = {
        orderNo: makeOrderNo(),
        pkgId: pkg.id,
        pkgKey: pkg.key,
        pkgName: pkg.name,
        duration: pkg.duration,
        price: pkg.price,
        originPrice: pkg.originPrice,
        icon: pkg.icon,
        accent: pkg.accent,
        status: 'pending',
        createAt: fmtDateTime(now()),
        payAt: ''
      }
      context.commit('ADD_ORDER', order)
      context.dispatch('persist')
      return order
    },

    // 支付成功：置订单已支付 + 生成权益 + 推送消息
    payOrder(context, orderNo) {
      const order = context.state.orders.find((o) => o.orderNo === orderNo)
      if (!order) return null
      context.commit('PAY_ORDER', orderNo)

      const pkg = PACKAGES.find((p) => p.id === order.pkgId)
      const months = parseInt(order.duration, 10) || 3
      const startTs = now()
      const endTs = addMonths(startTs, months)
      const right = {
        id: uid('r'),
        orderNo: order.orderNo,
        pkgId: order.pkgId,
        pkgKey: order.pkgKey,
        name: order.pkgName,
        duration: order.duration,
        icon: order.icon,
        accent: order.accent,
        accentSoft: pkg ? pkg.accentSoft : '#d4f5ee',
        subtitle: pkg ? pkg.subtitle : '',
        services: pkg ? pkg.services : [],
        price: order.price,
        status: 'active',
        startAt: fmtDate(startTs),
        endAt: fmtDate(endTs),
        startTs: startTs,
        endTs: endTs,
        totalDays: Math.round((endTs - startTs) / 86400000),
        usedDays: 0,
        wecomAdded: false,
        chatStarted: false
      }
      context.commit('ADD_RIGHT', right)

      context.commit('ADD_MESSAGES', [
        {
          id: uid('m'),
          type: 'order',
          icon: 'fa-solid fa-circle-check',
          color: '#27ae60',
          title: '支付成功',
          content:
            '您已成功购买「' + right.name + ' · ' + right.duration + '」，实付 ¥' + order.price + '，服务有效期至 ' + right.endAt + '。',
          time: fmtDateTime(now()),
          read: false,
          link: '/pages/rights/detail?id=' + right.id
        },
        {
          id: uid('m'),
          type: 'service',
          icon: 'fa-solid fa-hand-wave',
          color: '#389a82',
          title: '专属健康管理师已就位',
          content: '请到「我的权益」点击立即使用，添加企业微信后即可开始首次健康问询。',
          time: fmtDateTime(now()),
          read: false,
          link: '/pages/rights/rights'
        }
      ])
      context.dispatch('persist')
      return right
    },

    // 完成加企微
    bindWecom(context, rightId) {
      context.commit('PATCH_RIGHT', { id: rightId, patch: { wecomAdded: true } })
      context.dispatch('persist')
    },

    // 首次问询完成：写入方案生成消息 + 时间线消息
    finishAssessment(context, payload) {
      const right = context.state.rights.find((r) => r.id === payload.rightId)
      if (!right) return
      context.commit('PATCH_RIGHT', {
        id: payload.rightId,
        patch: { chatStarted: true, usedDays: 1, answers: payload.answers || {} }
      })

      const days = TIMELINE[right.pkgKey] || TIMELINE.hbp
      const items = days[0] || []
      const picked = items.slice(0, 4).map((it) => ({
        id: uid('m'),
        type: 'timeline',
        icon: it.icon,
        color: right.accent,
        title: it.time + ' · ' + it.title,
        content: it.desc,
        time: fmtDateTime(now()),
        read: false,
        link: '/pages/index/index'
      }))

      context.commit('ADD_MESSAGES', [
        {
          id: uid('m'),
          type: 'report',
          icon: 'fa-solid fa-clipboard-list',
          color: '#f2c94c',
          title: '个性化健康方案已生成',
          content: '基于您的首次问询结果，已生成 ' + right.duration + '专属管理方案，可在首页查看今日健康指导。',
          time: fmtDateTime(now()),
          read: false,
          link: '/pages/index/index'
        }
      ].concat(picked))
      context.dispatch('persist')
    },

    saveChat(context, payload) {
      context.commit('SAVE_CHAT', payload)
      context.dispatch('persist')
    },

    updateProfile(context, patch) {
      context.commit('UPDATE_PROFILE', patch)
      context.dispatch('persist')
    },

    readMessage(context, id) {
      context.commit('READ_MESSAGE', id)
      context.dispatch('persist')
    },

    readAll(context) {
      context.commit('READ_ALL')
      context.dispatch('persist')
    },

    resetAll(context) {
      context.commit('RESET_ALL')
      context.dispatch('persist')
    }
  }
})

export default store
