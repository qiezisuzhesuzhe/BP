import Vue from 'vue'
import Vuex from 'vuex'
import { PACKAGES, buildDayPlan, RIGHT_ENTRIES, makeOrderNo, deviceType, makeDeviceSnapshot } from '@/common/mock.js'

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
  name: '张丽丽',
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
    devices: (cache && cache.devices) || [],
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
    // 已激活权益：已购买 + 首次对话完成问询（chatStarted），首页今日健康指导以此为显示条件
    activatedRight(state) {
      return state.rights.find((r) => r.status === 'active' && r.chatStarted) || null
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
      return {
        pkgKey: key,
        preview: !r,
        items: buildDayPlan(key, r ? r.answers : null, state.currentDayIndex)
      }
    },
    devices(state) {
      return state.devices
    },
    rightEntries() {
      return RIGHT_ENTRIES
    },
    deviceById(state) {
      return function (id) {
        return state.devices.find((d) => d.id === id) || null
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
    ADD_DEVICE(state, device) {
      state.devices.unshift(device)
    },
    UPDATE_DEVICE_DATA(state, payload) {
      const d = state.devices.find((x) => x.id === payload.id)
      if (d) {
        d.data = payload.data
        d.lastSync = payload.lastSync || fmtDateTime(now())
        d.online = true
      }
    },
    REMOVE_DEVICE(state, id) {
      state.devices = state.devices.filter((x) => x.id !== id)
    },
    RESET_ALL(state) {
      state.orders = []
      state.rights = []
      state.chats = {}
      state.devices = []
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
            chats: s.chats,
            devices: s.devices
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
        level: '尊享版',
        points: 2680,
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
          icon: 'fa-solid fa-hand',
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

      // 与对话页、首页同源：按评估结论生成，再按类目重要性取 4 条推送
      const picked = buildDayPlan(right.pkgKey, payload.answers, 0, 4).map((it) => ({
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

    // 扫码添加设备：生成设备记录 + 初始数据快照 + 通知消息
    addDevice(context, payload) {
      const type = deviceType(payload.typeKey)
      if (!type) return null
      const id = uid('d')
      const device = {
        id: id,
        typeKey: type.key,
        name: payload.name || type.name,
        // 云平台回传的真实型号优先（如雷达款由平台按设备号查得），否则用内置默认型号
        model: payload.model || type.model,
        sn: payload.sn || 'SN' + Math.floor(Math.random() * 900000 + 100000),
        deviceid: payload.deviceid || '',
        // 安装位置：仅平台有回传时才落库（雷达等固定安装设备）
        site: payload.site || '',
        addedAt: fmtDateTime(now()),
        lastSync: fmtDateTime(now()),
        online: true,
        data: makeDeviceSnapshot(type, null)
      }
      context.commit('ADD_DEVICE', device)
      context.commit('ADD_MESSAGES', [
        {
          id: uid('m'),
          type: 'device',
          icon: 'fa-solid fa-plug-circle-plus',
          color: type.color,
          title: '设备添加成功',
          content: '「' + type.name + '」（' + device.sn + '）已与账号绑定，开始同步健康数据。',
          time: fmtDateTime(now()),
          read: false,
          link: '/pages/device/detail?id=' + id
        }
      ])
      context.dispatch('persist')
      return device
    },

    // 定时拉取设备最新数据（原型模拟实时）
    updateDeviceData(context, id) {
      const d = context.state.devices.find((x) => x.id === id)
      if (!d) return null
      const type = deviceType(d.typeKey)
      const data = makeDeviceSnapshot(type, d.data)
      context.commit('UPDATE_DEVICE_DATA', { id, data, lastSync: fmtDateTime(now()) })
      context.dispatch('persist')
      return data
    },

    removeDevice(context, id) {
      context.commit('REMOVE_DEVICE', id)
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
