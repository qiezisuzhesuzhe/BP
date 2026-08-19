/**
 * 智能手环（血压款）—— 埃微 iwown 设备对云 数据桥接
 *
 * 后端接收服务：/workspace/band-server（Node.js，默认端口 8091）
 *  - /pb/upload 等 6 个路径接收手环 4G 直传数据（埃微自定义二进制 + protobuf）
 *  - /api/devices 供 H5 查询最新心率/血压/步数
 *
 * 本模块：后端地址配置 + 拉取/绑定封装；后端不可达时降级为本地模拟，保证原型可演示。
 */

export const BAND_SERVER = 'http://localhost:8091'

export function bandApi(path) {
  return BAND_SERVER + path
}

// 从后端拉取手环最新状态（心率 hr / 收缩压 sbp / 舒张压 dbp / 步数 steps / 电量 battery / 时间戳 ts）
export function fetchBandLatest(deviceid) {
  return new Promise((resolve) => {
    uni.request({
      url: bandApi('/api/devices/' + deviceid),
      method: 'GET',
      timeout: 5000,
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          const latest = res.data.data && res.data.data.latest
          if (latest && (latest.hr != null || latest.sbp != null || latest.steps != null)) {
            resolve(latest)
            return
          }
        }
        resolve(simulateLatest())
      },
      fail() {
        resolve(simulateLatest())
      }
    })
  })
}

// 把手环设备注册到后端（绑定 deviceid 与用户）
export function bindBandDevice(deviceid, name) {
  return new Promise((resolve) => {
    uni.request({
      url: bandApi('/api/devices'),
      method: 'POST',
      data: { deviceid: deviceid, name: name },
      timeout: 5000,
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          resolve(res.data.data)
        } else {
          resolve(null)
        }
      },
      fail() {
        resolve(null)
      }
    })
  })
}

// 降级模拟：后端未启动时生成本地演示数据
let simSeq = 0
export function simulateLatest() {
  simSeq++
  const hr = 66 + Math.floor(Math.random() * 18)
  const sbp = 116 + Math.floor(Math.random() * 18)
  const dbp = 74 + Math.floor(Math.random() * 14)
  return {
    steps: simSeq * 38 + Math.floor(Math.random() * 60),
    hr: hr,
    sbp: sbp,
    dbp: dbp,
    battery: 7,
    ts: Math.floor(Date.now() / 1000),
    updatedAt: Date.now(),
    _sim: true
  }
}

// 血压状态分级
export function bpLevel(sbp, dbp) {
  if (sbp == null || dbp == null) return { key: 'none', label: '--', color: '#94a3b8' }
  if (sbp >= 140 || dbp >= 90) return { key: 'high', label: '偏高', color: '#f15533' }
  if (sbp >= 120 || dbp >= 80) return { key: 'normal-h', label: '正常偏高', color: '#f2994a' }
  return { key: 'normal', label: '正常', color: '#27ae60' }
}
