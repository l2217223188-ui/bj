/* ==========================================================================
   定制衣柜报价系统 —— Netlify Functions 版本（v2 function）
   路由：/api/*（由 config.path 接管）
   存储：Netlify Blobs（生产） / 本地文件（netlify dev 或本地测试）
   ========================================================================== */
import crypto from 'node:crypto';


/* ---------- 首次初始化数据（价格表 / 选项 / 条款） ---------- */
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
/* 存储层：Blobs / 文件                                                  */
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
    try {
      return (await _store.get(BLOB_KEY, { type: 'json' })) || null;
    } catch (e) {
      return null;
    }
  }
  const fs = await import('node:fs');
  const path = await import('node:path');
  const dir = process.env.QUOTE_DATA_DIR || path.join(process.cwd(), 'data');
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, 'db.json'), 'utf8'));
  } catch (e) {
    return null;
  }
}

async function writeRaw(db) {
  const m = await storageMode();
  if (m === 'blobs') {
    await _store.setJSON(BLOB_KEY, db);
    return;
  }
  const fs = await import('node:fs');
  const path = await import('node:path');
  const dir = process.env.QUOTE_DATA_DIR || path.join(process.cwd(), 'data');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'db.json');
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

async function loadDb() {
  const raw = await readRaw();
  if (raw) return raw;
  const db = JSON.parse(JSON.stringify(SEED_DB));
  db.updatedAt = new Date().toISOString();
  return db;
}

async function saveDb(db) {
  await writeRaw(db);
}

/* ------------------------------------------------------------------ */
/* 基础工具                                                             */
/* ------------------------------------------------------------------ */
function hashPw(password, salt) {
  return crypto.scryptSync(String(password), String(salt), 32).toString('hex');
}
function newSalt() { return crypto.randomBytes(16).toString('hex'); }
function b64u(s) { return Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function unb64u(s) { return Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'); }

function signToken(username, secret) {
  const now = Date.now();
  const payload = b64u(JSON.stringify({ u: username, iat: now, exp: now + SESSION_DAYS * 864e5 }));
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex').slice(0, 32);
  return payload + '.' + sig;
}

function verifyToken(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const i = token.lastIndexOf('.');
  if (i <= 0) return null;
  const payload = token.slice(0, i), sig = token.slice(i + 1);
  const want = crypto.createHmac('sha256', secret).update(payload).digest('hex').slice(0, 32);
  if (sig.length !== want.length) return null;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(want))) return null;
  } catch (e) { return null; }
  try {
    const obj = JSON.parse(unb64u(payload));
    if (!obj || !obj.u || !obj.exp || obj.exp < Date.now()) return null;
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
    headers: Object.assign({
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }, extraHeaders || {})
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
/* 初始化 / 用户                                                        */
/* ------------------------------------------------------------------ */
function ensureAuth(db) {
  let changed = false;
  if (!Array.isArray(db.users)) { db.users = []; changed = true; }
  if (!Array.isArray(db.logs)) { db.logs = []; changed = true; }
  if (!db.config) { db.config = {}; changed = true; }
  db.users.forEach(u => { if (u.disabled === undefined) { u.disabled = false; changed = true; } });
  if (!db.config.sessionSecret) {
    db.config.sessionSecret = crypto.randomBytes(32).toString('hex');
    changed = true;
  }
  if (!db.users.length) {
    const salt = newSalt();
    db.users.push({
      id: 'u' + Date.now().toString(36),
      username: 'admin',
      salt: salt,
      hash: hashPw('admin888', salt),
      role: 'admin',
      mustChange: true,
      disabled: false,
      createdAt: new Date().toISOString()
    });
    changed = true;
  }
  if (Array.isArray(db.quotations)) {
    const firstAdmin = db.users.find(u => (u.role || 'admin') === 'admin') || db.users[0];
    const defOwner = firstAdmin ? firstAdmin.username : 'admin';
    db.quotations.forEach(q => { if (q && !q.owner) { q.owner = defOwner; changed = true; } });
  }
  return changed;
}

function publicUser(u) {
  return { id: u.id, username: u.username, role: u.role || 'admin', mustChange: !!u.mustChange, disabled: !!u.disabled, createdAt: u.createdAt || '' };
}

function currentUser(req, db) {
  const tk = parseCookies(req.headers.get('cookie'))['sid'];
  const payload = verifyToken(tk, db.config.sessionSecret);
  if (!payload) return null;
  const u = (db.users || []).find(x => x.username === payload.u);
  if (!u) return null;
  if (u.disabled) return null;
  if (payload.iat && u.logoutAt && payload.iat < u.logoutAt) return null;
  return u;
}

/* ------------------------------------------------------------------ */
/* 日志 / 成本 / 隔离                                                   */
/* ------------------------------------------------------------------ */
function writeLog(db, user, action, detail) {
  if (!Array.isArray(db.logs)) db.logs = [];
  db.logs.unshift({
    id: 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    ts: new Date().toISOString(),
    user: String(user || '?'),
    action: String(action || ''),
    detail: String(detail || '')
  });
  if (db.logs.length > MAX_LOGS) db.logs.length = MAX_LOGS;
}

function logArray(db) {
  return Array.isArray(db.logs) ? db.logs : [];
}

function stripCost(db) {
  (db.priceRules || []).forEach(r => { delete r.costSqm; });
  (db.addons || []).forEach(a => { delete a.cost; });
  if (db.config && Array.isArray(db.config.hardwareUpgrades)) {
    db.config.hardwareUpgrades.forEach(u => { delete u.cost; });
  }
  if (db.config && db.config.drawer) delete db.config.drawer.costPrice;
  (db.quotations || []).forEach(q => { delete q.otherCost; });
  return db;
}

function mergeCost(target, source) {
  const byId = (arr, id) => (arr || []).find(x => x && x.id === id);
  (target.priceRules || []).forEach(r => {
    const src = byId(source.priceRules, r.id);
    if (src && src.costSqm !== undefined) r.costSqm = src.costSqm;
  });
  (target.addons || []).forEach(a => {
    const src = byId(source.addons, a.id);
    if (src && src.cost !== undefined) a.cost = src.cost;
  });
  if (target.config && Array.isArray(target.config.hardwareUpgrades)) {
    target.config.hardwareUpgrades.forEach(u => {
      const src = byId((source.config || {}).hardwareUpgrades, u.id);
      if (src && src.cost !== undefined) u.cost = src.cost;
    });
  }
  if (target.config && target.config.drawer && source.config && source.config.drawer) {
    if (source.config.drawer.costPrice !== undefined) target.config.drawer.costPrice = source.config.drawer.costPrice;
  }
  (target.quotations || []).forEach(q => {
    const src = byId(source.quotations, q.id);
    if (src && src.otherCost !== undefined) q.otherCost = src.otherCost;
  });
  return target;
}

function scopeForUser(db, me) {
  if ((me.role || 'user') === 'admin') return db;
  const my = String(me.username);
  db.quotations = (db.quotations || []).filter(q => String(q.owner || '') === my);
  return db;
}

function nextQuoteNo(db) {
  const d = new Date();
  const dateStr = String(d.getFullYear()) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  const prefix = 'QJ-' + dateStr + '-';
  let max = 0;
  (db.quotations || []).forEach(q => {
    const no = String(q.quotationNo || '');
    if (no.indexOf(prefix) === 0) {
      const n = Number(no.slice(prefix.length)) || 0;
      if (n > max) max = n;
    }
  });
  return prefix + String(max + 1).padStart(3, '0');
}

function diffLogs(oldDb, newDb) {
  const out = [];
  const oq = new Map((oldDb.quotations || []).map(q => [q.id, q]));
  const nq = new Map((newDb.quotations || []).map(q => [q.id, q]));
  nq.forEach((q, id) => {
    const label = (q.quotationNo || '草稿') + (q.customer && q.customer.address ? ' · ' + String(q.customer.address).slice(0, 24) : '');
    if (!oq.has(id)) out.push(['新建报价', label]);
    else if (JSON.stringify(oq.get(id)) !== JSON.stringify(q)) out.push(['修改报价', label]);
  });
  oq.forEach((q, id) => {
    if (!nq.has(id)) out.push(['删除报价', (q.quotationNo || '草稿') + (q.customer && q.customer.address ? ' · ' + String(q.customer.address).slice(0, 24) : '')]);
  });
  const section = (label, a, b) => {
    if (JSON.stringify(a) === JSON.stringify(b)) return;
    out.push([label, (b || []).length ? '共 ' + (b || []).length + ' 条' : '清空']);
  };
  section('修改价格表', oldDb.priceRules, newDb.priceRules);
  section('修改增项价格', oldDb.addons, newDb.addons);
  section('修改五金方案', (oldDb.config || {}).hardwareUpgrades, (newDb.config || {}).hardwareUpgrades);
  const oc = oldDb.config || {}, nc = newDb.config || {};
  const keys = [
    ['storeName', '门店名称'], ['spaces', '空间选项'], ['cabinetNames', '柜子名称库'],
    ['cabinetTypes', '柜体类型'], ['cabinetMaterials', '柜体材质'], ['doorMaterials', '门板材质'],
    ['depositAmount', '定金'], ['orderRatio', '下单比例'], ['tailRatio', '尾款比例'],
    ['fullPayThreshold', '保底门槛'], ['deletePassword', '删除密码'], ['drawer', '抽屉规则'],
    ['depthRule', '超深规则'], ['film', '肤感面'], ['terms', '固定条款'], ['sheetLayout', '报价单版式'],
    ['logo', 'Logo'], ['payQr', '收款二维码']
  ];
  const changed = keys.filter(([k]) => JSON.stringify(oc[k]) !== JSON.stringify(nc[k])).map(([, label]) => label);
  if (changed.length) out.push(['修改设置', changed.join('、')]);
  return out;
}

/* ------------------------------------------------------------------ */
/* 路径解析                                                             */
/* ------------------------------------------------------------------ */
function apiPath(req) {
  let p = '';
  try { p = new URL(req.url).pathname; } catch (e) { p = req.url || '/'; }
  if (p.startsWith('/.netlify/functions/api')) p = p.slice('/.netlify/functions/api'.length);
  else if (p.startsWith('/api')) p = p.slice('/api'.length);
  if (!p) p = '/';
  return p;
}

/* ------------------------------------------------------------------ */
/* 主处理                                                               */
/* ------------------------------------------------------------------ */
export default async function handler(req) {
  const p = apiPath(req);
  const method = (req.method || 'GET').toUpperCase();

  try {
    /* ---------- 不需要登录 ---------- */
    if (p === '/health') {
      let mode = 'unknown';
      try { mode = await storageMode(); } catch (e) { mode = 'error'; }
      return json({ ok: true, env: 'netlify', storage: mode });
    }

    if (p === '/login' && method === 'POST') {
      let body;
      try { body = JSON.parse(await req.text()); } catch (e) { return json({ ok: false, error: '参数错误' }, 400); }
      const name = String(body.username || '').trim();
      const pw = String(body.password || '');
      const db = await loadDb();
      if (ensureAuth(db)) await saveDb(db);
      const user = (db.users || []).find(x => x.username === name);
      if (!user || hashPw(pw, user.salt) !== user.hash) {
        writeLog(db, name || '(空)', '登录失败', 'IP ' + (req.headers.get('x-nf-client-connection-ip') || '?'));
        await saveDb(db);
        return json({ ok: false, error: '用户名或密码不正确' }, 401);
      }
      if (user.disabled) {
        writeLog(db, user.username, '登录被拒', '账号已停用');
        await saveDb(db);
        return json({ ok: false, error: '账号已停用，请联系管理员' }, 403);
      }
      const token = signToken(user.username, db.config.sessionSecret);
      writeLog(db, user.username, '登录', '');
      await saveDb(db);
      return json({ ok: true, user: publicUser(user) }, 200, {
        'Set-Cookie': sessionCookie(req, token, SESSION_DAYS * 86400)
      });
    }

    if (p === '/session') {
      const db = await loadDb();
      if (ensureAuth(db)) await saveDb(db);
      const usr = currentUser(req, db);
      if (!usr) return json({ ok: false, loggedIn: false }, 401);
      return json({ ok: true, loggedIn: true, user: publicUser(usr) });
    }

    if (p === '/logout' && method === 'POST') {
      const db = await loadDb();
      if (ensureAuth(db)) await saveDb(db);
      const who = currentUser(req, db);
      if (who) {
        const tu = (db.users || []).find(x => x.id === who.id);
        if (tu) {
          tu.logoutAt = Date.now();
          writeLog(db, who.username, '退出登录', '');
          await saveDb(db);
        }
      }
      return json({ ok: true }, 200, { 'Set-Cookie': 'sid=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0' });
    }

    /* ---------- 需要登录 ---------- */
    let db = await loadDb();
    if (ensureAuth(db)) await saveDb(db);
    const me = currentUser(req, db);
    if (!me) return json({ ok: false, error: '未登录' }, 401);

    if (p === '/pdf' && method === 'POST') {
      return json({ ok: false, error: '当前环境（Netlify）不支持直接下载 PDF，请用「打印 → 另存为 PDF」' }, 501);
    }

    if (p === '/password' && method === 'POST') {
      let body;
      try { body = JSON.parse(await req.text()); } catch (e) { return json({ ok: false, error: '参数错误' }, 400); }
      const oldPw = String(body.oldPassword || '');
      const newPw = String(body.newPassword || '');
      if (newPw.length < 6) return json({ ok: false, error: '新密码至少 6 位' }, 400);
      if (hashPw(oldPw, me.salt) !== me.hash) return json({ ok: false, error: '原密码不正确' }, 400);
      const u2 = db.users.find(x => x.id === me.id);
      if (!u2) return json({ ok: false, error: '账号不存在' }, 404);
      u2.salt = newSalt();
      u2.hash = hashPw(newPw, u2.salt);
      u2.mustChange = false;
      u2.logoutAt = Date.now();
      writeLog(db, me.username, '修改密码', '');
      await saveDb(db);
      const token = signToken(u2.username, db.config.sessionSecret);
      return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(req, token, SESSION_DAYS * 86400) });
    }

    if (p === '/users') {
      if (method === 'GET') {
        return json({ ok: true, users: db.users.map(publicUser), me: me.id });
      }
      if (method === 'POST') {
        if ((me.role || 'admin') !== 'admin') return json({ ok: false, error: '需要管理员权限' }, 403);
        let body;
        try { body = JSON.parse(await req.text()); } catch (e) { return json({ ok: false, error: '参数错误' }, 400); }
        const name = String(body.username || '').trim();
        const pw = String(body.password || '');
        const action = String(body.action || 'add');

        if (action === 'add') {
          if (!name || name.length < 2) return json({ ok: false, error: '用户名至少 2 个字' }, 400);
          if (pw.length < 6) return json({ ok: false, error: '密码至少 6 位' }, 400);
          if (db.users.some(x => x.username === name)) return json({ ok: false, error: '用户名已存在' }, 400);
          const salt = newSalt();
          db.users.push({ id: 'u' + Date.now().toString(36), username: name, salt: salt, hash: hashPw(pw, salt), role: body.role === 'admin' ? 'admin' : 'user', mustChange: true, disabled: false, createdAt: new Date().toISOString() });
          writeLog(db, me.username, '新增账号', name + '（' + (body.role === 'admin' ? '管理员' : '普通') + '）');
          await saveDb(db);
          return json({ ok: true });
        }

        if (action === 'reset') {
          const target = db.users.find(x => x.id === body.id);
          if (!target) return json({ ok: false, error: '账号不存在' }, 404);
          if (pw.length < 6) return json({ ok: false, error: '密码至少 6 位' }, 400);
          target.salt = newSalt();
          target.hash = hashPw(pw, target.salt);
          target.mustChange = true;
          target.logoutAt = Date.now();
          writeLog(db, me.username, '重置密码', target.username);
          await saveDb(db);
          return json({ ok: true });
        }

        if (action === 'disable' || action === 'enable') {
          const target = db.users.find(x => x.id === body.id);
          if (!target) return json({ ok: false, error: '账号不存在' }, 404);
          if (target.id === me.id) return json({ ok: false, error: '不能停用自己' }, 400);
          target.disabled = (action === 'disable');
          if (target.disabled) target.logoutAt = Date.now();
          writeLog(db, me.username, target.disabled ? '停用账号' : '启用账号', target.username);
          await saveDb(db);
          return json({ ok: true });
        }

        if (action === 'setrole') {
          const target = db.users.find(x => x.id === body.id);
          if (!target) return json({ ok: false, error: '账号不存在' }, 404);
          const role = body.role === 'admin' ? 'admin' : 'user';
          if (target.role === 'admin' && role !== 'admin') {
            const admins = db.users.filter(x => (x.role || 'admin') === 'admin' && !x.disabled);
            if (admins.length <= 1) return json({ ok: false, error: '至少要保留一个管理员' }, 400);
          }
          target.role = role;
          writeLog(db, me.username, '修改角色', target.username + ' → ' + (role === 'admin' ? '管理员' : '普通'));
          await saveDb(db);
          return json({ ok: true });
        }

        if (action === 'kick') {
          const target = db.users.find(x => x.id === body.id);
          if (!target) return json({ ok: false, error: '账号不存在' }, 404);
          target.logoutAt = Date.now();
          writeLog(db, me.username, '强制下线', target.username);
          await saveDb(db);
          return json({ ok: true });
        }

        if (action === 'delete') {
          const target = db.users.find(x => x.id === body.id);
          if (!target) return json({ ok: false, error: '账号不存在' }, 404);
          if (target.id === me.id) return json({ ok: false, error: '不能删除自己' }, 400);
          if (db.users.length <= 1) return json({ ok: false, error: '至少保留一个账号' }, 400);
          const delName = target.username;
          db.users = db.users.filter(x => x.id !== body.id);
          writeLog(db, me.username, '删除账号', delName);
          await saveDb(db);
          return json({ ok: true });
        }

        return json({ ok: false, error: '未知操作' }, 400);
      }
      return json({ ok: false, error: 'Method Not Allowed' }, 405);
    }

    if (p === '/db') {
      if (method === 'GET') {
        const safe = JSON.parse(JSON.stringify(db));
        delete safe.users;
        delete safe.logs;
        delete safe.config.sessionSecret;
        if ((me.role || 'user') !== 'admin') { stripCost(safe); scopeForUser(safe, me); }
        return json(safe);
      }
      if (method === 'PUT') {
        let incoming;
        try { incoming = JSON.parse(await req.text()); } catch (e) { return json({ ok: false, error: '参数错误' }, 400); }
        if (!incoming || typeof incoming !== 'object' || !Array.isArray(incoming.quotations)) {
          return json({ ok: false, error: '数据格式不正确' }, 400);
        }
        delete incoming.users;
        delete incoming.logs;
        if (incoming.config) delete incoming.config.sessionSecret;
        incoming.updatedAt = new Date().toISOString();
        if (!incoming.config) incoming.config = {};
        incoming.config.sessionSecret = db.config.sessionSecret;
        incoming.users = db.users;

        if ((me.role || 'user') !== 'admin') {
          const my = String(me.username);
          const ownIncoming = (incoming.quotations || []).filter(q => String(q.owner || '') === my);
          const othersStored = (db.quotations || []).filter(q => String(q.owner || '') !== my);
          ownIncoming.forEach(q => { q.owner = my; });
          incoming.quotations = ownIncoming.concat(othersStored);
          incoming.priceRules = db.priceRules;
          incoming.addons = db.addons;
          const keepSecret = db.config.sessionSecret;
          incoming.config = JSON.parse(JSON.stringify(db.config));
          incoming.config.sessionSecret = keepSecret;
          incoming.version = db.version;
        }

        const assigned = [];
        incoming.quotations.forEach(q => {
          if (q && q.status && q.status !== 'draft' && !q.quotationNo) {
            q.quotationNo = nextQuoteNo(incoming);
            assigned.push({ id: q.id, quotationNo: q.quotationNo });
          }
        });

        const changes = diffLogs(db, incoming);
        incoming.logs = logArray(db);
        changes.forEach(([act, det]) => writeLog(incoming, me.username, act, det));
        incoming.logs = incoming.logs.slice(0, MAX_LOGS);

        await saveDb(incoming);
        return json({ ok: true, assigned: assigned });
      }
      return json({ ok: false, error: 'Method Not Allowed' }, 405);
    }

    if (p === '/logs') {
      if ((me.role || 'user') !== 'admin') return json({ ok: false, error: '需要管理员权限' }, 403);
      return json({ ok: true, logs: logArray(db).slice(0, 200) });
    }

    return json({ ok: false, error: '接口不存在: ' + p }, 404);
  } catch (err) {
    return json({ ok: false, error: (err && err.message) || String(err) }, 500);
  }
}

export const config = {
  path: '/api/*'
};
