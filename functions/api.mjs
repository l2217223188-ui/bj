/* ==========================================================================
   定制衣柜报价系统 —— 多门店版（Netlify Functions v2）
   账号层级：super（总账号） / owner（门店主账号·财务） / designer（设计师）
   数据：每个门店一份独立账套（config / priceRules / addons / quotations）
   存储：Netlify Blobs（生产） / 本地文件（本地测试）
   ========================================================================== */
import crypto from 'node:crypto';


/* ---------- 新门店首次初始化数据（价格表 / 选项 / 条款） ---------- */
const SEED_DB = {
  "version": 5,
  "config": {
    "storeName": "优诺全屋定制",
    "consultant": "李",
    "phone": "",
    "address": "广东 · 肇庆",
    "quotationPrefix": "QJ",
    "depositRatio": 70,
    "arrivalRatio": 30,
    "drawer": {
      "perSqmArea": 2,
      "perCount": 1,
      "extraPrice": 80,
      "costPrice": ""
    },
    "film": {
      "enabled": false,
      "price": 30
    },
    "depthStandard": [
      {
        "name": "衣柜",
        "mm": 600
      },
      {
        "name": "餐边柜",
        "mm": 400
      },
      {
        "name": "电视柜",
        "mm": 400
      },
      {
        "name": "榻榻米",
        "mm": 450
      },
      {
        "name": "其他柜",
        "mm": 600
      }
    ],
    "hardwareUpgrades": [
      {
        "id": "none",
        "name": "标配五金（星徽 / 悍高）",
        "price": 0,
        "brands": [],
        "cost": ""
      },
      {
        "id": "dongtai",
        "name": "升级东泰五金",
        "price": 28,
        "brands": [],
        "cost": ""
      },
      {
        "id": "ruilika",
        "name": "升级锐俪卡萨五金（意大利）",
        "price": 18,
        "brands": [
          "博森",
          "鹏鸿NEW"
        ],
        "cost": ""
      }
    ],
    "terms": [
      "工期：自测量确认并支付定金之日起约 25 个工作日完成生产，具体安装时间以门店通知为准。",
      "付款方式：签订本单按表上所示付款方式付货款，安装验收合格后结清尾款。",
      "质保：柜体及门板质保 5 年，五金配件质保 2 年，人为损坏及不可抗力除外。",
      "色差：因板材批次及光线差异，实物与样品/图片可能存在轻微色差，属正常现象。",
      "墙体缝隙：因房屋墙体不垂直、不水平导致的柜体与墙面缝隙，属正常安装工艺，非质量问题。"
    ],
    "spaces": [
      "主人房",
      "左1房",
      "左2房",
      "右1房",
      "右2房",
      "客厅",
      "餐厅",
      "入户",
      "阳台",
      "新选项",
      "店铺",
      "左房",
      "右房"
    ],
    "cabinetMaterials": [
      "多层实木板",
      "香杉木",
      "实木大芯（粟木）",
      "巴西玫瑰木"
    ],
    "doorMaterials": [
      "欧松板",
      "多功能板（海洋板）",
      "多层实木板"
    ],
    "cabinetTypes": [
      {
        "name": "衣柜",
        "standardDepth": 600,
        "reminder": "抽屉、灯带、穿衣镜、拉直器、托底轨道",
        "enabled": true
      },
      {
        "name": "餐边柜",
        "standardDepth": 400,
        "reminder": "灯带、玻璃门、托底轨道、圆弧",
        "enabled": true
      },
      {
        "name": "电视柜",
        "standardDepth": 400,
        "reminder": "灯带、玻璃门、抽屉、托底轨道",
        "enabled": true
      },
      {
        "name": "榻榻米",
        "standardDepth": 400,
        "reminder": "抽屉、灯带、格栅、上翻门随意停",
        "enabled": true
      },
      {
        "name": "鞋柜",
        "standardDepth": 400,
        "reminder": "灯带、抽屉、旋转鞋架",
        "enabled": true
      },
      {
        "name": "屏风",
        "standardDepth": 400,
        "reminder": "",
        "enabled": true
      },
      {
        "name": "客厅柜",
        "standardDepth": 600,
        "reminder": "",
        "enabled": true
      },
      {
        "name": "其他柜",
        "standardDepth": 600,
        "reminder": "",
        "enabled": true
      }
    ],
    "depthRule": {
      "enabled": true,
      "step": 0,
      "pricePerSqm": 0
    },
    "orderRatio": 90,
    "shipmentRatio": 20,
    "depositAmount": 1000,
    "tailRatio": 10,
    "sheetLayout": "merged",
    "deletePassword": "123456",
    "fullPayThreshold": 3000,
    "logo": "",
    "payQr": "",
    "cabinetNames": [
      "主卧衣柜",
      "次卧衣柜",
      "儿童房衣柜",
      "衣帽间",
      "顶天立地",
      "飘窗柜",
      "榻榻米",
      "书桌柜",
      "电视柜",
      "餐边柜",
      "鞋柜",
      "阳台柜",
      "梳妆台",
      "衣柜",
      "衣柜书台"
    ]
  },
  "priceRules": [
    {
      "id": "pmvtq34nzdz4t",
      "brand": "木长青",
      "cabinetMaterial": "多层实木板",
      "doorMaterial": "欧松板",
      "priceSqm": 438,
      "priceM": "",
      "costSqm": ""
    },
    {
      "id": "pmvtq34nzen6e",
      "brand": "木长青",
      "cabinetMaterial": "多层实木板",
      "doorMaterial": "多功能板（海洋板）",
      "priceSqm": 476,
      "priceM": null,
      "costSqm": ""
    },
    {
      "id": "pmvtq34nzs3bc",
      "brand": "鹏鸿",
      "cabinetMaterial": "多层实木板",
      "doorMaterial": "欧松板",
      "priceSqm": 548,
      "priceM": null,
      "costSqm": ""
    },
    {
      "id": "pmvtq34nzxfg4",
      "brand": "博森",
      "cabinetMaterial": "多层实木板",
      "doorMaterial": "欧松板",
      "priceSqm": 550,
      "priceM": null,
      "costSqm": ""
    },
    {
      "id": "pmvtq34nzwy5j",
      "brand": "博森",
      "cabinetMaterial": "多层实木板",
      "doorMaterial": "多功能板（海洋板）",
      "priceSqm": 588,
      "priceM": null,
      "costSqm": ""
    },
    {
      "id": "pmvtq34nzln10",
      "brand": "千年舟",
      "cabinetMaterial": "多层实木板",
      "doorMaterial": "欧松板",
      "priceSqm": 588,
      "priceM": null,
      "costSqm": ""
    },
    {
      "id": "pmvtq34nzmqjb",
      "brand": "莫干山",
      "cabinetMaterial": "多层实木板",
      "doorMaterial": "欧松板",
      "priceSqm": 598,
      "priceM": null,
      "costSqm": ""
    },
    {
      "id": "pmvtq34nz0c36",
      "brand": "卓顾",
      "cabinetMaterial": "香杉木",
      "doorMaterial": "欧松板",
      "priceSqm": 520,
      "priceM": null,
      "costSqm": ""
    },
    {
      "id": "pmvtq34nzzlq4",
      "brand": "卓顾",
      "cabinetMaterial": "香杉木",
      "doorMaterial": "多功能板（海洋板）",
      "priceSqm": 558,
      "priceM": null,
      "costSqm": ""
    },
    {
      "id": "pmvtq34nzklut",
      "brand": "顾家鹿宝宝",
      "cabinetMaterial": "实木大芯（粟木）",
      "doorMaterial": "欧松板",
      "priceSqm": 550,
      "priceM": null,
      "costSqm": ""
    },
    {
      "id": "pmvtq34nzrkw4",
      "brand": "顾家鹿宝宝",
      "cabinetMaterial": "巴西玫瑰木",
      "doorMaterial": "欧松板",
      "priceSqm": 550,
      "priceM": null,
      "costSqm": ""
    },
    {
      "id": "pmvtq34nzaurn",
      "brand": "顾家鹿宝宝",
      "cabinetMaterial": "巴西玫瑰木",
      "doorMaterial": "多功能板（海洋板）",
      "priceSqm": 588,
      "priceM": null,
      "costSqm": ""
    },
    {
      "id": "pmw0k7ip27uwv",
      "brand": "佰俪优家",
      "cabinetMaterial": "多层实木板",
      "doorMaterial": "欧松板",
      "priceSqm": 470,
      "priceM": "",
      "costSqm": ""
    }
  ],
  "addons": [
    {
      "id": "a01",
      "group": "五金与收纳",
      "name": "星徽缓冲静音三节轨",
      "unit": "副",
      "price": 30,
      "divisor": 1,
      "calcUnit": "副",
      "cost": ""
    },
    {
      "id": "a02",
      "group": "五金与收纳",
      "name": "牛角封边拉手 · 一米以上",
      "unit": "只（门）",
      "price": 80,
      "divisor": 1,
      "calcUnit": "只（门）",
      "cost": ""
    },
    {
      "id": "a03",
      "group": "五金与收纳",
      "name": "牛角封边拉手 · 一米以下",
      "unit": "只（门）",
      "price": 50,
      "divisor": 1,
      "calcUnit": "只（门）",
      "cost": ""
    },
    {
      "id": "a04",
      "group": "五金与收纳",
      "name": "大角度开门铰链",
      "unit": "只（铰链）",
      "price": 20,
      "divisor": 1,
      "calcUnit": "只（铰链）",
      "cost": ""
    },
    {
      "id": "a05",
      "group": "五金与收纳",
      "name": "上翻门随意停",
      "unit": "个",
      "price": 20,
      "divisor": 1,
      "calcUnit": "个",
      "cost": ""
    },
    {
      "id": "a06",
      "group": "五金与收纳",
      "name": "托底轨道",
      "unit": "个（抽屉）",
      "price": 80,
      "divisor": 1,
      "calcUnit": "个（抽屉）",
      "cost": ""
    },
    {
      "id": "a07",
      "group": "五金与收纳",
      "name": "万向轮抽屉",
      "unit": "个（抽屉）",
      "price": 100,
      "divisor": 1,
      "calcUnit": "个（抽屉）",
      "cost": ""
    },
    {
      "id": "a08",
      "group": "五金与收纳",
      "name": "抽屉锁",
      "unit": "个",
      "price": 15,
      "divisor": 1,
      "calcUnit": "个",
      "cost": ""
    },
    {
      "id": "a09",
      "group": "门板工艺",
      "name": "18 框玻璃门",
      "unit": "平方米",
      "price": 168,
      "divisor": 1,
      "calcUnit": "平方米",
      "cost": ""
    },
    {
      "id": "a10",
      "group": "门板工艺",
      "name": "斜切门板",
      "unit": "只（门）",
      "price": 15,
      "divisor": 1,
      "calcUnit": "只（门）",
      "cost": ""
    },
    {
      "id": "a11",
      "group": "门板工艺",
      "name": "骨骼线门",
      "unit": "平方米",
      "price": 288,
      "divisor": 1,
      "calcUnit": "平方米",
      "cost": ""
    },
    {
      "id": "a12",
      "group": "门板工艺",
      "name": "骨骼线藤编门",
      "unit": "平方米",
      "price": 368,
      "divisor": 1,
      "calcUnit": "平方米",
      "cost": ""
    },
    {
      "id": "a13",
      "group": "门板工艺",
      "name": "藤编门",
      "unit": "平方米",
      "price": 328,
      "divisor": 1,
      "calcUnit": "平方米",
      "cost": ""
    },
    {
      "id": "a14",
      "group": "灯光与镜面",
      "name": "4000K 灯带（含电源）",
      "unit": "mm",
      "price": 80,
      "divisor": 1000,
      "calcUnit": "米",
      "cost": ""
    },
    {
      "id": "a15",
      "group": "灯光与镜面",
      "name": "穿衣镜（1 米）",
      "unit": "个",
      "price": 80,
      "divisor": 1,
      "calcUnit": "个",
      "cost": ""
    },
    {
      "id": "a16",
      "group": "灯光与镜面",
      "name": "格栅 / 护墙板",
      "unit": "平方米",
      "price": 480,
      "divisor": 1,
      "calcUnit": "平方米",
      "cost": ""
    },
    {
      "id": "a17",
      "group": "圆弧与见光板",
      "name": "R37 成品圆弧条（分体）",
      "unit": "米",
      "price": 60,
      "divisor": 1,
      "calcUnit": "延米",
      "cost": ""
    },
    {
      "id": "a18",
      "group": "圆弧与见光板",
      "name": "R50 成品圆弧条（分体）",
      "unit": "米",
      "price": 100,
      "divisor": 1,
      "calcUnit": "延米",
      "cost": ""
    },
    {
      "id": "a19",
      "group": "圆弧与见光板",
      "name": "注胶圆弧（仅限 R37–R50）",
      "unit": "米",
      "price": 220,
      "divisor": 1,
      "calcUnit": "延米",
      "cost": ""
    },
    {
      "id": "a20",
      "group": "圆弧与见光板",
      "name": "热弯圆弧（不限弧度）",
      "unit": "米",
      "price": 460,
      "divisor": 1,
      "calcUnit": "延米",
      "cost": ""
    },
    {
      "id": "a21",
      "group": "圆弧与见光板",
      "name": "外贴同色见光板",
      "unit": "平方米",
      "price": 180,
      "divisor": 1,
      "calcUnit": "平方米",
      "cost": ""
    }
  ],
  "brands": [
    {
      "id": "mcq",
      "name": "木长青",
      "line": "板式线",
      "eco": "待确认"
    },
    {
      "id": "ph",
      "name": "鹏鸿",
      "line": "板式线",
      "eco": "HENF"
    },
    {
      "id": "bs",
      "name": "博森",
      "line": "板式线",
      "eco": "HENF"
    },
    {
      "id": "qnz",
      "name": "千年舟",
      "line": "板式线",
      "eco": "ENF"
    },
    {
      "id": "mgs",
      "name": "莫干山",
      "line": "板式线",
      "eco": "HENF"
    },
    {
      "id": "zg",
      "name": "卓顾",
      "line": "实木线",
      "eco": "ENF"
    },
    {
      "id": "gj1",
      "name": "顾家鹿宝宝",
      "line": "实木线",
      "eco": "ENF"
    }
  ],
  "quotations": []
};

const SESSION_DAYS = 7;
const MAX_LOGS = 500;
const BLOB_KEY = 'db.json';
const STORE_NAME = 'wardrobe-quote';

/* ------------------------------------------------------------------ */
/* 存储层                                                               */
/* ------------------------------------------------------------------ */
let _mode = null;
let _store = null;

function onNetlify() {
  return !!(process.env.NETLIFY_BLOBS_CONTEXT || process.env.NETLIFY || process.env.NETLIFY_FUNCTIONS);
}

async function storageMode() {
  if (_mode) return _mode;
  if (onNetlify()) {
    const { getStore } = await import('@netlify/blobs');
    _store = getStore(STORE_NAME);
    _mode = 'blobs';
  } else {
    _mode = 'fs';
  }
  return _mode;
}

async function readRaw() {
  const m = await storageMode();
  if (m === 'blobs') {
    try { return (await _store.get(BLOB_KEY, { type: 'json' })) || null; } catch (e) { return null; }
  }
  const fs = await import('node:fs');
  const path = await import('node:path');
  const dir = process.env.QUOTE_DATA_DIR || path.join(process.cwd(), 'data');
  try { return JSON.parse(fs.readFileSync(path.join(dir, 'db.json'), 'utf8')); } catch (e) { return null; }
}

async function writeRaw(db) {
  const m = await storageMode();
  if (m === 'blobs') { await _store.setJSON(BLOB_KEY, db); return; }
  const fs = await import('node:fs');
  const path = await import('node:path');
  const dir = process.env.QUOTE_DATA_DIR || path.join(process.cwd(), 'data');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'db.json');
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

/* ------------------------------------------------------------------ */
/* 基础工具                                                             */
/* ------------------------------------------------------------------ */
function hashPw(password, salt) { return crypto.scryptSync(String(password), String(salt), 32).toString('hex'); }
function newSalt() { return crypto.randomBytes(16).toString('hex'); }
function b64u(s) { return Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function unb64u(s) { return Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'); }
function uid(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

function signToken(payload, secret) {
  const body = b64u(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(body).digest('hex').slice(0, 32);
  return body + '.' + sig;
}

function verifyToken(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const i = token.lastIndexOf('.');
  if (i <= 0) return null;
  const body = token.slice(0, i), sig = token.slice(i + 1);
  const want = crypto.createHmac('sha256', secret).update(body).digest('hex').slice(0, 32);
  if (sig.length !== want.length) return null;
  try { if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(want))) return null; } catch (e) { return null; }
  try {
    const obj = JSON.parse(unb64u(body));
    if (!obj || !obj.uid || !obj.exp || obj.exp < Date.now()) return null;
    return obj;
  } catch (e) { return null; }
}

function parseCookies(header) {
  const out = {};
  String(header || '').split(';').forEach(part => {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

function json(obj, status, extraHeaders) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, extraHeaders || {})
  });
}

function sessionCookie(req, token, maxAge) {
  const proto = req.headers.get('x-forwarded-proto') || '';
  const secure = proto === 'https' || String(req.url || '').startsWith('https:');
  const parts = ['sid=' + encodeURIComponent(token), 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=' + maxAge];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

/* ------------------------------------------------------------------ */
/* 数据结构 / 迁移                                                      */
/* ------------------------------------------------------------------ */
function seedTenantData() {
  const d = JSON.parse(JSON.stringify(SEED_DB));
  return {
    config: d.config || {},
    priceRules: d.priceRules || [],
    addons: d.addons || [],
    brands: d.brands || [],
    quotations: [],
    updatedAt: new Date().toISOString()
  };
}

function ensureShape(db) {
  let changed = false;
  if (!db || typeof db !== 'object') db = {};
  if (!Array.isArray(db.users)) { db.users = []; changed = true; }
  if (!Array.isArray(db.logs)) { db.logs = []; changed = true; }

  /* 老版本（单账套）迁移 —— 全新安装时也会走这里，用种子数据初始化第一个门店 */
  if (!Array.isArray(db.tenants)) {
    const base = seedTenantData();
    const t1 = { id: 't1', name: '默认门店', createdAt: new Date().toISOString(), disabled: false };
    db.tenants = [t1];
    db.data = {};
    db.data.t1 = {
      config: (db.config && Object.keys(db.config || {}).length) ? db.config : base.config,
      priceRules: (db.priceRules && db.priceRules.length) ? db.priceRules : base.priceRules,
      addons: (db.addons && db.addons.length) ? db.addons : base.addons,
      brands: (db.brands && db.brands.length) ? db.brands : base.brands,
      quotations: db.quotations || [],
      updatedAt: new Date().toISOString()
    };
    db.users = (db.users || []).map((u, i) => Object.assign({}, u, {
      role: i === 0 ? 'super' : (u.role === 'admin' || u.role === 'owner' ? 'owner' : 'designer'),
      tenantId: i === 0 ? null : 't1'
    }));
    delete db.config; delete db.priceRules; delete db.addons; delete db.brands; delete db.quotations;
    changed = true;
  }
  if (!db.data || typeof db.data !== 'object') { db.data = {}; changed = true; }
  db.tenants.forEach(t => {
    if (!db.data[t.id]) { db.data[t.id] = seedTenantData(); changed = true; }
    if (t.disabled === undefined) { t.disabled = false; changed = true; }
  });
  db.users.forEach(u => {
    if (u.disabled === undefined) { u.disabled = false; changed = true; }
    if (u.mustChange === undefined) { u.mustChange = false; changed = true; }
  });

  if (!db.config) db.config = {};
  if (!db.config.sessionSecret) { db.config.sessionSecret = crypto.randomBytes(32).toString('hex'); changed = true; }

  if (!db.users.length) {
    const salt = newSalt();
    db.users.push({
      id: uid('u'), username: 'admin', salt, hash: hashPw('admin888', salt),
      role: 'super', tenantId: null, mustChange: true, disabled: false, createdAt: new Date().toISOString()
    });
    changed = true;
  }
  return changed;
}

function publicUser(u, db) {
  const t = u.tenantId ? (db.tenants || []).find(x => x.id === u.tenantId) : null;
  return {
    id: u.id, username: u.username, role: u.role || 'designer',
    tenantId: u.tenantId || null, tenantName: t ? t.name : '',
    mustChange: !!u.mustChange, disabled: !!u.disabled, createdAt: u.createdAt || ''
  };
}

/* ------------------------------------------------------------------ */
/* 日志                                                                 */
/* ------------------------------------------------------------------ */
function writeLog(db, user, action, detail) {
  if (!Array.isArray(db.logs)) db.logs = [];
  db.logs.unshift({ id: uid('l'), ts: new Date().toISOString(), user: String(user || '?'), action: String(action || ''), detail: String(detail || '') });
  if (db.logs.length > MAX_LOGS) db.logs.length = MAX_LOGS;
}

/* ------------------------------------------------------------------ */
/* 上下文 / 权限                                                        */
/* ------------------------------------------------------------------ */
function ctxOf(db, user, actId) {
  const role = user.role || 'designer';
  if (role === 'super') {
    if (!actId) return { role: 'super', tenantId: null, acting: false };
    const t = (db.tenants || []).find(x => x.id === actId && !x.disabled);
    if (!t) return { role: 'super', tenantId: null, acting: false };
    return { role: 'super', tenantId: actId, acting: true, tenantName: t.name };
  }
  const t = (db.tenants || []).find(x => x.id === user.tenantId);
  return { role, tenantId: user.tenantId || null, acting: false, tenantName: t ? t.name : '', tenantDisabled: t ? !!t.disabled : true };
}

/* 能不能定价 / 看全部单 */
function canPrice(ctx) { return ctx.role !== 'designer'; }

/* 门店是否开启「设计师可直接出价」 */
function designerAuto(db, user) {
  if (!user || (user.role || '') !== 'designer') return false;
  const d = db.data && db.data[user.tenantId];
  return !!(d && d.config && d.config.designerAutoPrice);
}
function seeAll(ctx) { return ctx.role !== 'designer'; }

/* 设计师看不到任何价格 */
/* 设计师隐藏「板材价格表」，但保留增项/五金/规则价格（预设单要能算出金额） */
function stripPrices(d) {
  (d.priceRules || []).forEach(r => { r.priceSqm = null; r.priceM = null; delete r.costSqm; });
  (d.addons || []).forEach(a => { delete a.cost; });
  if (d.config && Array.isArray(d.config.hardwareUpgrades)) d.config.hardwareUpgrades.forEach(u => { delete u.cost; });
  if (d.config && d.config.drawer) delete d.config.drawer.costPrice;
  (d.quotations || []).forEach(q => { delete q.otherCost; });
  return d;
}

/* 报价单归属：自己开的，或指派给自己填写的 */
function canTouchQuote(q, username) {
  return String(q.owner || '') === username || String(q.assignedTo || '') === username;
}
function hasDims(cab) {
  if (!cab) return false;
  const n = v => Number(v) || 0;
  return cab.calcMode === 'meter' ? n(cab.length) > 0 : (n(cab.width) > 0 && n(cab.height) > 0);
}

/* 管理员用：成本字段只给 owner/super */
function stripCost(d) {
  (d.priceRules || []).forEach(r => { delete r.costSqm; });
  (d.addons || []).forEach(a => { delete a.cost; });
  if (d.config && Array.isArray(d.config.hardwareUpgrades)) d.config.hardwareUpgrades.forEach(u => { delete u.cost; });
  if (d.config && d.config.drawer) delete d.config.drawer.costPrice;
  (d.quotations || []).forEach(q => { delete q.otherCost; });
  return d;
}

/* ------------------------------------------------------------------ */
/* 编号                                                               */
/* ------------------------------------------------------------------ */
function nextQuoteNo(d) {
  const now = new Date();
  const dateStr = String(now.getFullYear()) + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
  const prefix = 'QJ-' + dateStr + '-';
  let max = 0;
  (d.quotations || []).forEach(q => {
    const no = String(q.quotationNo || '');
    if (no.indexOf(prefix) === 0) {
      const n = Number(no.slice(prefix.length)) || 0;
      if (n > max) max = n;
    }
  });
  return prefix + String(max + 1).padStart(3, '0');
}

/* ------------------------------------------------------------------ */
/* 差异日志                                                             */
/* ------------------------------------------------------------------ */
function diffLogs(oldD, newD) {
  const out = [];
  const oq = new Map((oldD.quotations || []).map(q => [q.id, q]));
  const nq = new Map((newD.quotations || []).map(q => [q.id, q]));
  nq.forEach((q, id) => {
    const label = (q.quotationNo || '草稿') + (q.customer && q.customer.address ? ' · ' + String(q.customer.address).slice(0, 24) : '');
    if (!oq.has(id)) out.push(['新建报价', label]);
    else if (JSON.stringify(oq.get(id)) !== JSON.stringify(q)) out.push(['修改报价', label]);
  });
  oq.forEach((q, id) => {
    if (!nq.has(id)) out.push(['删除报价', (q.quotationNo || '草稿')]);
  });
  const section = (label, a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) out.push([label, (b || []).length + ' 条']); };
  section('修改价格表', oldD.priceRules, newD.priceRules);
  section('修改增项价格', oldD.addons, newD.addons);
  return out;
}

/* ------------------------------------------------------------------ */
/* 路径                                                                */
/* ------------------------------------------------------------------ */
function apiPath(req) {
  let p = '';
  try { p = new URL(req.url).pathname; } catch (e) { p = req.url || '/'; }
  if (p.startsWith('/.netlify/functions/api')) p = p.slice('/.netlify/functions/api'.length);
  else if (p.startsWith('/api')) p = p.slice('/api'.length);
  return p || '/';
}

/* ------------------------------------------------------------------ */
/* 主处理                                                               */
/* ------------------------------------------------------------------ */
export default async function handler(req) {
  const p = apiPath(req);
  const method = (req.method || 'GET').toUpperCase();

  try {
    if (p === '/health') {
      let mode = 'unknown';
      try { mode = await storageMode(); } catch (e) { mode = 'error'; }
      return json({ ok: true, env: 'netlify', storage: mode, ver: 'mt-1' });
    }

    let db = await readRaw();
    const fresh = !db;
    if (fresh) db = {};
    if (ensureShape(db)) await writeRaw(db);

    /* ---------------- 登录（免登录） ---------------- */
    if (p === '/login' && method === 'POST') {
      let body;
      try { body = JSON.parse(await req.text()); } catch (e) { return json({ ok: false, error: '参数错误' }, 400); }
      const name = String(body.username || '').trim();
      const pw = String(body.password || '');
      const user = (db.users || []).find(x => x.username === name);
      if (!user || hashPw(pw, user.salt) !== user.hash) {
        writeLog(db, name || '(空)', '登录失败', '');
        await writeRaw(db);
        return json({ ok: false, error: '用户名或密码不正确' }, 401);
      }
      if (user.disabled) {
        writeLog(db, user.username, '登录被拒', '账号已停用');
        await writeRaw(db);
        return json({ ok: false, error: '账号已停用，请联系管理员' }, 403);
      }
      if (user.role !== 'super') {
        const t = (db.tenants || []).find(x => x.id === user.tenantId);
        if (!t || t.disabled) return json({ ok: false, error: '所属门店已停用，请联系总管理员' }, 403);
      }
      const token = signToken({ uid: user.id, iat: Date.now(), exp: Date.now() + SESSION_DAYS * 864e5 }, db.config.sessionSecret);
      writeLog(db, user.username, '登录', '');
      await writeRaw(db);
      return json({ ok: true, user: publicUser(user, db) }, 200, { 'Set-Cookie': sessionCookie(req, token, SESSION_DAYS * 86400) });
    }

    /* ---------------- 会话 ---------------- */
    if (p === '/session') {
      const tk = parseCookies(req.headers.get('cookie'))['sid'];
      const payload = verifyToken(tk, db.config.sessionSecret);
      if (!payload) return json({ ok: false, loggedIn: false }, 401);
      const user = (db.users || []).find(x => x.id === payload.uid);
      if (!user || user.disabled) return json({ ok: false, loggedIn: false }, 401);
      const ctx = ctxOf(db, user, payload.act);
      const tenants = user.role === 'super' ? (db.tenants || []).map(t => ({ id: t.id, name: t.name, disabled: !!t.disabled })) : [];
      return json({
        ok: true, loggedIn: true,
        user: publicUser(user, db),
        ctx: { role: ctx.role, tenantId: ctx.tenantId, tenantName: ctx.tenantName || '', acting: !!ctx.acting, canPrice: ctx.role === 'designer' ? designerAuto(db, user) : canPrice(ctx) },
        tenants
      });
    }

    if (p === '/logout' && method === 'POST') {
      return json({ ok: true }, 200, { 'Set-Cookie': 'sid=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0' });
    }

    /* ---------------- 以下需登录 ---------------- */
    const tk = parseCookies(req.headers.get('cookie'))['sid'];
    const payload = verifyToken(tk, db.config.sessionSecret);
    const me = payload ? (db.users || []).find(x => x.id === payload.uid) : null;
    if (!me || me.disabled) return json({ ok: false, error: '未登录' }, 401);

    const ctx = ctxOf(db, me, payload.act);
    const isSuper = ctx.role === 'super';
    const isOwnerLike = ctx.role === 'owner' || (isSuper && ctx.acting);
    const isDesigner = ctx.role === 'designer';

    /* ---- 总账号：门店管理 ---- */
    if (p === '/tenants') {
      if (!isSuper || ctx.acting) return json({ ok: false, error: '需要总账号且未进入门店' }, 403);
      if (method === 'GET') {
        const list = (db.tenants || []).map(t => ({
          id: t.id, name: t.name, disabled: !!t.disabled, createdAt: t.createdAt,
          users: (db.users || []).filter(u => u.tenantId === t.id).length,
          quotes: ((db.data[t.id] || {}).quotations || []).length
        }));
        return json({ ok: true, tenants: list });
      }
      if (method === 'POST') {
        let body;
        try { body = JSON.parse(await req.text()); } catch (e) { return json({ ok: false, error: '参数错误' }, 400); }
        const action = String(body.action || 'create');
        if (action === 'create') {
          const name = String(body.name || '').trim();
          const on = String(body.ownerUsername || '').trim();
          const op = String(body.ownerPassword || '');
          if (!name) return json({ ok: false, error: '请填门店名称' }, 400);
          if (!on || on.length < 2) return json({ ok: false, error: '主账号用户名至少 2 个字' }, 400);
          if (op.length < 6) return json({ ok: false, error: '主账号密码至少 6 位' }, 400);
          if (db.users.some(u => u.username === on)) return json({ ok: false, error: '用户名已存在' }, 400);
          const tid = uid('t');
          db.tenants.push({ id: tid, name: name, createdAt: new Date().toISOString(), disabled: false });
          db.data[tid] = seedTenantData();
          const salt = newSalt();
          db.users.push({ id: uid('u'), username: on, salt, hash: hashPw(op, salt), role: 'owner', tenantId: tid, mustChange: true, disabled: false, createdAt: new Date().toISOString() });
          writeLog(db, me.username, '新建门店', name + '（主账号 ' + on + '）');
          await writeRaw(db);
          return json({ ok: true, tenantId: tid });
        }
        const t = (db.tenants || []).find(x => x.id === body.id);
        if (!t) return json({ ok: false, error: '门店不存在' }, 404);
        if (action === 'disable' || action === 'enable') {
          t.disabled = action === 'disable';
          writeLog(db, me.username, t.disabled ? '停用门店' : '启用门店', t.name);
          await writeRaw(db);
          return json({ ok: true });
        }
        if (action === 'delete') {
          if (db.tenants.length <= 1) return json({ ok: false, error: '至少保留一个门店' }, 400);
          db.tenants = db.tenants.filter(x => x.id !== t.id);
          db.users = db.users.filter(u => u.tenantId !== t.id);
          delete db.data[t.id];
          writeLog(db, me.username, '删除门店', t.name);
          await writeRaw(db);
          return json({ ok: true });
        }
        return json({ ok: false, error: '未知操作' }, 400);
      }
      return json({ ok: false, error: 'Method Not Allowed' }, 405);
    }

    /* ---- 总账号：进入 / 退出门店 ---- */
    if (p === '/act' && method === 'POST') {
      if (!isSuper) return json({ ok: false, error: '需要总账号' }, 403);
      let body;
      try { body = JSON.parse(await req.text()); } catch (e) { return json({ ok: false, error: '参数错误' }, 400); }
      const nextAct = body.tenantId || null;
      if (nextAct) {
        const t = (db.tenants || []).find(x => x.id === nextAct);
        if (!t || t.disabled) return json({ ok: false, error: '门店不存在或已停用' }, 404);
        writeLog(db, me.username, '进入门店', t.name);
      } else {
        writeLog(db, me.username, '退出门店', '');
      }
      await writeRaw(db);
      const pl = { uid: me.id, iat: Date.now(), exp: Date.now() + SESSION_DAYS * 864e5 };
      if (nextAct) pl.act = nextAct;
      const token = signToken(pl, db.config.sessionSecret);
      return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(req, token, SESSION_DAYS * 86400) });
    }

    /* ---- 修改密码 ---- */
    if (p === '/password' && method === 'POST') {
      let body;
      try { body = JSON.parse(await req.text()); } catch (e) { return json({ ok: false, error: '参数错误' }, 400); }
      const oldPw = String(body.oldPassword || '');
      const newPw = String(body.newPassword || '');
      if (newPw.length < 6) return json({ ok: false, error: '新密码至少 6 位' }, 400);
      if (hashPw(oldPw, me.salt) !== me.hash) return json({ ok: false, error: '原密码不正确' }, 400);
      me.salt = newSalt();
      me.hash = hashPw(newPw, me.salt);
      me.mustChange = false;
      me.logoutAt = Date.now();
      writeLog(db, me.username, '修改密码', '');
      await writeRaw(db);
      const token = signToken({ uid: me.id, iat: Date.now(), exp: Date.now() + SESSION_DAYS * 864e5 }, db.config.sessionSecret);
      return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(req, token, SESSION_DAYS * 86400) });
    }

    /* ---- 账号管理 ---- */
    if (p === '/users') {
      const scopeTenant = isSuper ? (ctx.tenantId || null) : me.tenantId;
      if (method === 'GET') {
        if (isDesigner) return json({ ok: false, error: '无权查看' }, 403);
        let list = (db.users || []).slice();
        if (isSuper && !ctx.acting) { /* 总账号看全部 */ }
        else list = list.filter(u => u.tenantId === scopeTenant && u.role !== 'super');
        return json({ ok: true, users: list.map(u => publicUser(u, db)), me: me.id, scope: isSuper && !ctx.acting ? 'all' : 'tenant' });
      }
      if (method === 'POST') {
        if (isDesigner) return json({ ok: false, error: '无权操作' }, 403);
        let body;
        try { body = JSON.parse(await req.text()); } catch (e) { return json({ ok: false, error: '参数错误' }, 400); }
        const action = String(body.action || 'add');

        if (action === 'add') {
          const name = String(body.username || '').trim();
          const pw = String(body.password || '');
          let role = String(body.role || 'designer');
          let tenantId = body.tenantId || scopeTenant;
          if (!name || name.length < 2) return json({ ok: false, error: '用户名至少 2 个字' }, 400);
          if (pw.length < 6) return json({ ok: false, error: '密码至少 6 位' }, 400);
          if (db.users.some(u => u.username === name)) return json({ ok: false, error: '用户名已存在' }, 400);
          if (!isSuper) { role = 'designer'; tenantId = me.tenantId; }
          if (!tenantId || !(db.tenants || []).some(t => t.id === tenantId)) return json({ ok: false, error: '门店不存在' }, 400);
          if (['owner', 'designer'].indexOf(role) < 0) role = 'designer';
          const salt = newSalt();
          db.users.push({ id: uid('u'), username: name, salt, hash: hashPw(pw, salt), role, tenantId, mustChange: true, disabled: false, createdAt: new Date().toISOString() });
          writeLog(db, me.username, '新增账号', name + '（' + (role === 'owner' ? '主账号' : '设计师') + '）');
          await writeRaw(db);
          return json({ ok: true });
        }

        const target = (db.users || []).find(x => x.id === body.id);
        if (!target) return json({ ok: false, error: '账号不存在' }, 404);
        if (!isSuper && target.tenantId !== me.tenantId) return json({ ok: false, error: '无权操作该账号' }, 403);
        if (target.role === 'super') return json({ ok: false, error: '不能操作总账号' }, 400);

        if (action === 'reset') {
          const pw = String(body.password || '');
          if (pw.length < 6) return json({ ok: false, error: '密码至少 6 位' }, 400);
          target.salt = newSalt();
          target.hash = hashPw(pw, target.salt);
          target.mustChange = true;
          target.logoutAt = Date.now();
          writeLog(db, me.username, '重置密码', target.username);
          await writeRaw(db);
          return json({ ok: true });
        }
        if (action === 'disable' || action === 'enable') {
          if (target.id === me.id) return json({ ok: false, error: '不能停用自己' }, 400);
          target.disabled = action === 'disable';
          if (target.disabled) target.logoutAt = Date.now();
          writeLog(db, me.username, target.disabled ? '停用账号' : '启用账号', target.username);
          await writeRaw(db);
          return json({ ok: true });
        }
        if (action === 'setrole') {
          if (!isSuper) return json({ ok: false, error: '只有总账号能改角色' }, 403);
          const role = body.role === 'owner' ? 'owner' : 'designer';
          target.role = role;
          writeLog(db, me.username, '修改角色', target.username + ' → ' + (role === 'owner' ? '主账号' : '设计师'));
          await writeRaw(db);
          return json({ ok: true });
        }
        if (action === 'kick') {
          target.logoutAt = Date.now();
          writeLog(db, me.username, '强制下线', target.username);
          await writeRaw(db);
          return json({ ok: true });
        }
        if (action === 'delete') {
          if (target.id === me.id) return json({ ok: false, error: '不能删除自己' }, 400);
          const tn = target.tenantId;
          const left = (db.users || []).filter(u => u.tenantId === tn && u.role === 'owner');
          if (target.role === 'owner' && left.length <= 1) return json({ ok: false, error: '门店至少要保留一个主账号' }, 400);
          db.users = db.users.filter(x => x.id !== target.id);
          writeLog(db, me.username, '删除账号', target.username);
          await writeRaw(db);
          return json({ ok: true });
        }
        return json({ ok: false, error: '未知操作' }, 400);
      }
      return json({ ok: false, error: 'Method Not Allowed' }, 405);
    }

    /* ---- 报价数据 ---- */
    if (p === '/db') {
      if (isSuper && !ctx.acting) return json({ ok: false, error: '请先选择一个门店', needTenant: true }, 409);
      if (!ctx.tenantId) return json({ ok: false, error: '没有归属门店' }, 403);
      const tenant = (db.tenants || []).find(t => t.id === ctx.tenantId);
      if (!tenant || tenant.disabled) return json({ ok: false, error: '门店已停用' }, 403);
      if (isDesigner) {
        const t = (db.tenants || []).find(x => x.id === me.tenantId);
        if (!t || t.disabled) return json({ ok: false, error: '门店已停用' }, 403);
      }

      const src = db.data[ctx.tenantId] || seedTenantData();

      if (method === 'GET') {
        const out = JSON.parse(JSON.stringify(src));
        out.tenant = { id: tenant.id, name: tenant.name };
        const autoP = isDesigner && designerAuto(db, me);
        if (isDesigner) {
          out.quotations = (out.quotations || []).filter(q => canTouchQuote(q, me.username));
          if (!autoP) stripPrices(out);
        } else {
          stripCost(out);
          if (!isSuper) delete out.config.deletePassword;
        }
        return json(out);
      }

      if (method === 'PUT') {
        let incoming;
        try { incoming = JSON.parse(await req.text()); } catch (e) { return json({ ok: false, error: '参数错误' }, 400); }
        if (!incoming || !Array.isArray(incoming.quotations)) return json({ ok: false, error: '数据格式不正确' }, 400);
        delete incoming.tenant;

        if (isDesigner) {
          const my = String(me.username);
          const own = (incoming.quotations || []).filter(q => canTouchQuote(q, my));
          const others = (src.quotations || []).filter(q => !canTouchQuote(q, my));
          const autoP2 = designerAuto(db, me);
          own.forEach(q => {
            if (!q.owner) q.owner = my;
            if (q.status === 'draft') return;
            const done = Array.isArray(q.cabinets) && q.cabinets.length && q.cabinets.every(hasDims);
            if (q.preset) {
              /* 预设单：尺寸填完 → 已报价；没填完 → 保持待填写 */
              q.status = done ? 'quoted' : 'preset';
            } else {
              q.status = autoP2 ? 'quoted' : 'filled';
            }
          });
          const next = JSON.parse(JSON.stringify(src));
          next.quotations = own.concat(others);
          next.updatedAt = new Date().toISOString();
          const assigned = [];
          next.quotations.forEach(q => {
            if (q && q.status && q.status !== 'draft' && q.status !== 'preset' && !q.quotationNo) {
              q.quotationNo = nextQuoteNo(next);
              if (String(q.owner || '') === String(me.username)) assigned.push({ id: q.id, quotationNo: q.quotationNo });
            }
          });
          db.data[ctx.tenantId] = next;
          diffLogs(src, next).forEach(([a, d]) => writeLog(db, me.username, a, d));
          await writeRaw(db);
          return json({ ok: true, assigned: assigned });
        }

        /* owner / super-acting：整店保存 */
        const next = {
          config: incoming.config || src.config,
          priceRules: incoming.priceRules || src.priceRules,
          addons: incoming.addons || src.addons,
          brands: incoming.brands || src.brands,
          quotations: incoming.quotations,
          updatedAt: new Date().toISOString()
        };
        const assigned = [];
        next.quotations.forEach(q => {
          if (q && q.status && q.status !== 'draft' && q.status !== 'preset' && !q.quotationNo) {
            q.quotationNo = nextQuoteNo(next);
            assigned.push({ id: q.id, quotationNo: q.quotationNo });
          }
        });
        db.data[ctx.tenantId] = next;
        diffLogs(src, next).forEach(([a, d]) => writeLog(db, me.username, a, d));
        await writeRaw(db);
        return json({ ok: true, assigned });
      }
      return json({ ok: false, error: 'Method Not Allowed' }, 405);
    }

    /* ---- 日志 / 成本毛利 ---- */
    if (p === '/logs') {
      if (isDesigner) return json({ ok: false, error: '无权查看' }, 403);
      return json({ ok: true, logs: (db.logs || []).slice(0, 200) });
    }

    if (p === '/pdf' && method === 'POST') {
      return json({ ok: false, error: '当前环境（Netlify）不支持直接下载 PDF，请用「打印 → 另存为 PDF」' }, 501);
    }

    return json({ ok: false, error: '接口不存在: ' + p }, 404);
  } catch (err) {
    return json({ ok: false, error: (err && err.message) || String(err) }, 500);
  }
}

export const config = { path: '/api/*' };
