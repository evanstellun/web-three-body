// 移动设备检测和优化
// 调试模式标志
let debugSkipLoading = false;

// 监听 Alt+S 快捷键以跳过加载动画
document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key.toLowerCase() === 's') {
        debugSkipLoading = true;
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.animation = 'hideLoading 0.5s ease-out forwards';
            loadingScreen.style.pointerEvents = 'none';
            document.body.style.backgroundImage = 'radial-gradient(circle at center, rgba(0, 50, 100, 0.3) 0%, rgba(0, 0, 0, 0.9) 70%)';
        }
    }
    
    // 第一视角移动控制
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
        keys[key] = true;
        e.preventDefault(); // 防止页面滚动
    }
});

document.addEventListener('keyup', function(e) {
    // 第一视角移动控制
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
        keys[key] = false;
        e.preventDefault();
    }
});

// 初始加载动画逻辑
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // 3.5秒后隐藏加载动画
    setTimeout(function() {
        if (!debugSkipLoading) {
            loadingScreen.style.animation = 'hideLoading 1s ease-out forwards';
            loadingScreen.style.pointerEvents = 'none';
            
            // 确保背景科技感样式正确应用
            document.body.style.backgroundImage = 'radial-gradient(circle at center, rgba(0, 50, 100, 0.3) 0%, rgba(0, 0, 0, 0.9) 70%)';
        }
    }, 3500);
});

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// 强制移动端竖屏
function enforcePortraitMode() {
    if (isMobile) {
        const isLandscape = window.innerWidth > window.innerHeight;
        if (isLandscape) {
            // 显示横屏提示
            const landscapeWarning = document.getElementById('landscape-warning');
            if (!landscapeWarning) {
                const warningDiv = document.createElement('div');
                warningDiv.id = 'landscape-warning';
                warningDiv.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.9);
                        color: #00ccff;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        z-index: 9999;
                        text-align: center;
                        padding: 20px;
                    ">
                        <div style="font-size: 24px; margin-bottom: 20px; font-weight: bold;">请使用竖屏模式</div>
                        <div style="font-size: 16px; margin-bottom: 30px; line-height: 1.5;">
                            此应用仅支持竖屏模式<br>
                            请将设备旋转为竖屏以获得最佳体验
                        </div>
                        <div style="font-size: 48px; margin-bottom: 30px;">📱</div>
                        <div style="font-size: 14px; color: #888;">
                            旋转设备后此提示将自动消失
                        </div>
                    </div>
                `;
                document.body.appendChild(warningDiv);
            }
        } else {
            // 移除横屏提示
            const landscapeWarning = document.getElementById('landscape-warning');
            if (landscapeWarning) {
                landscapeWarning.remove();
            }
        }
    }
}

// 移动端性能优化配置
const mobileConfig = {
    trailLength: isMobile ? 50 : 100,
    renderQuality: isMobile ? 0.7 : 1.0,
    animationInterval: isMobile ? 16 : 16,
    touchSensitivity: isMobile ? 0.8 : 1.0,
    vibrationEnabled: isMobile && navigator.vibrate
};

// 移动端UI调整
function optimizeForMobile() {
    if (isMobile) {
        // 调整画布尺寸
        const canvas = document.getElementById('simulationCanvas');
        canvas.style.touchAction = 'none';
        
        // 调整字体大小
        document.body.style.fontSize = '14px';
        
        // 优化控制面板
        const controlsContainer = document.getElementById('controls-container');
        controlsContainer.style.maxHeight = '45vh';
        
        // 确保控制面板初始为展开状态
        controlsContainer.classList.remove('collapsed');
        controlsContainer.style.transform = '';
        const toggleBtn = document.getElementById('toggle-controls');
        if (toggleBtn) {
            toggleBtn.textContent = '▼';
        }
        
        // 添加触摸提示
        if (!localStorage.getItem('mobileTipsShown') && !localStorage.getItem('mobileTipsDisabled')) {
            setTimeout(() => {
                showMobileTips();
                localStorage.setItem('mobileTipsShown', 'true');
            }, 2000);
        }
        
        // 强制竖屏模式
        enforcePortraitMode();
        window.addEventListener('orientationchange', enforcePortraitMode);
        window.addEventListener('resize', enforcePortraitMode);
        
        // 确保设置按钮事件监听器正确绑定
        setTimeout(() => {
            setupControlsToggle();
        }, 100);
    }
}

// 显示移动端操作提示
function showMobileTips() {
    const tipDiv = document.createElement('div');
    tipDiv.id = 'mobile-tips';
    tipDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #00ccff;
            padding: 15px;
            border-radius: 10px;
            z-index: 1000;
            text-align: center;
            max-width: 260px;
            border: 1px solid #00ccff;
            box-shadow: 0 0 20px rgba(0, 204, 255, 0.3);
        ">
            <div style="font-size: 16px; margin-bottom: 10px; font-weight: bold;">移动端操作指南</div>
            <div style="font-size: 12px; line-height: 1.4;">
                <div>单指拖拽：旋转视角</div>
                <div>双指缩放：放大缩小</div>
                <div>单击天体：查看信息</div>
                <div>双击天体：聚焦跟随</div>
            </div>
            <button onclick="closeMobileTips()" style="
                margin-top: 10px;
                padding: 6px 12px;
                background: #00ccff;
                color: black;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            ">知道了</button>
            <button onclick="closeMobileTipsPermanently()" style="
                margin-top: 5px;
                padding: 4px 8px;
                background: transparent;
                color: #666;
                border: 1px solid #666;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
            ">不再显示</button>
        </div>
    `;
    document.body.appendChild(tipDiv);
    
    // 2秒后自动消失
    setTimeout(() => {
        if (tipDiv.parentElement) {
            tipDiv.remove();
        }
    }, 2000);
}

// 关闭操作提示
function closeMobileTips() {
    const tipDiv = document.getElementById('mobile-tips');
    if (tipDiv) tipDiv.remove();
}

// 永久关闭操作提示
function closeMobileTipsPermanently() {
    localStorage.setItem('mobileTipsDisabled', 'true');
    closeMobileTips();
}


                

const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = document.getElementById('simulation-container').clientHeight;

// 离屏Canvas缓存系统
const offscreenCache = {
    stars: null, // 恒星缓存
    nebulas: null, // 星云缓存
    shockwaves: null, // 冲击波缓存
    grid: null, // 网格缓存
    
    // 初始化所有离屏Canvas
    init() {
        this.stars = document.createElement('canvas');
        this.stars.width = canvas.width;
        this.stars.height = canvas.height;
        
        this.nebulas = document.createElement('canvas');
        this.nebulas.width = canvas.width;
        this.nebulas.height = canvas.height;
        
        this.shockwaves = document.createElement('canvas');
        this.shockwaves.width = canvas.width;
        this.shockwaves.height = canvas.height;
        
        this.grid = document.createElement('canvas');
        this.grid.width = canvas.width;
        this.grid.height = canvas.height;
    },
    
    // 清除所有缓存
    clearAll() {
        if (this.stars) {
            const ctx = this.stars.getContext('2d');
            ctx.clearRect(0, 0, this.stars.width, this.stars.height);
        }
        if (this.nebulas) {
            const ctx = this.nebulas.getContext('2d');
            ctx.clearRect(0, 0, this.nebulas.width, this.nebulas.height);
        }
        if (this.shockwaves) {
            const ctx = this.shockwaves.getContext('2d');
            ctx.clearRect(0, 0, this.shockwaves.width, this.shockwaves.height);
        }
        if (this.grid) {
            const ctx = this.grid.getContext('2d');
            ctx.clearRect(0, 0, this.grid.width, this.grid.height);
        }
    },
    
    // 调整缓存大小
    resize(width, height) {
        this.stars.width = width;
        this.stars.height = height;
        this.nebulas.width = width;
        this.nebulas.height = height;
        this.shockwaves.width = width;
        this.shockwaves.height = height;
        this.grid.width = width;
        this.grid.height = height;
    }
};

// 初始化离屏缓存
offscreenCache.init();

// 计算结果缓存系统
const calculationCache = {
    projections: new Map(), // 天体投影缓存
    distances: new Map(), // 距离计算缓存
    colors: new Map(), // 颜色解析缓存
    
    // 清除所有缓存
    clearAll() {
        this.projections.clear();
        this.distances.clear();
        this.colors.clear();
    },
    
    // 清除特定天体的缓存
    clearBodyCache(bodyName) {
        this.projections.delete(bodyName);
        // 清除与该天体相关的距离缓存
        for (let key of this.distances.keys()) {
            if (key.includes(bodyName)) {
                this.distances.delete(key);
            }
        }
    }
};

// 对象池系统
const objectPool = {
    // 向量对象池
    vectors: {
        pool: [],
        get() {
            if (this.pool.length > 0) {
                return this.pool.pop();
            }
            return { x: 0, y: 0, z: 0 };
        },
        release(vector) {
            vector.x = 0;
            vector.y = 0;
            vector.z = 0;
            this.pool.push(vector);
        }
    },
    
    // 投影对象池
    projections: {
        pool: [],
        get() {
            if (this.pool.length > 0) {
                return this.pool.pop();
            }
            return { x: 0, y: 0, z: 0, sizeFactor: 1 };
        },
        release(proj) {
            proj.x = 0;
            proj.y = 0;
            proj.z = 0;
            proj.sizeFactor = 1;
            this.pool.push(proj);
        }
    },
    
    // 天体数据对象池
    bodyData: {
        pool: [],
        get() {
            if (this.pool.length > 0) {
                return this.pool.pop();
            }
            return { body: null, projected: null, radius: 0 };
        },
        release(data) {
            data.body = null;
            data.projected = null;
            data.radius = 0;
            this.pool.push(data);
        }
    }
};

// 模拟参数
let bodies = [];
let time = 0;
let speedFactor = 0.1;
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let rotationX = 0;
let rotationY = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let collisions = [];
let centerBody = null; // 用于跟踪聚焦的天体
let selectedBody = null; // 用于跟踪选中的天体
let lastTemperatureMessage = ""; // 用于跟踪上次显示的温度消息
let isFirstPersonView = false; // 是否处于第一视角模式
let firstPersonRotation = 0; // 第一视角下的水平旋转角度
let currentTotalBrightness = 0; // 当前总亮度值，用于地面和天空颜色计算
let previousStarHeights = {}; // 存储上一次的恒星高度角，用于判断变化趋势
let verticalAngle = 0; // 垂直视角角度

// 观察者在内部行星球壳上的位置（经纬度）
let observerLatitude = 0; // 纬度：-π/2 到 π/2
let observerLongitude = 0; // 经度：-π 到 π
const innerSphereRadius = 100; // 内部行星球壳半径

// 文明历史相关变量
let civilizationId = 1;
let civilizationStartTime = 0;
let lastCivilizationRecorded = false;
let isDestructionByExplosion = false; // 跟踪是否由爆炸导致灭亡
let currentDestructionType = null; // 当前灭亡方式: 'explosion', 'high_temp', 'low_temp', 'fragment_impact', 'star_eaten', 'observer_closed'

// 天体轨迹历史记录
const trailLength = mobileConfig.trailLength;
const trails = {}; // 存储每个天体的轨迹点

// 光谱类型定义及其质量范围
const spectralTypes = [
    { name: 'M', minMass: 1000, maxMass: 3000, color: '#FF4500' },    // M型：红色
    { name: 'K', minMass: 3000, maxMass: 8000, color: '#FFA500' },    // K型：橙色
    { name: 'G', minMass: 8000, maxMass: 12000, color: '#FFD700' },   // G型：黄色
    { name: 'F', minMass: 12000, maxMass: 16000, color: '#FFFACD' },  // F型：黄白色
    { name: 'A', minMass: 16000, maxMass: 25000, color: '#FFFFFF' },  // A型：白色
    { name: 'B', minMass: 25000, maxMass: 40000, color: '#87CEEB' },  // B型：蓝白色
    { name: 'O', minMass: 40000, maxMass: 50000, color: '#4169E1' }   // O型：蓝色
];

// 根据恒星质量获取光谱类型
function getSpectralType(mass) {
    for (const spectralType of spectralTypes) {
        if (mass >= spectralType.minMass && mass <= spectralType.maxMass) {
            return spectralType;
        }
    }
    // 如果超出范围，返回最接近的类型
    if (mass < spectralTypes[0].minMass) {
        return spectralTypes[0]; // M型
    }
    return spectralTypes[spectralTypes.length - 1]; // O型
}

// 根据恒星质量获取光谱颜色（均匀渐变）
function getSpectralColor(mass) {
    // 恒星质量范围：1000-50000，涵盖所有光谱类型
    // 质量越大，颜色越偏蓝；质量越小，颜色越偏红
    
    // 将质量映射到0-1范围
    const minMass = 1000;
    const maxMass = 50000;
    const normalizedMass = Math.max(0, Math.min(1, (mass - minMass) / (maxMass - minMass)));
    
    // 定义光谱颜色渐变点（从红色到蓝色）
    // M型（红色）-> K型（橙色）-> G型（黄色）-> F型（黄白色）-> A型（白色）-> B型（蓝白色）-> O型（蓝色）
    const spectralColors = [
        { mass: 0.0, r: 255, g: 69, b: 0 },    // M型：红色 #FF4500
        { mass: 0.17, r: 255, g: 165, b: 0 },  // K型：橙色 #FFA500
        { mass: 0.33, r: 255, g: 215, b: 0 },  // G型：黄色 #FFD700
        { mass: 0.5, r: 255, g: 250, b: 205 }, // F型：黄白色 #FFFACD
        { mass: 0.67, r: 255, g: 255, b: 255 }, // A型：白色 #FFFFFF
        { mass: 0.83, r: 135, g: 206, b: 235 }, // B型：蓝白色 #87CEEB
        { mass: 1.0, r: 65, g: 105, b: 225 }    // O型：深蓝色 #4169E1
    ];
    
    // 找到当前质量对应的两个颜色点
    let lowerColor = spectralColors[0];
    let upperColor = spectralColors[spectralColors.length - 1];
    
    for (let i = 0; i < spectralColors.length - 1; i++) {
        if (normalizedMass >= spectralColors[i].mass && normalizedMass <= spectralColors[i + 1].mass) {
            lowerColor = spectralColors[i];
            upperColor = spectralColors[i + 1];
            break;
        }
    }
    
    // 计算插值比例
    const range = upperColor.mass - lowerColor.mass;
    const t = range > 0 ? (normalizedMass - lowerColor.mass) / range : 0;
    
    // 线性插值计算RGB值
    const r = Math.round(lowerColor.r + (upperColor.r - lowerColor.r) * t);
    const g = Math.round(lowerColor.g + (upperColor.g - lowerColor.g) * t);
    const b = Math.round(lowerColor.b + (upperColor.b - lowerColor.b) * t);
    
    // 返回十六进制颜色
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// 三体名句
const quotes = [
    "不要回答！不要回答！不要回答！",
    "消灭人类暴政，世界属于三体！",
    "我们都是阴沟里的虫子，但总还是得有人仰望星空。",
    "西方人并不比东方人聪明，但是他们却找对了路。",
    "越透明的东西越神秘，宇宙本身就是透明的，",
    "上帝是个无耻的老赌徒，他抛弃了我们！",
    "藏好自己，做好清理。",
    "一知道在哪儿，世界就变得像一张地图那么小了。",
    "给岁月以文明，而不是给文明以岁月。",
    "虫子从来没有被战胜过。",
    "碑是那么小，与其说是为了纪念，更像是为了忘却。",
    "前进！前进！不择手段地前进！",
    "物理学从来就没有存在过，将来也不会存在。",
    "把字刻在石头上。",
    "我不知道你在这儿，知道的话我会常来看你的。",
    "你的无畏来源于无知。",
    "记忆是一条早已干涸的河流，只在毫无生气的河床中剩下零落的砾石。",
    "空不是无，空是一种存在，你得用空这种存在填满自己。",
    "因为只有在这个选择中，人是大写的。",
    "弱小和无知不是生存的障碍，傲慢才是。",
    "毁灭你，与你有何相干？",
    "我有一个梦，也许有一天，灿烂的阳光能照进黑暗森林。",
    "凭什么人类就觉得自己该永远存在下去。",
    "是对规律的渴望，还是对混沌的屈服。",
    "这是人类的落日。",
    "在黑暗中沉淀出了重元素，所以光明不是文明的母亲，黑暗才是。",
    "把海弄干的鱼在海干前上了陆地，从一片黑暗森林奔向另一片黑暗森林。",
    "鱼上了岸，也就不再是鱼。",
    "仅靠生存本身是不能保证生存的，发展是生存的最好保障。",
    "妈妈，我将变成一只萤火虫。",
    "来了，爱了，给了她一颗星星，走了。",
    "在宇宙中，你再快都有比你更快的，你再慢也有比你更慢的。",
    "“藏好自己，做好清理。”",
    "不理睬是最大的轻蔑。",
    "光锥之内就是命运。",
    "虚无是无色彩的，虚无什么都没有，有黑暗，至少意味着出现了空间。",
    "晚霞消失后可以看到星星，朝霞消失以后，就只剩下光天化日下的现实。",
    "在疯狂面前，理智是软弱无力的。",
    "威慑是个舒服的摇篮，人类躺在里面，由大人变成了孩子。",
    "没有了对高处的恐惧就体会不到高处之美。",
    "任何事物，在你开始怀疑并且想突破它的时候，是最吸引人的阶段。",
    "真理总沾着灰。",
    "在每一个历史断面上，你都能找到一大堆丢失的机遇。",
    "不按规则打球，把球放进篮筐也就失去了意义。",
    "当你开始和你的敌人共情的时候，你的是非观就已经被颠覆了。",
    "在意义之塔上，生存高于一切。",
    "面对生存，任何低熵体都只能两害相权取其轻。",
    "仅靠生存本身是不能保证生存的，发展是生存的最好保障。",
    "一个人的鉴别能力是和他的知识成正比的。",
    "生存从来都不是理所当然的事情，是我们误把它当成了理所当然。",
    "大部分人的人生都是偶然，甚至整个人类世界都是偶然。",
    "在巨变的世界中，不变的只有时间流逝的速度。",
    "活着本身就很美妙，如果连这道理都不懂，怎么去探索更深的东西呢？",
    "生活需要平滑，但也需要一个方向，不能总是回到起点。",
    "我正变成死亡，世界的毁灭者。",
    "这一刻，沧海桑田。",
    "一切都将逝去，只有死神永生。",

];
let currentQuoteIndex = 0;
const quoteElement = document.getElementById('quote');

// 天体类
class CelestialBody {
    constructor(name, mass, x, y, z, vx, vy, vz, color) {
        this.name = name;
        this.mass = mass;
        this.x = x;
        this.y = y;
        this.z = z;
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
        this.color = color;
        this.radius = Math.cbrt(mass) * 0.5;
        this.baseTemperature = 0;
    }
}

class Nebula {
    constructor(id, x, y, z, mass, color1, color2, coreBody) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.mass = mass;
        
        this.maxRadius = Math.cbrt(mass) * 15;
        this.currentRadius = 5;
        this.targetRadius = this.maxRadius;
        
        this.expansionSpeed = Math.sqrt(mass) * 0.15;
        this.dragCoefficient = 0.999;
        
        this.color1 = color1;
        this.color2 = color2;
        
        this.temperature = 10000;
        this.particleCount = Math.floor(Math.sqrt(mass) * 10);
        this.age = 0;
        this.isStable = false;
        
        // 保存固定的随机种子，确保形状在整个生命周期内不变
        this.randomSeed = Math.random() * 1000;
        
        // 预计算并存储形状数据，确保不规则形状固定
        this.layerShapeData = [];
        this.layerOffsets = [];
        const layers = 4;
        for (let i = 0; i < layers; i++) {
            const layerOffset = {
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.3,
                z: (Math.random() - 0.5) * 0.5,
                scale: 0.6 + (i / layers) * 0.8,
                rotation: Math.random() * Math.PI * 2
            };
            this.layerOffsets.push(layerOffset);
            
            // 预计算这一层的形状数据 - 存储每个方向的有效半径
            // 使用更复杂的噪声函数生成更真实的星云形状
            const shapeData = [];
            const segments = 32;
            const rings = 20;
            
            // 星云形状参数 - 椭圆形状，长轴在Y方向
            const elongation = 1.5 + Math.random() * 0.5; // 长轴与短轴的比例
            
            for (let ring = 0; ring <= rings; ring++) {
                const phi = (ring / rings) * Math.PI;
                for (let seg = 0; seg <= segments; seg++) {
                    const theta = (seg / segments) * Math.PI * 2;
                    
                    // 将球坐标转换为笛卡尔坐标
                    const x = Math.sin(phi) * Math.cos(theta);
                    const y = Math.cos(phi);
                    const z = Math.sin(phi) * Math.sin(theta);
                    
                    // 应用椭圆变形 - 在Y方向拉伸
                    const yStretched = y * elongation;
                    
                    // 计算变形后的方向向量
                    const length = Math.sqrt(x * x + yStretched * yStretched + z * z);
                    const nx = x / length;
                    const ny = yStretched / length;
                    const nz = z / length;
                    
                    // 生成湍流噪声 - 使用多层正弦波叠加
                    const seed = this.randomSeed * 0.1;
                    const noise1 = Math.sin(theta * 3 + layerOffset.x * 5 + seed);
                    const noise2 = Math.cos(theta * 5 + layerOffset.y * 3 + seed * 1.3);
                    const noise3 = Math.sin(phi * 4 + seed * 0.7);
                    const noise4 = Math.cos(phi * 6 + layerOffset.z * 4 + seed * 1.1);
                    const noise5 = Math.sin(theta * 7 + phi * 3 + seed * 0.9);
                    
                    // 组合噪声 - 主要形状 + 细节湍流
                    const baseNoise = (noise1 + noise2 + noise3) * 0.33;
                    const detailNoise = (noise4 + noise5) * 0.25 * 0.3; // 细节噪声权重较小
                    const noiseVal = baseNoise * 0.7 + detailNoise;
                    
                    // 边缘衰减 - 让星云边缘更柔和
                    const edgeFade = Math.sin(phi) * 0.3 + 0.7;
                    
                    // 计算有效半径 - 基础形状 + 噪声变形
                    let effectiveRadius = 0.9 + noiseVal * 0.2;
                    effectiveRadius *= edgeFade;
                    
                    // 确保半径在合理范围内
                    effectiveRadius = Math.max(0.3, Math.min(1.2, effectiveRadius));
                    
                    shapeData.push(effectiveRadius);
                }
            }
            this.layerShapeData.push(shapeData);
        }
        
        this.coreBody = coreBody;
    }
    
    update(dt) {
        this.age += dt;
        
        // 跟随恒星核移动
        if (this.coreBody) {
            this.x = this.coreBody.x;
            this.y = this.coreBody.y;
            this.z = this.coreBody.z;
        }
        
        if (!this.isStable) {
            const radiusDiff = this.targetRadius - this.currentRadius;
            
            if (radiusDiff > 0.1) {
                const acceleration = radiusDiff * 0.001;
                this.expansionSpeed += acceleration;
                this.expansionSpeed *= this.dragCoefficient;
                this.currentRadius += this.expansionSpeed * dt;
                
                if (this.currentRadius > this.targetRadius) {
                    this.currentRadius = this.targetRadius;
                    this.expansionSpeed = 0;
                }
            } else {
                this.isStable = true;
                this.currentRadius = this.targetRadius;
            }
        }
        
        this.temperature *= 0.999;
    }
    
    getDensity(distance) {
        if (distance > this.currentRadius) return 0;
        const normalizedDist = distance / this.currentRadius;
        return Math.exp(-normalizedDist * normalizedDist * 3) * (this.mass / 10000);
    }
    
    getDragEffect(distance) {
        const density = this.getDensity(distance);
        return density * 0.01;
    }
    
    getHeatingEffect(distance) {
        const density = this.getDensity(distance);
        return density * this.temperature * 0.001;
    }
}

let nebulas = [];
let nebulaIdCounter = 0;
const greekLetters = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];

// 冲击波相关
let shockwaves = [];
let fragmentCounter = 0; // 全局碎片计数器，用于生成 f-1, f-2 等名称

// 粒子系统
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 3000; // 减少最大粒子数以提高性能
        this.lastCleanupTime = 0;
    }
    
    // 创建爆炸粒子
    createExplosion(x, y, z, count, color1, color2, speed) {
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) break;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50;
            const velocity = {
                x: Math.cos(angle) * speed * (0.5 + Math.random() * 0.5),
                y: Math.sin(angle) * speed * (0.5 + Math.random() * 0.5),
                z: (Math.random() - 0.5) * speed * 0.3
            };
            
            const size = 2 + Math.random() * 4;
            const lifetime = 1 + Math.random() * 2;
            const age = 0;
            
            // 混合颜色
            const r1 = parseInt(color1.slice(1, 3), 16);
            const g1 = parseInt(color1.slice(3, 5), 16);
            const b1 = parseInt(color1.slice(5, 7), 16);
            
            const r2 = parseInt(color2.slice(1, 3), 16);
            const g2 = parseInt(color2.slice(3, 5), 16);
            const b2 = parseInt(color2.slice(5, 7), 16);
            
            const r = Math.round(r1 + (r2 - r1) * Math.random());
            const g = Math.round(g1 + (g2 - g1) * Math.random());
            const b = Math.round(b1 + (b2 - b1) * Math.random());
            
            this.particles.push({
                x, y, z,
                velocity,
                size,
                lifetime,
                age,
                color: `rgb(${r}, ${g}, ${b})`,
                type: 'explosion'
            });
        }
    }
    
    // 创建星云粒子
    createNebulaParticles(nebula, count) {
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) break;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * nebula.currentRadius;
            const x = nebula.x + Math.cos(angle) * distance;
            const y = nebula.y + Math.sin(angle) * distance;
            const z = nebula.z + (Math.random() - 0.5) * distance * 0.5;
            
            const velocity = {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
                z: (Math.random() - 0.5) * 1
            };
            
            const size = 1 + Math.random() * 3;
            const lifetime = 3 + Math.random() * 5;
            const age = 0;
            
            // 混合星云颜色
            const r1 = parseInt(nebula.color1.slice(1, 3), 16);
            const g1 = parseInt(nebula.color1.slice(3, 5), 16);
            const b1 = parseInt(nebula.color1.slice(5, 7), 16);
            
            const r2 = parseInt(nebula.color2.slice(1, 3), 16);
            const g2 = parseInt(nebula.color2.slice(3, 5), 16);
            const b2 = parseInt(nebula.color2.slice(5, 7), 16);
            
            const r = Math.round(r1 + (r2 - r1) * Math.random());
            const g = Math.round(g1 + (g2 - g1) * Math.random());
            const b = Math.round(b1 + (b2 - b1) * Math.random());
            
            this.particles.push({
                x, y, z,
                velocity,
                size,
                lifetime,
                age,
                color: `rgb(${r}, ${g}, ${b})`,
                type: 'nebula',
                nebulaId: nebula.id
            });
        }
    }
    
    // 更新粒子
    update(dt) {
        const maxParticlesPerFrame = 500; // 每帧处理的最大粒子数
        let processed = 0;
        
        for (let i = this.particles.length - 1; i >= 0 && processed < maxParticlesPerFrame; i--) {
            const particle = this.particles[i];
            
            // 更新位置
            particle.x += particle.velocity.x * dt;
            particle.y += particle.velocity.y * dt;
            particle.z += particle.velocity.z * dt;
            
            // 更新年龄
            particle.age += dt;
            
            // 应用重力/阻力
            if (particle.type === 'explosion') {
                particle.velocity.x *= 0.99;
                particle.velocity.y *= 0.99;
                particle.velocity.z *= 0.99;
            } else if (particle.type === 'nebula') {
                particle.velocity.x *= 0.98;
                particle.velocity.y *= 0.98;
                particle.velocity.z *= 0.98;
            }
            
            // 移除过期粒子
            if (particle.age > particle.lifetime) {
                this.particles.splice(i, 1);
            }
            
            processed++;
        }
        
        // 定期清理过期粒子
        const now = Date.now();
        if (now - this.lastCleanupTime > 1000) { // 每秒清理一次
            this.particles = this.particles.filter(p => p.age <= p.lifetime);
            this.lastCleanupTime = now;
        }
    }
    
    // 渲染粒子
    render() {
        for (let particle of this.particles) {
            const projected = project3D(particle.x, particle.y, particle.z);
            const size = particle.size * projected.sizeFactor * scale;
            const alpha = 1 - (particle.age / particle.lifetime);
            const lifeProgress = particle.age / particle.lifetime;
            
            // 解析颜色
            let r, g, b;
            const colorMatch = particle.color.match(/rgb\((\d+), (\d+), (\d+)\)/);
            if (colorMatch) {
                r = parseInt(colorMatch[1]);
                g = parseInt(colorMatch[2]);
                b = parseInt(colorMatch[3]);
            } else {
                r = g = b = 255;
            }
            
            if (particle.type === 'explosion') {
                // 爆炸粒子 - 多层发光效果
                this.renderExplosionParticle(projected.x, projected.y, size, r, g, b, alpha, lifeProgress);
            } else if (particle.type === 'nebula') {
                // 星云粒子 - 柔和发光效果
                this.renderNebulaParticle(projected.x, projected.y, size, r, g, b, alpha, lifeProgress);
            }
        }
    }
    
    // 渲染爆炸粒子（带多层发光）
    renderExplosionParticle(x, y, size, r, g, b, alpha, lifeProgress) {
        // 保存当前状态
        ctx.save();
        
        // 1. 核心光晕（最大）
        const coreGlowSize = size * 6;
        const coreGlowAlpha = alpha * 0.1;
        const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, coreGlowSize);
        coreGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${coreGlowAlpha})`);
        coreGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${coreGlowAlpha * 0.5})`);
        coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(x, y, coreGlowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 2. 中间光晕
        const midGlowSize = size * 3;
        const midGlowAlpha = alpha * 0.25;
        const midGradient = ctx.createRadialGradient(x, y, 0, x, y, midGlowSize);
        midGradient.addColorStop(0, `rgba(255, 255, 200, ${midGlowAlpha})`);
        midGradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${midGlowAlpha * 0.6})`);
        midGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = midGradient;
        ctx.beginPath();
        ctx.arc(x, y, midGlowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 3. 内层光晕
        const innerGlowSize = size * 1.5;
        const innerGlowAlpha = alpha * 0.4;
        const innerGradient = ctx.createRadialGradient(x, y, 0, x, y, innerGlowSize);
        innerGradient.addColorStop(0, `rgba(255, 255, 255, ${innerGlowAlpha})`);
        innerGradient.addColorStop(0.5, `rgba(255, 200, 100, ${innerGlowAlpha * 0.7})`);
        innerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(x, y, innerGlowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 4. 粒子核心
        const particleAlpha = alpha;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particleAlpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 恢复状态
        ctx.restore();
    }
    
    // 渲染星云粒子（带柔和发光）
    renderNebulaParticle(x, y, size, r, g, b, alpha, lifeProgress) {
        // 保存当前状态
        ctx.save();
        
        // 柔和的径向渐变
        const glowSize = size * 4;
        const glowAlpha = alpha * 0.3;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${glowAlpha})`);
        gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${glowAlpha * 0.6})`);
        gradient.addColorStop(0.7, `rgba(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)}, ${glowAlpha * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 粒子核心
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 恢复状态
        ctx.restore();
    }
    
    // 清除所有粒子
    clear() {
        this.particles = [];
    }
    
    // 获取粒子数量
    getCount() {
        return this.particles.length;
    }
}

// 初始化粒子系统
const particleSystem = new ParticleSystem();

class Shockwave {
    constructor(id, x, y, z, vx, vy, vz, power, color1, color2) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.vx = vx;  // 冲击波也有速度，跟随爆炸中心移动
        this.vy = vy;
        this.vz = vz;
        this.power = power;
        this.color1 = color1;
        this.color2 = color2;
        this.age = 0;
        this.radius = 0;
        this.shockwaveSpeed = 50;  // 冲击波扩散速度非常快
        this.maxAge = 100;  // 冲击波存在的时间
        this.isActive = true;
        this.hasAffected = new Set();  // 记录已经影响过的天体
        this.temperature = power * 1000;  // 冲击波初始温度
        this.bodyHeatEffects = new Map();  // 记录每个天体的升温效果 { bodyName: { peakTemp, coolTime, lastTime } }
    }
    
    update(dt) {
        // 冲击波跟随爆炸中心移动
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.z += this.vz * dt;
        
        // 冲击波以恒定速度快速向外扩散
        this.radius += this.shockwaveSpeed * dt;
        this.age += dt;
        
        // 冲击波温度随扩张逐渐降低
        const progress = this.age / this.maxAge;
        this.temperature = this.power * 1000 * (1 - progress * 0.8);
        
        if (this.age >= this.maxAge) {
            this.isActive = false;
        }
    }
    
    // 获取冲击波对天体的推力（与距离平方成反比）
    getPushEffect(distance) {
        if (distance > this.radius || distance < this.radius - this.shockwaveSpeed * 2) {
            return 0;  // 只在冲击波前沿附近产生推力
        }
        const basePush = this.power * 1;  // 减小推力
        return basePush / (distance * distance + 10000);  // 增加分母，让推力随距离衰减更快
    }
    
    // 获取冲击波对天体的升温效果
    getHeatingEffect(body, distance) {
        const bodyKey = body.name;
        
        if (distance > this.radius) {
            // 天体已离开冲击波范围，返回冷却效果
            if (this.bodyHeatEffects.has(bodyKey)) {
                const effect = this.bodyHeatEffects.get(bodyKey);
                const timeSincePeak = this.age - effect.lastTime;
                // 冷却速率为每刻减少峰值的10%，最低回到0（快速冷却）
                const coolFactor = Math.max(0, 1 - timeSincePeak * 0.1);
                return effect.peakTemp * coolFactor;
            }
            return 0;
        }
        
        // 天体在冲击波范围内
        const progress = this.age / this.maxAge;
        // 进一步减小升温幅度，特别是对恒星
        const baseHeat = this.power * 10 * (1 - progress * 0.7);  // 极小升温
        // 距离越远升温越少，只有非常近的距离才会有明显升温
        const distanceFactor = Math.max(0, 1 - (distance / this.radius) * 2);
        const currentHeat = baseHeat * distanceFactor * distanceFactor;
        
        if (this.bodyHeatEffects.has(bodyKey)) {
            const effect = this.bodyHeatEffects.get(bodyKey);
            // 更新上次接触时间
            effect.lastTime = this.age;
            // 取最大值作为峰值温度
            if (currentHeat > effect.peakTemp) {
                effect.peakTemp = currentHeat;
            }
            return effect.peakTemp;
        } else {
            // 首次接触，记录峰值温度和时间
            this.bodyHeatEffects.set(bodyKey, {
                peakTemp: currentHeat,
                lastTime: this.age
            });
            return currentHeat;
        }
    }
}

// 初始化天体
let initialBodies = [];

function initBodies() {
    bodies = [
        new CelestialBody('α', 40000, 0, 0, 0, 0, 0, 0, getSpectralColor(40000)),    // O型恒星（蓝色，大质量）
        new CelestialBody('β', 15000, 200, 0, 0, 0, 10, 0, getSpectralColor(15000)),  // B型恒星（蓝白色，中等质量）
        new CelestialBody('γ', 3000, -200, 0, 0, 0, -10, 0, getSpectralColor(3000)),   // K型恒星（橙色，较小质量）
        new CelestialBody('p', 10, 0, 150, 0, -15, 0, 0, '#ffff55')
    ];
    
    // 保存初始状态
    saveInitialBodies();
    
    // 初始化轨迹数组
    for (const body of bodies) {
        trails[body.name] = [];
    }
    updateUI();
    
    // 更新第一视角按钮状态
    updateFirstPersonButtonState();
}

// 保存当前天体状态作为初始状态
function saveInitialBodies() {
    initialBodies = bodies.map(body => ({
        name: body.name,
        mass: body.mass,
        x: body.x,
        y: body.y,
        z: body.z,
        vx: body.vx,
        vy: body.vy,
        vz: body.vz,
        color: body.color
    }));
}

// 更新UI控件值
// 更新UI控件值
function updateUI() {
    // 为每个存在的天体更新UI
    const bodyNames = ['alpha', 'beta', 'gamma', 'p'];
    
    for (let i = 0; i < Math.min(bodies.length, bodyNames.length); i++) {
        const name = bodyNames[i];
        const body = bodies[i];
        
        const massEl = document.getElementById(`${name}-mass`);
        const xEl = document.getElementById(`${name}-x`);
        const yEl = document.getElementById(`${name}-y`);
        const zEl = document.getElementById(`${name}-z`);
        const vxEl = document.getElementById(`${name}-vx`);
        const vyEl = document.getElementById(`${name}-vy`);
        const vzEl = document.getElementById(`${name}-vz`);
        
        if (massEl) massEl.value = body.mass;
        if (xEl) xEl.value = body.x;
        if (yEl) yEl.value = body.y;
        if (zEl) zEl.value = body.z;
        if (vxEl) vxEl.value = body.vx;
        if (vyEl) vyEl.value = body.vy;
        if (vzEl) vzEl.value = body.vz;
    }
}

// 从UI更新天体参数
function updateBodies() {
    const bodyNames = ['alpha', 'beta', 'gamma', 'p'];
    
    for (let i = 0; i < Math.min(bodies.length, bodyNames.length); i++) {
        const name = bodyNames[i];
        
        const massEl = document.getElementById(`${name}-mass`);
        const xEl = document.getElementById(`${name}-x`);
        const yEl = document.getElementById(`${name}-y`);
        const zEl = document.getElementById(`${name}-z`);
        const vxEl = document.getElementById(`${name}-vx`);
        const vyEl = document.getElementById(`${name}-vy`);
        const vzEl = document.getElementById(`${name}-vz`);
        
        if (massEl) bodies[i].mass = parseFloat(massEl.value) || bodies[i].mass;
        if (xEl) bodies[i].x = parseFloat(xEl.value) || bodies[i].x;
        if (yEl) bodies[i].y = parseFloat(yEl.value) || bodies[i].y;
        if (zEl) bodies[i].z = parseFloat(zEl.value) || bodies[i].z;
        if (vxEl) bodies[i].vx = parseFloat(vxEl.value) || bodies[i].vx;
        if (vyEl) bodies[i].vy = parseFloat(vyEl.value) || bodies[i].vy;
        if (vzEl) bodies[i].vz = parseFloat(vzEl.value) || bodies[i].vz;

        // 更新半径
        bodies[i].radius = Math.cbrt(bodies[i].mass) * 0.5;
        
        // 根据质量更新恒星颜色（仅对恒星）
        if (i < 3) { // 恒星
            bodies[i].color = getSpectralColor(bodies[i].mass);
        }
    }
}

// 获取下一个文明编号
function getNextCivilizationId() {
    try {
        const data = localStorage.getItem('civilizationHistory');
        if (data) {
            const history = JSON.parse(data);
            if (history.length > 0) {
                const lastEntry = history[history.length - 1];
                if (lastEntry.currentId !== undefined) {
                    return lastEntry.currentId + 1;
                }
            }
        }
    } catch (e) {
        console.error("Error reading civilization history:", e);
    }
    return 1;
}


// 随机天体
function randomizeBodies() {
    // 如果上一个文明还没有毁灭，记录它繁荣昌盛
    if (!lastCivilizationRecorded && time > 0) {
        const existenceTime = time - civilizationStartTime;
        const era = getCivilizationEra(existenceTime);
        currentDestructionType = 'observer_closed';
        recordCivilization("被观察者关闭", existenceTime.toFixed(2), era);
    }

    // 重置文明计数器和时间
    time = 0;  // 添加这一行，重置时间
    civilizationStartTime = time;
    lastCivilizationRecorded = false; // 重置文明记录标志
    civilizationId = getNextCivilizationId();
    
    // 重置恒星信息相关状态
    const wasShowingStarInfo = isShowingStarInfo;
    isShowingStarInfo = false; // 临时设置为false，防止更新冲突
    previousStarHeights = {}; // 重置高度角记录
    
    // 重置碰撞相关状态
    collisions = []; // 清空碰撞数组
    
    // 重置星云
    nebulas = [];
    nebulaIdCounter = 0;
    
    // 重置冲击波和碎片
    shockwaves = [];
    fragmentCounter = 0;
    
    // 重置updateStarInfo调用计数器
    if (updateStarInfo && typeof updateStarInfo.callCount !== 'undefined') {
        updateStarInfo.callCount = 0;
    }

    // 清空当前所有天体和轨迹
    bodies = [];

    // 清空轨迹数据
    for (let key in trails) {
        delete trails[key];
    }

    const maxAttempts = 100;
    let validConfigFound = false;
    let attempt = 0;

    while (!validConfigFound && attempt < maxAttempts) {
        attempt++;
        
        bodies = [];
        
        const alpha = new CelestialBody('α', 40000, 0, 0, 0, 0, 0, 0, getSpectralColor(40000));
        const beta = new CelestialBody('β', 15000, 0, 0, 0, 0, 0, 0, getSpectralColor(15000));
        const gamma = new CelestialBody('γ', 3000, 0, 0, 0, 0, 0, 0, getSpectralColor(3000));
        const p = new CelestialBody('p', 10, 0, 0, 0, 0, 0, 0, '#00ffff');

        bodies.push(alpha, beta, gamma, p);

        const planetMassMin = 5;
        const planetMassMax = 55;
        const systemSize = Math.random() * 300 + 100;

        for (let i = 0; i < bodies.length; i++) {
            if (i < 3) {
                const randomSpectralType = spectralTypes[Math.floor(Math.random() * spectralTypes.length)];
                bodies[i].mass = Math.random() * (randomSpectralType.maxMass - randomSpectralType.minMass) + randomSpectralType.minMass;
            } else {
                bodies[i].mass = Math.random() * (planetMassMax - planetMassMin) + planetMassMin;
            }

            const distance = Math.random() * systemSize;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            bodies[i].x = distance * Math.sin(phi) * Math.cos(theta);
            bodies[i].y = distance * Math.sin(phi) * Math.sin(theta);
            bodies[i].z = distance * Math.cos(phi);

            const speed = Math.random() * 15 + 5;
            const vTheta = Math.random() * Math.PI * 2;
            const vPhi = Math.random() * Math.PI;

            bodies[i].vx = speed * Math.sin(vPhi) * Math.cos(vTheta);
            bodies[i].vy = speed * Math.sin(vPhi) * Math.sin(vTheta);
            bodies[i].vz = speed * Math.cos(vPhi);

            bodies[i].radius = Math.cbrt(bodies[i].mass) * 0.5;

            if (i < 3) {
                bodies[i].color = getSpectralColor(bodies[i].mass);
            }

            trails[bodies[i].name] = [];
        }

        const temperature = calculateTemperatureWithBodies(bodies);
        if (temperature !== null && temperature >= -100 && temperature <= 100) {
            validConfigFound = true;
        }
    }

    // 重置聚焦天体
    centerBody = null;
    selectedBody = null;
    document.getElementById('body-info').style.display = 'none';

    // 重置温度消息，确保新文明可以触发温度警告
    lastTemperatureMessage = "";

    // 保存当前状态作为新的初始状态
    saveInitialBodies();
    
    updateUI();
    
    // 更新UI中的时间显示
    document.getElementById('time-info').textContent = `时间: ${time.toFixed(2)}`;

    updateFirstPersonButtonState();
    
    // 如果重开一局前正在显示恒星信息，延迟一段时间后重新显示
    if (wasShowingStarInfo) {
        setTimeout(() => {
            isShowingStarInfo = true;
            showStarInfo();
        }, 100); // 短暂延迟，确保天体数据已完全初始化
    }
}
function resetSimulation() {
    time = 0; // 确保时间重置为0
    // 不再重置视角参数
    // scale = 1;
    // offsetX = 0;
    // offsetY = 0;
    // rotationX = 0;
    // rotationY = 0;
    
    centerBody = null;
    selectedBody = null;
    document.getElementById('body-info').style.display = 'none';
    lastTemperatureMessage = ""; // 重置温度消息
    civilizationStartTime = 0;
    lastCivilizationRecorded = false; // 重置文明记录标志
    civilizationId = getNextCivilizationId();
    
    // 重置恒星信息窗口相关变量
    lastBodyNames = undefined;
    
    // 重置碰撞相关状态
    collisions = []; // 清空碰撞数组
    
    // 重置星云
    nebulas = [];
    nebulaIdCounter = 0;
    
    // 重置冲击波和碎片
    shockwaves = [];
    fragmentCounter = 0;
    
    // 重置updateStarInfo调用计数器
    if (updateStarInfo && typeof updateStarInfo.callCount !== 'undefined') {
        updateStarInfo.callCount = 0;
    }
    
    // 使用当前初始数据重新创建天体
    bodies = initialBodies.map(data => new CelestialBody(
        data.name,
        data.mass,
        data.x,
        data.y,
        data.z,
        data.vx,
        data.vy,
        data.vz,
        data.color
    ));
    
    // 清空轨迹数据
    for (let key in trails) {
        delete trails[key];
    }
    
    // 为每个天体初始化轨迹数组
    for (const body of bodies) {
        trails[body.name] = [];
    }
    
    updateUI();
    
    // 更新UI中的时间显示
    document.getElementById('time-info').textContent = `时间: ${time.toFixed(2)}`;
    
    // 更新第一视角按钮状态
    updateFirstPersonButtonState();
}
// 计算两个天体之间的引力
function calculateGravity(body1, body2) {
    const dx = body2.x - body1.x;
    const dy = body2.y - body1.y;
    const dz = body2.z - body1.z;
    const distanceSq = dx * dx + dy * dy + dz * dz;
    const distance = Math.sqrt(distanceSq);

    // 防止距离过近导致数值不稳定
    if (distance < 5) return { fx: 0, fy: 0, fz: 0 };

    // 万有引力定律: F = G * m1 * m2 / r^2
    const G = 1.0; // 增强引力效果
    const force = G * body1.mass * body2.mass / distanceSq;
    const fx = force * dx / distance;
    const fy = force * dy / distance;
    const fz = force * dz / distance;

    return { fx, fy, fz };
}

// 检查碰撞
function checkCollisions() {
    for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
            const body1 = bodies[i];
            const body2 = bodies[j];
            const dx = body2.x - body1.x;
            const dy = body2.y - body1.y;
            const dz = body2.z - body1.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            // 碰撞条件：距离小于两天体半径之和
            const collisionDistance = body1.radius + body2.radius;

            if (distance < collisionDistance && distance > 0) {
                // 记录碰撞信息
                collisions.push({
                    body1: body1.name,
                    body2: body2.name,
                    time: time
                });
                
                // 创建碰撞消息
                let message = "";
                // 检查是否是行星P与其他天体碰撞
                const hasPlanetP = bodies.some(body => body.name === 'p');
                const isPlanetPCollision = body1.name === 'p' || body2.name === 'p';
                
                // 检查是否有天体是碎片
                const isFragment1 = body1.isFragment === true;
                const isFragment2 = body2.isFragment === true;
                
                if (hasPlanetP && ((body1.name === 'p' && isFragment2) || (body2.name === 'p' && isFragment1))) {
                    // 碎片撞击行星P
                    const fragmentBody = body1.name === 'p' ? body2 : body1;
                    message = `被${fragmentBody.name}撞击毁灭`;
                    currentDestructionType = 'fragment_impact';
                } else if (hasPlanetP && ((body1.name === 'p' && body2.name !== 'p') || (body2.name === 'p' && body1.name !== 'p'))) {
                    message = "行星P被恒星吞噬了";
                    currentDestructionType = 'star_eaten';
                } else if ((isFragment1 || isFragment2) && !isPlanetPCollision) {
                    // 碎片与恒星相撞，合并碎片
                    const fragmentBody = isFragment1 ? body1 : body2;
                    const starBody = isFragment1 ? body2 : body1;
                    message = `碎片${fragmentBody.name}撞击了${starBody.name}`;
                } else {
                    message = `${body1.name}和${body2.name}相撞`;
                }

                // 添加文明编号（仅当存在行星P时）
                if (hasPlanetP) {
                    const civilizationMessage = `${message}`;
                    showCollisionMessage(civilizationMessage);
                    
                    // 检查是否是行星P被吞噬且处于第一视角模式
                    if ((body1.name === 'p' || body2.name === 'p') && isFirstPersonView) {
                        showPlanetDestroyedMessage();
                        // toggleFirstPersonView(); // 退出第一视角模式 - 已取消自动回到旁观视角功能
                    }
                } else {
                    showCollisionMessage(message);
                }

                // 记录文明毁灭（仅当存在行星P且未记录过时）
                const hasPlanetPAndNotRecorded = hasPlanetP && !lastCivilizationRecorded;
                if (hasPlanetPAndNotRecorded && (body1.name === 'p' || body2.name === 'p')) {
                    const existenceTime = time - civilizationStartTime;
                    const era = getCivilizationEra(existenceTime);
                    
                    // 如果文明存活时间超过400，不记录毁灭
                    if (existenceTime < 400) {
                        recordCivilization(message, existenceTime.toFixed(2), era);
                    } else {
                        // 对于星际探索文明，记录其进入星际时代但不记录毁灭
                        currentDestructionType = 'interstellar';
                        recordCivilization("飞向了新的家园", "--", era);
                    }
                    lastCivilizationRecorded = true;
                }

                // 检查是否有天体是碎片
                if ((isFragment1 || isFragment2) && !isPlanetPCollision) {
                    // 碎片与恒星相撞，合并碎片
                    const fragmentBody = isFragment1 ? body1 : body2;
                    const starBody = isFragment1 ? body2 : body1;
                    
                    // 检查碎片是否处于无敌状态（创建后10刻内）
                    const fragmentAge = time - (fragmentBody.creationTime || 0);
                    if (fragmentAge < 10) {
                        // 碎片处于无敌状态，跳过此次碰撞处理
                        continue;
                    }
                    
                    // 保存原始质量
                    const origStarMass = starBody.mass;
                    
                    // 合并质量和动量
                    const totalMass = origStarMass + fragmentBody.mass;
                    starBody.x = (starBody.x * origStarMass + fragmentBody.x * fragmentBody.mass) / totalMass;
                    starBody.y = (starBody.y * origStarMass + fragmentBody.y * fragmentBody.mass) / totalMass;
                    starBody.z = (starBody.z * origStarMass + fragmentBody.z * fragmentBody.mass) / totalMass;
                    starBody.vx = (starBody.vx * origStarMass + fragmentBody.vx * fragmentBody.mass) / totalMass;
                    starBody.vy = (starBody.vy * origStarMass + fragmentBody.vy * fragmentBody.mass) / totalMass;
                    starBody.vz = (starBody.vz * origStarMass + fragmentBody.vz * fragmentBody.mass) / totalMass;
                    starBody.mass = totalMass;
                    
                    // 更新恒星属性
                    starBody.color = getSpectralColor(starBody.mass);
                    starBody.radius = Math.cbrt(starBody.mass) * 0.5;
                    
                    // 移除碎片
                    const fragIndex = bodies.indexOf(fragmentBody);
                    if (fragIndex !== -1) {
                        bodies.splice(fragIndex, 1);
                        delete trails[fragmentBody.name];
                        
                        if (centerBody === fragmentBody) centerBody = null;
                        if (selectedBody === fragmentBody) {
                            selectedBody = null;
                            document.getElementById('body-info').style.display = 'none';
                        }
                    }
                    
                    i--;
                    break;
                }
                
                // 检查是否有天体是星云核
                let nebulaWithCore = null;
                let nonCoreBody = null;
                let coreBody = null;
                
                for (let nebula of nebulas) {
                    if (nebula.coreBody === body1) {
                        nebulaWithCore = nebula;
                        coreBody = body1;
                        nonCoreBody = body2;
                        break;
                    }
                    if (nebula.coreBody === body2) {
                        nebulaWithCore = nebula;
                        coreBody = body2;
                        nonCoreBody = body1;
                        break;
                    }
                }
                
                if (nebulaWithCore && !isPlanetPCollision) {
                    // 恒星与星云核碰撞，更新星云数据
                    const totalMass = coreBody.mass + nonCoreBody.mass;
                    const newX = (coreBody.x * coreBody.mass + nonCoreBody.x * nonCoreBody.mass) / totalMass;
                    const newY = (coreBody.y * coreBody.mass + nonCoreBody.y * nonCoreBody.mass) / totalMass;
                    const newZ = (coreBody.z * coreBody.mass + nonCoreBody.z * nonCoreBody.mass) / totalMass;
                    const newVx = (coreBody.vx * coreBody.mass + nonCoreBody.vx * nonCoreBody.mass) / totalMass;
                    const newVy = (coreBody.vy * coreBody.mass + nonCoreBody.vy * nonCoreBody.mass) / totalMass;
                    const newVz = (coreBody.vz * coreBody.mass + nonCoreBody.vz * nonCoreBody.mass) / totalMass;
                    
                    const coreMass = totalMass * 0.2;
                    const nebulaMass = nebulaWithCore.mass + totalMass * 0.8;
                    
                    // 创建冲击波（恒星撞击星云核也产生冲击波）
                    console.log('创建二次爆炸冲击波:', { coreBody: coreBody.name, nonCoreBody: nonCoreBody.name, totalMass, shockwavesCount: shockwaves.length });
                    const shockwaveId = shockwaves.length;
                    const shockwave = new Shockwave(
                        shockwaveId,
                        newX, newY, newZ,
                        newVx, newVy, newVz,
                        totalMass,
                        coreBody.color,
                        nonCoreBody.color
                    );
                    shockwaves.push(shockwave);
                    console.log('冲击波已创建:', { shockwaveId, shockwavesCount: shockwaves.length });
                    
                    // 创建爆炸粒子效果
                    const particleCount = Math.min(200, Math.max(50, Math.floor(totalMass / 1000)));
                    const explosionSpeed = 30 + Math.random() * 20;
                    particleSystem.createExplosion(newX, newY, newZ, particleCount, coreBody.color, nonCoreBody.color, explosionSpeed);
                    
                    // 为Babylon.js场景创建爆炸粒子效果
                    if (babylonInitialized) {
                        createBabylonExplosion(newX, newY, newZ, coreBody.color, nonCoreBody.color);
                    }
                    
                    // 更新星云核
                    coreBody.mass = coreMass;
                    coreBody.x = newX;
                    coreBody.y = newY;
                    coreBody.z = newZ;
                    coreBody.vx = newVx;
                    coreBody.vy = newVy;
                    coreBody.vz = newVz;
                    coreBody.color = getSpectralColor(coreMass);
                    coreBody.radius = Math.cbrt(coreMass) * 0.5;
                    
                    // 更新星云（星云增大但不叠加）
                    nebulaWithCore.mass = nebulaMass;
                    nebulaWithCore.maxRadius = Math.cbrt(nebulaMass) * 15;
                    nebulaWithCore.targetRadius = nebulaWithCore.maxRadius;
                    nebulaWithCore.isStable = false;
                    nebulaWithCore.temperature = Math.max(nebulaWithCore.temperature, 10000);
                    
                    // 混合颜色
                    const r1 = parseInt(nebulaWithCore.color1.slice(1, 3), 16);
                    const g1 = parseInt(nebulaWithCore.color1.slice(3, 5), 16);
                    const b1 = parseInt(nebulaWithCore.color1.slice(5, 7), 16);
                    
                    let r2, g2, b2;
                    if (nonCoreBody.color.startsWith('#')) {
                        r2 = parseInt(nonCoreBody.color.slice(1, 3), 16);
                        g2 = parseInt(nonCoreBody.color.slice(3, 5), 16);
                        b2 = parseInt(nonCoreBody.color.slice(5, 7), 16);
                    } else {
                        r2 = g2 = b2 = 200;
                    }
                    
                    const newR = Math.round((r1 + r2) / 2);
                    const newG = Math.round((g1 + g2) / 2);
                    const newB = Math.round((b1 + b2) / 2);
                    nebulaWithCore.color2 = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
                    
                    // 移除碰撞的非核心恒星
                    const indexToRemove = bodies.indexOf(nonCoreBody);
                    if (indexToRemove !== -1) {
                        bodies.splice(indexToRemove, 1);
                        delete trails[nonCoreBody.name];
                        
                        if (centerBody === nonCoreBody) centerBody = null;
                        if (selectedBody === nonCoreBody) {
                            selectedBody = null;
                            document.getElementById('body-info').style.display = 'none';
                        }
                    }
                    
                    message = `${nonCoreBody.name}撞击星云${nebulaWithCore.id}，星云增大！`;
                    i--;
                    break;
                } else if (!isPlanetPCollision) {
                    // 两颗恒星相撞，创建爆炸、碎片和星云
                    const totalMass = body1.mass + body2.mass;
                    const newX = (body1.x * body1.mass + body2.x * body2.mass) / totalMass;
                    const newY = (body1.y * body1.mass + body2.y * body2.mass) / totalMass;
                    const newZ = (body1.z * body1.mass + body2.z * body2.mass) / totalMass;
                    const newVx = (body1.vx * body1.mass + body2.vx * body2.mass) / totalMass;
                    const newVy = (body1.vy * body1.mass + body2.vy * body2.mass) / totalMass;
                    const newVz = (body1.vz * body1.mass + body2.vz * body2.mass) / totalMass;
                    
                    const coreMass = totalMass * 0.2;
                    const nebulaMass = totalMass * 0.8;
                    
                    // 创建冲击波
                    console.log('创建初次爆炸冲击波:', { body1: body1.name, body2: body2.name, totalMass, shockwavesCount: shockwaves.length });
                    const shockwaveId = shockwaves.length;
                    const shockwave = new Shockwave(
                        shockwaveId,
                        newX, newY, newZ,
                        newVx, newVy, newVz,  // 冲击波也有速度，跟随爆炸中心移动
                        totalMass,
                        body1.color,
                        body2.color
                    );
                    shockwaves.push(shockwave);
                    console.log('冲击波已创建:', { shockwaveId, shockwavesCount: shockwaves.length });
                    
                    // 创建爆炸粒子效果
                    const particleCount = Math.min(300, Math.max(100, Math.floor(totalMass / 800)));
                    const explosionSpeed = 40 + Math.random() * 30;
                    particleSystem.createExplosion(newX, newY, newZ, particleCount, body1.color, body2.color, explosionSpeed);
                    
                    // 为Babylon.js场景创建爆炸粒子效果
                    if (babylonInitialized) {
                        createBabylonExplosion(newX, newY, newZ, body1.color, body2.color);
                    }
                    
                    // 生成碎片：10-20个
                    const fragmentCount = Math.floor(Math.random() * 11) + 10;
                    const planetMass = 10; // 行星基准质量
                    
                    for (let f = 0; f < fragmentCount; f++) {
                        // 使用全局碎片计数器生成名称 f-1, f-2, ...
                        fragmentCounter++;
                        const fragName = `f-${fragmentCounter}`;
                        
                        // 碎片质量：0.1-5倍行星质量
                        const fragMass = (Math.random() * 4.9 + 0.1) * planetMass;
                        
                        // 随机位置（在爆炸中心附近）
                        const fragOffsetRadius = Math.random() * 20 + 10;
                        const fragTheta = Math.random() * Math.PI * 2;
                        const fragPhi = Math.random() * Math.PI;
                        
                        const fragX = newX + fragOffsetRadius * Math.sin(fragPhi) * Math.cos(fragTheta);
                        const fragY = newY + fragOffsetRadius * Math.sin(fragPhi) * Math.sin(fragTheta);
                        const fragZ = newZ + fragOffsetRadius * Math.cos(fragPhi);
                        
                        // 随机速度（低速飞散）
                        const fragSpeed = Math.random() * 5 + 2; // 进一步减小速度
                        const fragVTheta = Math.random() * Math.PI * 2;
                        const fragVPhi = Math.random() * Math.PI;
                        
                        const fragVx = newVx + fragSpeed * Math.sin(fragVPhi) * Math.cos(fragVTheta);
                        const fragVy = newVy + fragSpeed * Math.sin(fragVPhi) * Math.sin(fragVTheta);
                        const fragVz = newVz + fragSpeed * Math.cos(fragVPhi);
                        
                        // 碎片颜色：随机使用两颗恒星的颜色
                        const fragColor = Math.random() < 0.5 ? body1.color : body2.color;
                        
                        // 创建碎片天体
                        const fragment = new CelestialBody(
                            fragName,
                            fragMass,
                            fragX, fragY, fragZ,
                            fragVx, fragVy, fragVz,
                            fragColor
                        );
                        fragment.isFragment = true; // 标记为碎片
                        fragment.creationTime = time; // 记录创建时间，用于无敌状态
                        
                        bodies.push(fragment);
                        trails[fragName] = [];
                    }
                    
                    // 创建恒星核（20%质量）
                    // 按希腊字母顺序查找可用的名称
                    let coreName = null;
                    for (let letter of greekLetters) {
                        if (!bodies.some(b => b.name === letter)) {
                            coreName = letter;
                            break;
                        }
                    }
                    // 如果希腊字母都用完了，使用希腊字母加数字（但这是不太可能的情况）
                    if (!coreName) {
                        let counter = 1;
                        while (!coreName) {
                            for (let letter of greekLetters) {
                                const testName = `${letter}${counter}`;
                                if (!bodies.some(b => b.name === testName)) {
                                    coreName = testName;
                                    break;
                                }
                            }
                            counter++;
                        }
                    }
                    
                    const coreColor = getSpectralColor(coreMass);
                    const newCoreBody = new CelestialBody(
                        coreName,
                        coreMass,
                        newX, newY, newZ,
                        newVx, newVy, newVz,
                        coreColor
                    );
                    bodies.push(newCoreBody);
                    trails[coreName] = [];
                    
                    // 创建星云（80%质量）
                    const nebula = new Nebula(
                        nebulaIdCounter++,
                        newX, newY, newZ,
                        nebulaMass,
                        body1.color,
                        body2.color,
                        newCoreBody
                    );
                    nebulas.push(nebula);
                    
                    // 创建星云粒子效果
                    const nebulaParticleCount = Math.min(500, Math.max(200, Math.floor(nebulaMass / 500)));
                    particleSystem.createNebulaParticles(nebula, nebulaParticleCount);
                    
                    // 为Babylon.js场景创建星云粒子效果
                    if (babylonInitialized) {
                        createBabylonNebulaParticles(nebula);
                    }
                    
                    // 移除碰撞的恒星
                    bodies.splice(j, 1);
                    bodies.splice(i, 1);
                    
                    // 清理轨迹
                    delete trails[body1.name];
                    delete trails[body2.name];
                    
                    // 如果聚焦或选中的天体被移除，重置
                    if (centerBody === body1 || centerBody === body2) {
                        centerBody = null;
                    }
                    if (selectedBody === body1 || selectedBody === body2) {
                        selectedBody = null;
                        document.getElementById('body-info').style.display = 'none';
                    }
                    
                    // 更新消息
                    message = `${body1.name}和${body2.name}相撞，形成星云！`;
                    
                    // 由于数组发生了变化，需要重新开始循环
                    i--;
                    break;
                } else {
                    // 行星P与恒星碰撞，使用原有的合并逻辑
                    const totalMass = body1.mass + body2.mass;
                    const newX = (body1.x * body1.mass + body2.x * body2.mass) / totalMass;
                    const newY = (body1.y * body1.mass + body2.y * body2.mass) / totalMass;
                    const newZ = (body1.z * body1.mass + body2.z * body2.mass) / totalMass;
                    const newVx = (body1.vx * body1.mass + body2.vx * body2.mass) / totalMass;
                    const newVy = (body1.vy * body1.mass + body2.vy * body2.mass) / totalMass;
                    const newVz = (body1.vz * body1.mass + body2.vz * body2.mass) / totalMass;

                    // 创建新的标准天体，使用希腊字母命名
                    let newName = null;
                    for (let letter of greekLetters) {
                        if (!bodies.some(b => b.name === letter)) {
                            newName = letter;
                            break;
                        }
                    }
                    // 如果希腊字母都用完了，使用希腊字母加数字
                    if (!newName) {
                        let counter = 1;
                        while (!newName) {
                            for (let letter of greekLetters) {
                                const testName = `${letter}${counter}`;
                                if (!bodies.some(b => b.name === testName)) {
                                    newName = testName;
                                    break;
                                }
                            }
                            counter++;
                        }
                    }

                    // 根据新质量计算恒星颜色（仅当合并后的天体质量足够大时视为恒星）
                    let newColor = body1.color;
                    if (totalMass >= 1000) {
                        newColor = getSpectralColor(totalMass);
                    }
                    
                    const newBody = new CelestialBody(
                        newName,
                        totalMass,
                        newX, newY, newZ,
                        newVx, newVy, newVz,
                        newColor
                    );

                    // 移除碰撞的天体并添加新天体
                    bodies.splice(j, 1);
                    bodies.splice(i, 1);
                    bodies.push(newBody);

                    // 为新天体创建轨迹数组
                    trails[newName] = [];

                    // 如果聚焦的天体被移除，重置聚焦
                    if (centerBody === body1 || centerBody === body2) {
                        centerBody = null;
                    }

                    // 如果选中的天体被移除，重置选中
                    if (selectedBody === body1 || selectedBody === body2) {
                        selectedBody = null;
                        document.getElementById('body-info').style.display = 'none';
                    }

                    // 由于数组发生了变化，需要重新开始循环
                    i--;
                    break;
                }
            }
        }
    }
    
    // 检查是否有碰撞发生，如果有则执行与"重开一局"相同的重置逻辑
    if (collisions.length > 0) {
        console.log('碰撞处理完成，执行与重开一局相同的重置逻辑');
        
        // 执行与重开一局相同的重置逻辑
        const wasShowingStarInfo = isShowingStarInfo;
        isShowingStarInfo = false; // 临时设置为false，防止更新冲突
        previousStarHeights = {}; // 重置高度角记录
        
        // 重置碰撞相关状态
        collisions = []; // 清空碰撞数组
        
        // 重置updateStarInfo调用计数器
        if (updateStarInfo && typeof updateStarInfo.callCount !== 'undefined') {
            console.log('重置updateStarInfo.callCount从', updateStarInfo.callCount, '到0');
            updateStarInfo.callCount = 0;
        }
        
        // 重置updateStarInfo状态
        isUpdatingStarInfo = false;
        
        // 重置恒星信息窗口相关变量
        lastBodyNames = undefined;
        
        // 如果之前正在显示恒星信息，延迟一段时间后重新显示
        if (wasShowingStarInfo) {
            setTimeout(() => {
                isShowingStarInfo = true;
                showStarInfo();
            }, 100); // 短暂延迟，确保天体数据已完全初始化
        }
    }

    // 更新第一视角按钮状态
    updateFirstPersonButtonState();


}
// 显示碰撞消息
function showCollisionMessage(message) {
    const collisionMessage = document.getElementById('collision-message');
    collisionMessage.textContent = message;
    collisionMessage.style.display = 'block';

    // 碰撞发生后执行与"重开一局"相同的重置逻辑
    if (isShowingStarInfo) {
        console.log('碰撞发生，执行与重开一局相同的重置逻辑');
        
        // 执行与重开一局相同的重置逻辑
        const wasShowingStarInfo = isShowingStarInfo;
        isShowingStarInfo = false; // 临时设置为false，防止更新冲突
        previousStarHeights = {}; // 重置高度角记录
        
        // 重置碰撞相关状态
        collisions = []; // 清空碰撞数组
        
        // 重置updateStarInfo调用计数器
        if (updateStarInfo && typeof updateStarInfo.callCount !== 'undefined') {
            console.log('showCollisionMessage中重置updateStarInfo.callCount从', updateStarInfo.callCount, '到0');
            updateStarInfo.callCount = 0;
        }
        
        // 重置updateStarInfo状态
        isUpdatingStarInfo = false;
        
        // 重置恒星信息窗口相关变量
        lastBodyNames = undefined;
        
        // 如果之前正在显示恒星信息，延迟一段时间后重新显示
        if (wasShowingStarInfo) {
            setTimeout(() => {
                isShowingStarInfo = true;
                showStarInfo();
            }, 100); // 短暂延迟，确保天体数据已完全初始化
        }
    }

    setTimeout(() => {
        collisionMessage.style.display = 'none';
    }, 5000);
}

// 显示行星被吞噬的消息
function showPlanetDestroyedMessage() {
    const message = "行星已经被恒星吞噬\n观察者不存在，第一视角不可用\n请返回到旁观视角查看恒星动态";
    
    // 创建一个临时的消息元素
    const tempMessage = document.createElement('div');
    tempMessage.style.position = 'fixed';
    tempMessage.style.top = '50%';
    tempMessage.style.left = '50%';
    tempMessage.style.transform = 'translate(-50%, -50%)';
    tempMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    tempMessage.style.color = 'white';
    tempMessage.style.padding = '20px';
    tempMessage.style.borderRadius = '10px';
    tempMessage.style.fontSize = '18px';
    tempMessage.style.textAlign = 'center';
    tempMessage.style.lineHeight = '1.5';
    tempMessage.style.zIndex = '9999';
    tempMessage.style.whiteSpace = 'pre-line';
    tempMessage.textContent = message;
    
    document.body.appendChild(tempMessage);
    
    // 5秒后自动移除消息
    setTimeout(() => {
        document.body.removeChild(tempMessage);
    }, 5000);
}

// 显示文明毁灭信息
function showTemperatureMessage() {
    // 如果文明已经记录或没有灭亡方式，则不重复显示
    if (lastCivilizationRecorded || !currentDestructionType) return;

    // 获取所有恒星信息
    const celestialBodies = bodies.filter(body => body.name !== 'p');
    let flyingStarCount = 0;
    let risingStarCount = 0;
    let allBelowMinus10 = true;

    // 检查每颗恒星的状态
    celestialBodies.forEach((body) => {
        // 计算恒星到行星P的距离（如果存在）
        const planetP = bodies.find(b => b.name === 'p');
        let distance = 0;
        let heightAngle = 0;
        
        if (planetP) {
            const dx = body.x - planetP.x;
            const dy = body.y - planetP.y;
            const dz = body.z - planetP.z;
            distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            // 计算高度角（适用于所有视角模式）
            const observerY = dy;
            const observerHorizontalDistance = Math.sqrt(dx * dx + dz * dz);
            
            if (observerHorizontalDistance > 0) {
                heightAngle = Math.atan(observerY / observerHorizontalDistance) * (180 / Math.PI);
            } else if (observerY > 0) {
                heightAngle = 90;
            } else if (observerY < 0) {
                heightAngle = -90;
            }
        }
        
        // 判断飞星
        if (distance > 900) {
            flyingStarCount++;
        }
        
        // 判断升起状态（高度角>=10）
        if (heightAngle >= 10) {
            risingStarCount++;
        }
        
        // 检查是否所有恒星高度角都小于-10
        if (heightAngle >= -10) {
            allBelowMinus10 = false;
        }
    });

    // 定义不同恒星状态下的多种毁灭描述
    const highTemperatureMessages = {
        threeStars: [
            `第${civilizationId}号文明在三日凌空的烈焰中毁灭了`,
            `第${civilizationId}号文明因三日凌空的高温而灭亡`,
            `第${civilizationId}号文明在三颗太阳的炙烤下化为灰烬`,
            `三日凌空，第${civilizationId}号文明在烈焰中消散于无形`,
            `第${civilizationId}号文明在三个太阳的光芒中燃烧殆尽`,
            `三颗太阳在地平线上升起，第${civilizationId}号文明的一切都在高温中升华`
        ],
        twoStars: [
            `第${civilizationId}号文明在双日凌空的烈焰中毁灭了`,
            `第${civilizationId}号文明因双日凌空的高温而灭亡`,
            `第${civilizationId}号文明在两轮太阳的炙烤下消亡`,
            `第${civilizationId}号文明在双日的烈焰中消失了`
        ],
        oneStar: [
            `第${civilizationId}号文明在一轮巨日下毁灭了`,
            `行星从恒星附近掠过，烈焰抹去了第${civilizationId}号文明的一切痕迹`,
            `第${civilizationId}号文明在一颗巨星的炙烤下化为灰烬`,
            `飞星不动，第${civilizationId}号文明在悬停的太阳下消亡`,
            `第${civilizationId}号文明在巨日的光芒中燃烧殆尽`
        ],
        default: [
            `第${civilizationId}号文明在阳光的烈焰下毁灭了`,
            `第${civilizationId}号文明在乱纪元的高温中消亡`,
            `第${civilizationId}号文明在太阳的炙烤下消失了`,
            `第${civilizationId}号文明在烈焰中化为灰烬`
        ]
    };

    const lowTemperatureMessages = {
        threeFlyingStars: [
            `第${civilizationId}号文明在三颗飞星的永恒寒夜中毁灭了`,
            `第${civilizationId}号文明在永恒的寒夜中化为冰雕`,
            `三颗飞星升起，第${civilizationId}号文明在无尽的寒冷中消亡`,
            `第${civilizationId}号文明在宇宙的冰墓中沉睡了`
        ],
        allBelowHorizon: [
            `第${civilizationId}号文明的太阳落下后再也没有升起`,
            `第${civilizationId}号文明在永夜的黑暗中被冻结`,
            `第${civilizationId}号文明的世界陷入了永恒的黑暗与寒冷`,
            `第${civilizationId}号文明在漫长的寒夜中消亡了`
        ],
        default: [
            `第${civilizationId}号文明被冻结在了无尽的凛冬中`,
            `第${civilizationId}号文明在乱纪元的严寒中消亡`,
            `第${civilizationId}号文明被冰封在了时间的长河中`,
            `第${civilizationId}号文明在寒冷中沉睡，再也没有醒来`,
            `第${civilizationId}号文明被冻结成了永恒的雕塑`
        ]
    };

    const explosionMessages = [
        `第${civilizationId}号文明在恒星爆炸的烈焰中化为了灰烬`,
        `第${civilizationId}号文明被超新星爆发的光芒吞没了`,
        `第${civilizationId}号文明在恒星相撞引发的爆炸中毁灭了`,
        `第${civilizationId}号文明在超新星爆炸中消失了，就像从未存在过一样......`,
        `第${civilizationId}号文明在恒星碰撞的璀璨光芒中化为宇宙尘埃`,
        `超新星爆发，第${civilizationId}号文明在亿万个太阳的光芒中消散`,
        `第${civilizationId}号文明在恒星相撞的冲击波中化为齑粉`,
        `第${civilizationId}号文明在宇宙的焰火中迎来了终结`
    ];

    const fragmentImpactMessages = [
        `第${civilizationId}号文明被飞来的碎片撞击毁灭了`,
        `第${civilizationId}号文明在天体碎片的撞击下化为了灰烬`,
        `第${civilizationId}号文明被宇宙碎片终结了`,
        `第${civilizationId}号文明在天外来客的撞击下化为齑粉`,
        `第${civilizationId}号文明被飞来的巨石终结了`,
        `第${civilizationId}号文明在宇宙碎片的撞击下烟消云散`,
        `第${civilizationId}号文明被一颗流浪的天体碎片终结了`
    ];

    const starEatenMessages = [
        `第${civilizationId}号文明的行星被恒星吞噬了`,
        `第${civilizationId}号文明的世界坠入了太阳的火海`,
        `第${civilizationId}号文明在恒星的怀抱中化为灰烬`,
        `第${civilizationId}号文明的行星被恒星的引力拉入了火海`
    ];

    const observerClosedMessages = [
        `由于没有留下任何痕迹与记载，无人知晓第${civilizationId}号文明的结局`
    ];

    // 根据灭亡方式选择合适的消息集合并随机选择一条消息
    let finalMessage;
    if (currentDestructionType === 'explosion') {
        finalMessage = explosionMessages[Math.floor(Math.random() * explosionMessages.length)];
    } else if (currentDestructionType === 'high_temp') {
        let messageList;
        if (risingStarCount === 3) {
            messageList = highTemperatureMessages.threeStars;
        } else if (risingStarCount === 2) {
            messageList = highTemperatureMessages.twoStars;
        } else if (risingStarCount === 1) {
            messageList = highTemperatureMessages.oneStar;
        } else {
            messageList = highTemperatureMessages.default;
        }
        finalMessage = messageList[Math.floor(Math.random() * messageList.length)];
    } else if (currentDestructionType === 'low_temp') {
        let messageList;
        if (flyingStarCount === 3) {
            messageList = lowTemperatureMessages.threeFlyingStars;
        } else if (allBelowMinus10) {
            messageList = lowTemperatureMessages.allBelowHorizon;
        } else {
            messageList = lowTemperatureMessages.default;
        }
        finalMessage = messageList[Math.floor(Math.random() * messageList.length)];
    } else if (currentDestructionType === 'fragment_impact') {
        finalMessage = fragmentImpactMessages[Math.floor(Math.random() * fragmentImpactMessages.length)];
    } else if (currentDestructionType === 'star_eaten') {
        finalMessage = starEatenMessages[Math.floor(Math.random() * starEatenMessages.length)];
    } else if (currentDestructionType === 'observer_closed') {
        finalMessage = observerClosedMessages[Math.floor(Math.random() * observerClosedMessages.length)];
    } else {
        finalMessage = `第${civilizationId}号文明灭亡了`;
    }

    // 添加文明所处的时代信息
    const existenceTime = time - civilizationStartTime;
    const era = getCivilizationEra(existenceTime);
    
    finalMessage += `，该文明发展到${era}`;

    const temperatureMessage = document.getElementById('temperature-message');
    temperatureMessage.textContent = finalMessage;
    temperatureMessage.style.display = 'block';

    // 记录文明毁灭 - 但需要确保文明存在了一定时间才记录
    if (!lastCivilizationRecorded && existenceTime > 0.1) {
        recordCivilization(finalMessage, existenceTime.toFixed(2), era);
        lastCivilizationRecorded = true;
    }

    setTimeout(() => {
        temperatureMessage.style.display = 'none';
    }, 5000);
}// 记录文明历史
function recordCivilization(destructionMethod, existenceTime, era) {
    try {
        let history = [];
        const data = localStorage.getItem('civilizationHistory');
        if (data) {
            history = JSON.parse(data);
        }

        // 添加新的文明记录 - 同时保存灭亡消息和灭亡类型
        const record = {
            id: civilizationId,
            destruction: destructionMethod,
            destructionType: currentDestructionType,
            existenceTime: existenceTime,
            era: era
        };
        
        history.push(record);

        // 更新当前ID
        history.push({
            currentId: civilizationId
        });

        localStorage.setItem('civilizationHistory', JSON.stringify(history));
    } catch (e) {
        console.error("Error recording civilization:", e);
    }
}
// 计算恒星表面温度（基于恒星质量和光谱类型）
function calculateStarTemperature(star) {
    // 基于恒星质量确定光谱类型，然后在对应温度范围内随机取值
    // 质量越大，温度越高，按照恒星光谱分类
    
    // 限制质量范围（以太阳质量为单位）
    const normalizedMass = Math.max(0.1, Math.min(100, star.mass));
    
    // 根据质量确定光谱类型和温度范围（开尔文温度）
    let spectralType, minTempK, maxTempK;
    
    if (normalizedMass >= 16) {
        // O型星：最热、质量最大的恒星
        spectralType = 'O';
        minTempK = 25000;
        maxTempK = 40000;
    } else if (normalizedMass >= 2.1) {
        // B型星：蓝白色恒星
        spectralType = 'B';
        minTempK = 12000;
        maxTempK = 25000;
    } else if (normalizedMass >= 1.4) {
        // A型星：白色恒星
        spectralType = 'A';
        minTempK = 7700;
        maxTempK = 11500;
    } else if (normalizedMass >= 1.04) {
        // F型星：黄白色恒星
        spectralType = 'F';
        minTempK = 6100;
        maxTempK = 7600;
    } else if (normalizedMass >= 0.8) {
        // G型星：黄色恒星（如太阳）
        spectralType = 'G';
        minTempK = 5000;
        maxTempK = 6000;
    } else if (normalizedMass >= 0.45) {
        // K型星：橙色恒星
        spectralType = 'K';
        minTempK = 3700;
        maxTempK = 4900;
    } else {
        // M型星：红色恒星（最常见）
        spectralType = 'M';
        minTempK = 2500;
        maxTempK = 3600;
    }
    
    // 在该光谱类型的温度范围内随机取值
    const temperatureK = minTempK + Math.random() * (maxTempK - minTempK);
    
    // 转换为摄氏度
    const temperatureC = temperatureK - 273.15;
    
    return temperatureC.toFixed(2);
}

// 计算行星P的表面温度（基于所有其他天体的综合影响）
function calculatePlanetPTemperature() {
    const planetP = bodies.find(body => body.name === 'p');
    if (!planetP) return { temp: '--', isExplosion: false };
    if (bodies.length <= 1) return { temp: '--', isExplosion: false };
    let totalEnergy = 0;
    for (const body of bodies) {
        if (body.name === 'p') continue;
        const dx = planetP.x - body.x;
        const dy = planetP.y - body.y;
        const dz = planetP.z - body.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (distance === 0) continue;
        const energy = 50 * body.mass / (distance * distance);
        totalEnergy += energy;
    }
    
    // 添加星云的升温效果
    let nebulaHeating = 0;
    for (const nebula of nebulas) {
        const dx = planetP.x - nebula.x;
        const dy = planetP.y - nebula.y;
        const dz = planetP.z - nebula.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance < nebula.currentRadius + planetP.radius) {
            nebulaHeating += nebula.getHeatingEffect(distance);
        }
    }
    
    // 添加冲击波的升温效果
    let shockwaveHeating = 0;
    let hasActiveShockwave = false;
    for (const shockwave of shockwaves) {
        if (!shockwave.isActive) continue;
        
        const dx = planetP.x - shockwave.x;
        const dy = planetP.y - shockwave.y;
        const dz = planetP.z - shockwave.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        const heating = shockwave.getHeatingEffect(planetP, distance);
        shockwaveHeating += heating;
        if (heating > 0) hasActiveShockwave = true;
    }
    
    if (typeof planetP.baseTemperature !== 'undefined') {
        nebulaHeating += planetP.baseTemperature * 0.1;
    }
    
    // 添加行星P自身的冲击波温度
    let planetPShockwaveTemp = 0;
    if (typeof planetP.shockwaveTemp !== 'undefined') {
        planetPShockwaveTemp = planetP.shockwaveTemp;
    }
    
    if (totalEnergy === 0 && nebulaHeating === 0 && shockwaveHeating === 0 && planetPShockwaveTemp === 0) return { temp: '--', isExplosion: false };
    
    const temperatureK = 150 * Math.pow(totalEnergy + (nebulaHeating + shockwaveHeating + planetPShockwaveTemp) * 0.01, 0.25);
    const temperatureC = temperatureK - 273.15;
    
    // 判断是否主要由冲击波导致高温：只要有冲击波温度就判定为爆炸
    const isExplosion = planetPShockwaveTemp > 0;
    
    return { temp: temperatureC.toFixed(2), isExplosion: isExplosion };
}

function calculateTemperatureWithBodies(bodiesArray) {
    const planetP = bodiesArray.find(body => body.name === 'p');
    if (!planetP) return null;
    if (bodiesArray.length <= 1) return null;
    let totalEnergy = 0;
    for (const body of bodiesArray) {
        if (body.name === 'p') continue;
        const dx = planetP.x - body.x;
        const dy = planetP.y - body.y;
        const dz = planetP.z - body.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (distance === 0) continue;
        const energy = 50 * body.mass / (distance * distance);
        totalEnergy += energy;
    }
    if (totalEnergy === 0) return null;
    const temperatureK = 150 * Math.pow(totalEnergy, 0.25);
    const temperatureC = temperatureK - 273.15;
    return temperatureC;
}
function getPlanetPColor(temperatureC) {
    // 将摄氏度转换为开尔文
    const temperatureK = temperatureC + 273.15;
    
    // 深蓝色到青色 (0K to 0°C/273.15K)
    if (temperatureK <= 273.15) {
        const ratio = temperatureK / 273.15;
        // 深蓝色 (0, 0, 100) 到青色 (0, 255, 255)
        const r = 0;
        const g = Math.floor(ratio * 255);
        const b = 100 + Math.floor(ratio * 155);
        return `rgb(${r}, ${g}, ${b})`;
    }
    // 青色到绿色到黄绿色 (0°C to 100°C)
    else if (temperatureK <= 373.15) {
        const ratio = (temperatureK - 273.15) / 100;
        if (ratio <= 0.5) {
            // 青色 (0, 255, 255) 到绿色 (0, 255, 0)
            const r = 0;
            const g = 255;
            const b = 255 - Math.floor(ratio * 2 * 255);
            return `rgb(${r}, ${g}, ${b})`;
        } else {
            // 绿色 (0, 255, 0) 到黄绿色 (150, 255, 0)
            const r = Math.floor((ratio - 0.5) * 2 * 150);
            const g = 255;
            const b = 0;
            return `rgb(${r}, ${g}, ${b})`;
        }
    }
    // 黄绿色到红色 (100°C to 1000K/726.85°C)
    else {
        const maxTemp = 1000;
        const ratio = Math.min(1, (temperatureK - 373.15) / (maxTemp - 373.15));
        if (ratio <= 0.5) {
            // 黄绿色 (150, 255, 0) 到橙色 (255, 165, 0)
            const r = 150 + Math.floor(ratio * 2 * 105);
            const g = 255 - Math.floor(ratio * 2 * 90);
            const b = 0;
            return `rgb(${r}, ${g}, ${b})`;
        } else {
            // 橙色 (255, 165, 0) 到红色 (255, 0, 0)
            const r = 255;
            const g = 165 - Math.floor((ratio - 0.5) * 2 * 165);
            const b = 0;
            return `rgb(${r}, ${g}, ${b})`;
        }
    }
}

// 在 script.js 中添加获取文明所处的时代函数
function getCivilizationEra(existenceTime) {
    if (existenceTime < 50) return "原始时代";
    if (existenceTime < 250) return "封建时代";
    if (existenceTime < 300) return "蒸汽时代";
    if (existenceTime < 333) return "电气时代";
    if (existenceTime < 366) return "原子时代";
    if (existenceTime < 400) return "信息时代";
    return "星际探索时代";
}
function updateBodiesPosition() {
    // 更新行星自转角度 - 每50刻旋转一圈
    const rotationSpeed = (2 * Math.PI) / 50; // 每刻旋转的角度
    const dt = 0.01 * speedFactor;
    
    // 更新所有星云
    for (let nebula of nebulas) {
        nebula.update(dt);
    }
    
    // 更新所有冲击波
    for (let shockwave of shockwaves) {
        shockwave.update(dt);
    }
    
    // 清理过期的冲击波
    shockwaves = shockwaves.filter(shockwave => shockwave.isActive);
    
    // 更新粒子系统
    particleSystem.update(dt);
    
    // 计算并应用引力
    for (let i = 0; i < bodies.length; i++) {
        let fx = 0, fy = 0, fz = 0;

        for (let j = 0; j < bodies.length; j++) {
            if (i !== j) {
                const force = calculateGravity(bodies[i], bodies[j]);
                fx += force.fx;
                fy += force.fy;
                fz += force.fz;
            }
        }

        // 应用星云的减速和升温效果
        let totalDrag = 0;
        let totalHeating = 0;
        
        for (let nebula of nebulas) {
            const dx = bodies[i].x - nebula.x;
            const dy = bodies[i].y - nebula.y;
            const dz = bodies[i].z - nebula.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (distance < nebula.currentRadius + bodies[i].radius) {
                const drag = nebula.getDragEffect(distance);
                const heating = nebula.getHeatingEffect(distance);
                
                totalDrag += drag;
                totalHeating += heating;
            }
        }
        
        // 应用冲击波的推力和升温效果
        let shockwavePushX = 0, shockwavePushY = 0, shockwavePushZ = 0;
        let shockwaveHeating = 0;
        
        for (let shockwave of shockwaves) {
            const dx = bodies[i].x - shockwave.x;
            const dy = bodies[i].y - shockwave.y;
            const dz = bodies[i].z - shockwave.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            // 检查这个天体是否已经被这个冲击波影响过
            const bodyKey = bodies[i].name;
            if (!shockwave.hasAffected.has(bodyKey)) {
                const push = shockwave.getPushEffect(distance);
                if (push > 0) {
                    // 计算向外的推力方向
                    const dirX = dx / (distance + 0.001);
                    const dirY = dy / (distance + 0.001);
                    const dirZ = dz / (distance + 0.001);
                    
                    // 推力小于冲击波速度
                    const pushMagnitude = Math.min(push, shockwave.shockwaveSpeed * 0.5);
                    shockwavePushX += dirX * pushMagnitude;
                    shockwavePushY += dirY * pushMagnitude;
                    shockwavePushZ += dirZ * pushMagnitude;
                    
                    // 标记这个天体已经被这个冲击波影响过
                    shockwave.hasAffected.add(bodyKey);
                }
            }
            
            // 冲击波的升温效果
            const heating = shockwave.getHeatingEffect(bodies[i], distance);
            shockwaveHeating += heating;
        }
        
        // 应用减速效果
        if (totalDrag > 0) {
            const dragFactor = Math.max(0, 1 - totalDrag * dt);
            bodies[i].vx *= dragFactor;
            bodies[i].vy *= dragFactor;
            bodies[i].vz *= dragFactor;
        }
        
        // 应用冲击波推力
        bodies[i].vx += shockwavePushX * dt;
        bodies[i].vy += shockwavePushY * dt;
        bodies[i].vz += shockwavePushZ * dt;
        
        // 保存基础温度用于升温效果
        if (typeof bodies[i].baseTemperature === 'undefined') {
            bodies[i].baseTemperature = 0;
        }
        if (typeof bodies[i].shockwaveTemp === 'undefined') {
            bodies[i].shockwaveTemp = 0;
        }
        if (typeof bodies[i].shockwavePeak === 'undefined') {
            bodies[i].shockwavePeak = 0;
        }
        if (typeof bodies[i].shockwaveCooling === 'undefined') {
            bodies[i].shockwaveCooling = false;
        }
        
        // 星云升温永久叠加
        bodies[i].baseTemperature += totalHeating * dt;
        
        // 冲击波升温：快速升到峰值，然后快速降温
        if (shockwaveHeating > 0) {
            // 有冲击波加热，更新峰值
            bodies[i].shockwavePeak = Math.max(bodies[i].shockwavePeak, shockwaveHeating);
            bodies[i].shockwaveTemp = bodies[i].shockwavePeak;
            bodies[i].shockwaveCooling = false;
        } else {
            // 没有冲击波加热，开始快速冷却
            if (bodies[i].shockwaveTemp > 0) {
                bodies[i].shockwaveCooling = true;
                // 冷却速率：每刻减少温度的10%（快速冷却）
                bodies[i].shockwaveTemp *= 0.9;
                // 温度接近0时重置
                if (bodies[i].shockwaveTemp < 0.5) {
                    bodies[i].shockwaveTemp = 0;
                    bodies[i].shockwavePeak = 0;
                    bodies[i].shockwaveCooling = false;
                }
            }
        }

        // 更新速度 (F = ma => a = F/m)
        bodies[i].vx += fx / bodies[i].mass * dt;
        bodies[i].vy += fy / bodies[i].mass * dt;
        bodies[i].vz += fz / bodies[i].mass * dt;
    }

    // 更新位置
    for (let body of bodies) {
        body.x += body.vx * dt;
        body.y += body.vy * dt;
        body.z += body.vz * dt;
        
        // 更新行星自转角度
        if (!body.rotationAngle) {
            body.rotationAngle = 0;
        }
        body.rotationAngle += rotationSpeed * speedFactor;

        // 更新轨迹点
        if (!trails[body.name]) {
            trails[body.name] = [];
        }

        trails[body.name].push({
            x: body.x,
            y: body.y,
            z: body.z,
            time: Date.now() // 记录时间戳用于淡出效果
        });

        // 限制轨迹点数量
        if (trails[body.name].length > trailLength) {
            trails[body.name].shift();
        }
    }

    // 根据温度更新行星P的颜色
    const planetP = bodies.find(body => body.name === 'p');
    if (planetP) {
        const tempResult = calculatePlanetPTemperature();
        if (tempResult.temp !== '--') {
            const temp = parseFloat(tempResult.temp);
            planetP.color = getPlanetPColor(temp);
        }
    }

    // 检查碰撞
    checkCollisions();

    // 更新时间
    time += 0.01 * speedFactor;
}
// 3D到2D投影
function project3D(x, y, z, bodyName = null) {
    // 生成缓存键（如果提供了天体名称）
    let cacheKey = null;
    if (bodyName) {
        // 缓存键包含天体名称和当前的旋转、缩放、偏移状态
        cacheKey = `${bodyName}_${x.toFixed(2)}_${y.toFixed(2)}_${z.toFixed(2)}_${rotationX.toFixed(2)}_${rotationY.toFixed(2)}_${scale.toFixed(2)}_${offsetX.toFixed(2)}_${offsetY.toFixed(2)}_${centerBody ? centerBody.name : 'null'}`;
        
        // 检查缓存
        const cached = calculationCache.projections.get(cacheKey);
        if (cached) {
            return cached;
        }
    }

    // 如果有聚焦天体，以该天体为中心
    if (centerBody) {
        x -= centerBody.x;
        y -= centerBody.y;
        z -= centerBody.z;
    }

    // 应用旋转
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);

    // 绕Y轴旋转
    let x1 = x * cosY - z * sinY;
    let z1 = x * sinY + z * cosY;

    // 绕X轴旋转
    let y2 = y * cosX - z1 * sinX;
    let z2 = y * sinX + z1 * cosX;

    // 应用缩放和平移
    const projectedX = x1 * scale + canvas.width / 2 + offsetX;
    const projectedY = y2 * scale + canvas.height / 2 + offsetY;

    // 计算大小变化（基于z深度）
    const sizeFactor = Math.max(0.1, 1 - z2 / 1000);

    const result = {
        x: projectedX,
        y: projectedY,
        z: z2,
        sizeFactor: sizeFactor
    };

    // 缓存结果
    if (cacheKey) {
        calculationCache.projections.set(cacheKey, result);
    }

    return result;
}

// 绘制无限立体网格
// 绘制无限立体网格
function drawGrid() {
    // 计算当前视图中心点
    const centerX = -offsetX / scale;
    const centerY = -offsetY / scale;
    const centerZ = 0; // Z方向中心点

    // 计算视图范围
    const viewWidth = canvas.width / scale;
    const viewHeight = canvas.height / scale;

    // 网格参数 - 增加网格间距使其更稀疏
    const gridStep = 100; // 从50增加到100，使网格更稀疏

    // 计算需要绘制的网格范围
    const startX = Math.floor((centerX - viewWidth / 2) / gridStep) * gridStep;
    const endX = Math.ceil((centerX + viewWidth / 2) / gridStep) * gridStep;
    const startY = Math.floor((centerY - viewHeight / 2) / gridStep) * gridStep;
    const endY = Math.ceil((centerY + viewHeight / 2) / gridStep) * gridStep;
    const startZ = Math.floor((centerZ - viewHeight / 2) / gridStep) * gridStep;
    const endZ = Math.ceil((centerZ + viewHeight / 2) / gridStep) * gridStep;

    // 绘制XY平面网格 (z=0)
    for (let x = startX; x <= endX; x += gridStep) {
        const start = project3D(x, startY, 0);
        const end = project3D(x, endY, 0);
        
        // 根据距离计算透明度，使远处的网格更暗淡
        const distanceFactor = Math.abs(x - centerX) / (viewWidth / 2);
        const alpha = Math.max(0.05, 0.3 - distanceFactor * 0.25);
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    for (let y = startY; y <= endY; y += gridStep) {
        const start = project3D(startX, y, 0);
        const end = project3D(endX, y, 0);
        
        // 根据距离计算透明度，使远处的网格更暗淡
        const distanceFactor = Math.abs(y - centerY) / (viewHeight / 2);
        const alpha = Math.max(0.05, 0.3 - distanceFactor * 0.25);
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    // 绘制XZ平面网格 (y=0)
    for (let x = startX; x <= endX; x += gridStep) {
        const start = project3D(x, 0, startZ);
        const end = project3D(x, 0, endZ);
        
        // 根据距离计算透明度，使远处的网格更暗淡
        const distanceFactor = Math.abs(x - centerX) / (viewWidth / 2);
        const alpha = Math.max(0.05, 0.3 - distanceFactor * 0.25);
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    for (let z = startZ; z <= endZ; z += gridStep) {
        const start = project3D(startX, 0, z);
        const end = project3D(endX, 0, z);
        
        // 根据距离计算透明度，使远处的网格更暗淡
        const distanceFactor = Math.abs(z - centerZ) / (viewHeight / 2);
        const alpha = Math.max(0.05, 0.3 - distanceFactor * 0.25);
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    // 绘制YZ平面网格 (x=0)
    for (let y = startY; y <= endY; y += gridStep) {
        const start = project3D(0, y, startZ);
        const end = project3D(0, y, endZ);
        
        // 根据距离计算透明度，使远处的网格更暗淡
        const distanceFactor = Math.abs(y - centerY) / (viewHeight / 2);
        const alpha = Math.max(0.05, 0.3 - distanceFactor * 0.25);
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    for (let z = startZ; z <= endZ; z += gridStep) {
        const start = project3D(0, startY, z);
        const end = project3D(0, endY, z);
        
        // 根据距离计算透明度，使远处的网格更暗淡
        const distanceFactor = Math.abs(z - centerZ) / (viewHeight / 2);
        const alpha = Math.max(0.05, 0.3 - distanceFactor * 0.25);
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    // 绘制坐标轴（加重显示）
    // X轴（白色）
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    const xStart = project3D(startX, 0, 0);
    const xEnd = project3D(endX, 0, 0);
    ctx.beginPath();
    ctx.moveTo(xStart.x, xStart.y);
    ctx.lineTo(xEnd.x, xEnd.y);
    ctx.stroke();

    // Y轴（白色）
    const yStart = project3D(0, startY, 0);
    const yEnd = project3D(0, endY, 0);
    ctx.beginPath();
    ctx.moveTo(yStart.x, yStart.y);
    ctx.lineTo(yEnd.x, yEnd.y);
    ctx.stroke();

    // Z轴（白色）
    const zStart = project3D(0, 0, startZ);
    const zEnd = project3D(0, 0, endZ);
    ctx.beginPath();
    ctx.moveTo(zStart.x, zStart.y);
    ctx.lineTo(zEnd.x, zEnd.y);
    ctx.stroke();

    // 重置为默认网格线颜色和线宽
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
}

// 绘制天体轨迹（彗尾效果）
function drawTrails() {
    const currentTime = Date.now();
    const fadeDuration = 5000; // 5秒内完全淡出

    // 创建一个包含轨迹和z深度的数组，用于正确排序
    const trailsWithDepth = [];

    for (const bodyName in trails) {
        const trail = trails[bodyName];
        if (trail.length < 2) continue;

        const body = bodies.find(b => b.name === bodyName);
        if (!body) continue;

        // 计算轨迹的平均z深度
        let avgZ = 0;
        for (let i = 0; i < trail.length; i++) {
            avgZ += trail[i].z;
        }
        avgZ /= trail.length;

        trailsWithDepth.push({
            bodyName: bodyName,
            trail: trail,
            avgZ: avgZ,
            body: body
        });
    }

    // 按z深度排序（从前到后绘制，确保近处轨迹遮挡远处轨迹）
    trailsWithDepth.sort((a, b) => b.avgZ - a.avgZ);

    // 绘制轨迹（取消恒星轨迹发光效果，统一处理）
    for (const trailData of trailsWithDepth) {
        const trail = trailData.trail;
        const body = trailData.body;

        ctx.beginPath();

        for (let i = 0; i < trail.length; i++) {
            const point = trail[i];
            const projected = project3D(point.x, point.y, point.z);

            // 根据存在时间计算透明度（越旧的点越透明）
            const age = currentTime - point.time;
            const alpha = Math.max(0, 1 - age / fadeDuration);

            // 设置轨迹颜色和透明度 - 支持多种颜色格式
            let strokeColor;
            if (body.color.startsWith('#')) {
                // 十六进制颜色格式
                let r, g, b;
                const hex = body.color.slice(1);
                if (hex.length === 3) {
                    r = parseInt(hex[0] + hex[0], 16);
                    g = parseInt(hex[1] + hex[1], 16);
                    b = parseInt(hex[2] + hex[2], 16);
                } else {
                    r = parseInt(hex.slice(0, 2), 16);
                    g = parseInt(hex.slice(2, 4), 16);
                    b = parseInt(hex.slice(4, 6), 16);
                }
                strokeColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            } else if (body.color.startsWith('rgb(')) {
                // RGB颜色格式
                strokeColor = body.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            } else {
                // 其他格式，直接使用
                strokeColor = body.color;
            }
            ctx.strokeStyle = strokeColor;

            if (i === 0) {
                ctx.moveTo(projected.x, projected.y);
            } else {
                ctx.lineTo(projected.x, projected.y);
            }

            // 设置线宽（轨迹前端较粗，后端较细）
            const lineWidth = Math.max(0.5, 3 * (i / trail.length));
            ctx.lineWidth = lineWidth;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(projected.x, projected.y);
        }
    }
}

// 绘制星云
function drawNebulas() {
    for (let nebula of nebulas) {
        const projected = project3D(nebula.x, nebula.y, nebula.z);
        const radius = nebula.currentRadius * projected.sizeFactor * scale;
        
        // 解析颜色1
        let r1, g1, b1;
        if (nebula.color1.startsWith('#')) {
            const hex = nebula.color1.slice(1);
            r1 = parseInt(hex.slice(0, 2), 16);
            g1 = parseInt(hex.slice(2, 4), 16);
            b1 = parseInt(hex.slice(4, 6), 16);
        } else if (nebula.color1.startsWith('rgb(')) {
            const rgbMatch = nebula.color1.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
                r1 = parseInt(rgbMatch[1]);
                g1 = parseInt(rgbMatch[2]);
                b1 = parseInt(rgbMatch[3]);
            } else {
                r1 = g1 = b1 = 200;
            }
        } else {
            r1 = g1 = b1 = 200;
        }
        
        // 解析颜色2
        let r2, g2, b2;
        if (nebula.color2.startsWith('#')) {
            const hex = nebula.color2.slice(1);
            r2 = parseInt(hex.slice(0, 2), 16);
            g2 = parseInt(hex.slice(2, 4), 16);
            b2 = parseInt(hex.slice(4, 6), 16);
        } else if (nebula.color2.startsWith('rgb(')) {
            const rgbMatch = nebula.color2.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
                r2 = parseInt(rgbMatch[1]);
                g2 = parseInt(rgbMatch[2]);
                b2 = parseInt(rgbMatch[3]);
            } else {
                r2 = g2 = b2 = 150;
            }
        } else {
            r2 = g2 = b2 = 150;
        }
        
        // 创建星云渐变
        const gradient = ctx.createRadialGradient(
            projected.x, projected.y, 0,
            projected.x, projected.y, radius
        );
        
        // 计算混合颜色，让两种颜色更接近
        const mixedR = Math.round(r1 * 0.7 + r2 * 0.3);
        const mixedG = Math.round(g1 * 0.7 + g2 * 0.3);
        const mixedB = Math.round(b1 * 0.7 + b2 * 0.3);
        const mixedR2 = Math.round(r1 * 0.3 + r2 * 0.7);
        const mixedG2 = Math.round(g1 * 0.3 + g2 * 0.7);
        const mixedB2 = Math.round(b1 * 0.3 + b2 * 0.7);
        
        const tempFactor = Math.max(0.3, Math.min(1, nebula.temperature / 10000));
        gradient.addColorStop(0, `rgba(${mixedR}, ${mixedG}, ${mixedB}, ${0.7 * tempFactor})`);
        gradient.addColorStop(0.5, `rgba(${Math.round((mixedR + mixedR2) / 2)}, ${Math.round((mixedG + mixedG2) / 2)}, ${Math.round((mixedB + mixedB2) / 2)}, ${0.5 * tempFactor})`);
        gradient.addColorStop(1, `rgba(${mixedR2}, ${mixedG2}, ${mixedB2}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制星云标签
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        const statusText = nebula.isStable ? '(稳定)' : '(扩散中)';
        ctx.fillText(`星云${nebula.id} ${statusText}`, projected.x, projected.y - radius - 10);
    }
}

// 绘制爆炸
function drawShockwaves() {
    for (let shockwave of shockwaves) {
        if (!shockwave.isActive) continue;
        
        const projected = project3D(shockwave.x, shockwave.y, shockwave.z);
        const radius = shockwave.radius * projected.sizeFactor * scale;
        const progress = shockwave.age / shockwave.maxAge;
        
        // 解析颜色1
        let r1, g1, b1;
        if (shockwave.color1.startsWith('#')) {
            const hex = shockwave.color1.slice(1);
            r1 = parseInt(hex.slice(0, 2), 16);
            g1 = parseInt(hex.slice(2, 4), 16);
            b1 = parseInt(hex.slice(4, 6), 16);
        } else if (shockwave.color1.startsWith('rgb(')) {
            const rgbMatch = shockwave.color1.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
                r1 = parseInt(rgbMatch[1]);
                g1 = parseInt(rgbMatch[2]);
                b1 = parseInt(rgbMatch[3]);
            } else {
                r1 = g1 = b1 = 255;
            }
        } else {
            r1 = g1 = b1 = 255;
        }
        
        // 解析颜色2
        let r2, g2, b2;
        if (shockwave.color2.startsWith('#')) {
            const hex = shockwave.color2.slice(1);
            r2 = parseInt(hex.slice(0, 2), 16);
            g2 = parseInt(hex.slice(2, 4), 16);
            b2 = parseInt(hex.slice(4, 6), 16);
        } else if (shockwave.color2.startsWith('rgb(')) {
            const rgbMatch = shockwave.color2.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
                r2 = parseInt(rgbMatch[1]);
                g2 = parseInt(rgbMatch[2]);
                b2 = parseInt(rgbMatch[3]);
            } else {
                r2 = g2 = b2 = 200;
            }
        } else {
            r2 = g2 = b2 = 200;
        }
        
        // 混合颜色
        const mixedR = Math.round((r1 + r2) / 2);
        const mixedG = Math.round((g1 + g2) / 2);
        const mixedB = Math.round((b1 + b2) / 2);
        
        // 冲击波整体透明度随时间逐渐增加（变得更透明）
        // 开始时较不透明（0.6），结束时几乎完全透明（0.05）
        const baseAlpha = 0.6 - progress * 0.55;
        
        // 绘制半透明球体，从边缘到中心越来越透明
        const shockwaveGradient = ctx.createRadialGradient(
            projected.x, projected.y, 0,
            projected.x, projected.y, radius
        );
        
        // 中心：完全透明
        shockwaveGradient.addColorStop(0, `rgba(${mixedR}, ${mixedG}, ${mixedB}, 0)`);
        // 中间位置：中等透明度
        shockwaveGradient.addColorStop(0.5, `rgba(${mixedR}, ${mixedG}, ${mixedB}, ${baseAlpha * 0.5})`);
        // 边缘：最高透明度
        shockwaveGradient.addColorStop(1, `rgba(${mixedR}, ${mixedG}, ${mixedB}, ${baseAlpha})`);
        
        ctx.fillStyle = shockwaveGradient;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 绘制天体
function drawBodies() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isFirstPersonView) {
        if (babylonInitialized) {
            // 使用Babylon.js渲染第一视角
            drawBabylonView();
        } else {
            // 回退到Three.js渲染
            drawFirstPersonView();
        }
        return;
    }

    // 直接在主画布上绘制，按正确的层级顺序
    
    // 1. 绘制网格（最底层）
    drawGrid();

    // 2. 绘制轨迹（网格之上）
    drawTrails();

    // 3. 绘制星云（轨迹之上）
    drawNebulas();

    // 4. 绘制冲击波（星云之上）
    drawShockwaves();

    // 4.5 绘制粒子效果（冲击波之上，天体之下）
    particleSystem.render();

    // 5. 绘制天体（最上层）
    // 创建一个包含天体和z深度的数组，用于正确排序
    const bodiesWithDepth = [];
    for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        const projected = project3D(body.x, body.y, body.z, body.name);
        const data = objectPool.bodyData.get();
        data.body = body;
        data.projected = projected;
        data.radius = body.radius * projected.sizeFactor * scale;
        bodiesWithDepth.push(data);
    }

    // 按z深度排序（从前到后绘制，确保近处物体遮挡远处物体）
    bodiesWithDepth.sort((a, b) => b.projected.z - a.projected.z);

    // 绘制天体
    for (let bodyData of bodiesWithDepth) {
        const body = bodyData.body;
        const projected = bodyData.projected;
        const radius = bodyData.radius;

        // 判断是否为恒星（质量大于1000的天体视为恒星）
        const isStar = body.mass >= 1000;
        
        if (isStar) {
            // 为恒星添加发光效果
            
            // 根据恒星质量调整光晕大小，质量越大光晕越大
            const massFactor = Math.min(2.5, Math.max(1.5, body.mass / 10000));
            
            // 外层光晕（最弱最大）
            const outerGlowRadius = radius * 4 * massFactor;
            const outerGradient = ctx.createRadialGradient(
                projected.x, projected.y, 0,
                projected.x, projected.y, outerGlowRadius
            );
            
            // 解析颜色并创建发光效果
            const color = body.color;
            let r, g, b;
            
            // 检查颜色缓存
            if (calculationCache.colors.has(color)) {
                const cachedColor = calculationCache.colors.get(color);
                r = cachedColor.r;
                g = cachedColor.g;
                b = cachedColor.b;
            } else {
                if (color.startsWith('#')) {
                    const hex = color.slice(1);
                    r = parseInt(hex.slice(0, 2), 16);
                    g = parseInt(hex.slice(2, 4), 16);
                    b = parseInt(hex.slice(4, 6), 16);
                } else if (color.startsWith('rgb(')) {
                    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                    if (rgbMatch) {
                        r = parseInt(rgbMatch[1]);
                        g = parseInt(rgbMatch[2]);
                        b = parseInt(rgbMatch[3]);
                    } else {
                        r = g = b = 255;
                    }
                } else {
                    r = g = b = 255; // 默认白色
                }
                // 缓存颜色
                calculationCache.colors.set(color, { r, g, b });
            }
            
            // 外层光晕渐变
            outerGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`);
            outerGradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.15)`);
            outerGradient.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, 0.05)`);
            outerGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            
            // 绘制外层光晕
            ctx.fillStyle = outerGradient;
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, outerGlowRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // 中层光晕（中等亮度）
            const midGlowRadius = radius * 2.5 * massFactor;
            const midGradient = ctx.createRadialGradient(
                projected.x, projected.y, 0,
                projected.x, projected.y, midGlowRadius
            );
            
            midGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.6)`);
            midGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.3)`);
            midGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            
            // 绘制中层光晕
            ctx.fillStyle = midGradient;
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, midGlowRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // 内层光晕（最亮最接近恒星）
            const innerGlowRadius = radius * 1.5;
            const innerGradient = ctx.createRadialGradient(
                projected.x, projected.y, 0,
                projected.x, projected.y, innerGlowRadius
            );
            
            innerGradient.addColorStop(0, `rgba(255, 255, 255, 0.9)`);
            innerGradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.7)`);
            innerGradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.3)`);
            innerGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            
            // 绘制内层光晕
            ctx.fillStyle = innerGradient;
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, innerGlowRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制恒星核心（最亮部分）
            const coreGradient = ctx.createRadialGradient(
                projected.x, projected.y, 0,
                projected.x, projected.y, radius
            );
            coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            coreGradient.addColorStop(0.4, `rgba(${r + 50}, ${g + 50}, ${b + 50}, 1)`);
            coreGradient.addColorStop(0.8, body.color);
            coreGradient.addColorStop(1, body.color);
            
            ctx.fillStyle = coreGradient;
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, Math.max(1, radius), 0, Math.PI * 2);
            ctx.fill();
            
        } else {
            // 普通天体（如行星）保持原样绘制
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, Math.max(1, radius), 0, Math.PI * 2);
            ctx.fillStyle = body.color;
            ctx.fill();
        }

        // 绘制天体名称
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(body.name, projected.x, projected.y - radius - 5);
    }
    
    // 释放对象池中的对象
    for (let data of bodiesWithDepth) {
        objectPool.bodyData.release(data);
    }
}

// 获取鼠标点击位置下的天体
function getBodyAtPosition(mouseX, mouseY) {
    // 创建一个包含天体和z深度的数组，用于正确排序（排除碎片）
    const bodiesWithDepth = bodies.filter(body => !body.isFragment).map(body => {
        const projected = project3D(body.x, body.y, body.z);
        return {
            body: body,
            projected: projected,
            radius: body.radius * projected.sizeFactor * scale
        };
    });

    // 按z深度排序（从前到后）以确保点击的是最上层的天体
    bodiesWithDepth.sort((a, b) => b.projected.z - a.projected.z);

    for (let bodyData of bodiesWithDepth) {
        const body = bodyData.body;
        const projected = bodyData.projected;
        const radius = bodyData.radius;
        const distance = Math.sqrt(
            Math.pow(mouseX - projected.x, 2) +
            Math.pow(mouseY - projected.y, 2)
        );

        if (distance <= radius) {
            return body;
        }
    }
    return null;
}

// 显示天体信息
function showBodyInfo(body) {
    selectedBody = body;
    document.getElementById('body-name').textContent = body.name;
    document.getElementById('body-mass').textContent = body.mass.toFixed(2);

    // 计算合速度
    const velocity = Math.sqrt(
        body.vx * body.vx +
        body.vy * body.vy +
        body.vz * body.vz
    );
    document.getElementById('body-velocity').textContent = velocity.toFixed(2);

    document.getElementById('body-info').style.display = 'block';
}

// 显示名句
function showQuote() {
    quoteElement.textContent = quotes[currentQuoteIndex];
    quoteElement.style.opacity = 1;

    setTimeout(() => {
        quoteElement.style.opacity = 0;
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        setTimeout(showQuote, 1000); // 1秒淡出后显示下一句
    }, 5000); // 每句显示5秒
}

// 第一视角渲染函数
function drawFirstPersonView() {
    const planetP = bodies.find(body => body.name === 'p');
    let referencePoint = planetP;
    
    // 如果行星P不存在，使用第一个天体作为参考点
    if (!referencePoint && bodies.length > 0) {
        referencePoint = bodies[0];
    }
    
    if (!referencePoint) return;

    // 初始化Three.js场景（如果尚未初始化）
    if (!firstPersonScene) {
        initFirstPersonScene();
    }

    // 更新恒星位置
    updateStarsInFirstPersonView(referencePoint);
    
    // 更新星云位置
    updateNebulasInFirstPersonView(referencePoint);
    
    // 更新爆炸位置
    updateShockwavesInFirstPersonView(referencePoint);
    
    // 计算总亮度，确保天空和地面颜色更新
    calculateTotalBrightness();
    
    // 更新天空和地面颜色
    const stars = bodies.filter(body => body.name !== 'p');
    updateSkyDomeColor(stars, planetP);
    updateGroundBrightness();
    
    // 渲染3D场景
    renderFirstPersonScene();
    
    // 绘制第一视角控制提示
    drawFirstPersonControls();
}

// Three.js第一视角场景变量
let firstPersonScene, firstPersonCamera, firstPersonRenderer;
let cameraContainer, skyDome, ground;
let starObjects = [];
let firstPersonInitialized = false;
let starLabels = [];
let labelContainer;
let sunLight, sunLight2, sunLight3;
let atmosphericFog;
let nebulaObjects = [];
let explosionObjects = [];

// Babylon.js第一视角场景变量
let babylonScene, babylonEngine, babylonCamera, babylonLight;
let babylonSkyDome, babylonGround, babylonGrid;
let babylonStarObjects = [];
let babylonNebulaObjects = [];
let babylonExplosionObjects = [];
let babylonParticleSystems = [];
let babylonInitialized = false;

// 第一视角移动控制
const firstPersonMoveSpeed = 5.0; // 移动速度（加快）
let keys = { w: false, a: false, s: false, d: false }; // 按键状态

// 初始化Babylon.js第一视角场景
function initBabylonScene() {
    console.log('开始初始化Babylon.js第一视角场景...');
    
    // 检查Babylon.js是否可用
    if (typeof BABYLON === 'undefined') {
        console.error('Babylon.js库未加载！');
        alert('Babylon.js库未正确加载，请检查网络连接');
        return;
    }
    
    // 检查canvas和parentElement
    if (!canvas) {
        console.error('Canvas元素不存在！');
        return;
    }
    
    if (!canvas.parentElement) {
        console.error('Canvas的父元素不存在！');
        return;
    }
    
    console.log('Canvas和父元素检查通过');
    
    // 创建引擎
    babylonEngine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    console.log('Babylon.js引擎创建成功');
    
    // 创建场景
    babylonScene = new BABYLON.Scene(babylonEngine);
    babylonScene.clearColor = new BABYLON.Color4(0, 0, 0.02, 1);
    babylonScene.autoClear = true;
    console.log('Babylon.js场景创建成功');
    
    // 创建自由相机（第一视角）
    const planetP = bodies.find(b => b.name === 'p');
    const startPos = planetP ? new BABYLON.Vector3(planetP.x + 50, planetP.y + 20, planetP.z) : new BABYLON.Vector3(50, 20, 0);
    
    babylonCamera = new BABYLON.FreeCamera('camera', startPos, babylonScene);
    babylonCamera.attachControl(canvas, true);
    babylonCamera.speed = 2;
    babylonCamera.angularSensibility = 2000;
    babylonCamera.inertia = 0.9;
    babylonCamera.minZ = 0.1;
    babylonCamera.maxZ = 10000;
    console.log('Babylon.js相机创建成功');
    
    // 创建主方向光
    babylonLight = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-1, -2, -1), babylonScene);
    babylonLight.intensity = 1.0;
    babylonLight.position = new BABYLON.Vector3(100, 200, 100);
    
    // 添加环境光
    const ambientLight = new BABYLON.HemisphericLight('ambient', new BABYLON.Vector3(0, 1, 0), babylonScene);
    ambientLight.intensity = 0.3;
    ambientLight.diffuse = new BABYLON.Color3(0.5, 0.5, 1);
    ambientLight.specular = new BABYLON.Color3(0.1, 0.1, 0.1);
    
    // 添加雾效
    babylonScene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    babylonScene.fogDensity = 0.0003;
    babylonScene.fogColor = new BABYLON.Color3(0, 0, 0.05);
    
    // 创建地面
    const groundSize = 2000;
    const groundMaterial = new BABYLON.PBRMaterial('groundMat', babylonScene);
    groundMaterial.albedoColor = new BABYLON.Color3(0.1, 0.1, 0.2);
    groundMaterial.metallic = 0.0;
    groundMaterial.roughness = 1.0;
    groundMaterial.backFaceCulling = false;
    
    const groundMesh = BABYLON.MeshBuilder.CreateGround('ground', {
        width: groundSize,
        height: groundSize,
        subdivisions: 50
    }, babylonScene);
    groundMesh.material = groundMaterial;
    groundMesh.receiveShadows = true;
    
    // 创建星空背景（天空穹顶）
    const skybox = BABYLON.MeshBuilder.CreateBox('skybox', { size: 8000 }, babylonScene);
    const skyboxMaterial = new BABYLON.PBRMaterial('skyboxMat', babylonScene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skyboxMaterial.albedoColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
    
    // 创建星空粒子
    createStarfieldParticles();
    
    // 创建网格辅助线
    const gridMaterial = new BABYLON.GridMaterial('gridMat', babylonScene);
    gridMaterial.majorUnitFrequency = 20;
    gridMaterial.minorUnitVisibility = 0.15;
    gridMaterial.gridRatio = 1;
    gridMaterial.backFaceCulling = false;
    gridMaterial.mainColor = new BABYLON.Color3(0.1, 0.1, 0.3);
    gridMaterial.lineColor = new BABYLON.Color3(0.2, 0.2, 0.4);
    gridMaterial.opacity = 0.4;
    
    const gridMesh = BABYLON.MeshBuilder.CreateGround('grid', {
        width: groundSize,
        height: groundSize
    }, babylonScene);
    gridMesh.material = gridMaterial;
    
    // 启动渲染循环
    babylonEngine.runRenderLoop(() => {
        if (babylonScene) {
            // 处理相机移动
            handleBabylonCameraMovement();
            // 更新粒子系统
            for (let ps of babylonParticleSystems) {
                if (ps && ps.isStarted) {
                    // Babylon.js粒子系统会自动更新
                }
            }
            // 更新天体位置
            updateBabylonBodies();
            // 更新星云（使用原有的投影和旋转逻辑）
            const planetP = bodies.find(b => b.name === 'p');
            if (planetP) {
                updateNebulasInBabylonView(planetP);
            }
            babylonScene.render();
        }
    });
    
    // 窗口大小调整
    window.addEventListener('resize', () => {
        babylonEngine.resize();
    });
    
    babylonInitialized = true;
    console.log('Babylon.js第一视角场景初始化完成');
}

// 创建星空粒子
function createStarfieldParticles() {
    if (!babylonScene) return;
    
    const starfield = new BABYLON.ParticleSystem('starfield', 5000, babylonScene);
    
    // 创建球形发射器
    starfield.emitter = BABYLON.Vector3.Zero();
    starfield.minEmitBox = new BABYLON.Vector3(-3000, -3000, -3000);
    starfield.maxEmitBox = new BABYLON.Vector3(3000, 3000, 3000);
    
    // 颜色
    starfield.color1 = new BABYLON.Color4(1, 1, 1, 1);
    starfield.color2 = new BABYLON.Color4(0.8, 0.9, 1, 1);
    starfield.colorDead = new BABYLON.Color4(0, 0, 0, 0);
    
    // 大小
    starfield.minSize = 0.5;
    starfield.maxSize = 2;
    
    // 生命周期
    starfield.minLifeTime = 999999;
    starfield.maxLifeTime = 999999;
    
    // 速度
    starfield.minEmitPower = 0;
    starfield.maxEmitPower = 0;
    
    // 透明度
    starfield.addSizeGradient(0, 0.5);
    starfield.addSizeGradient(1, 2);
    starfield.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0.8));
    starfield.addColorGradient(1, new BABYLON.Color4(0.5, 0.7, 1, 0.4));
    
    starfield.updateSpeed = 0;
    
    // 一次性发射所有粒子
    starfield.manualEmitCount = 5000;
    starfield.start();
    
    // 立即停止（只需要一次发射）
    setTimeout(() => {
        starfield.stop();
    }, 100);
    
    babylonParticleSystems.push(starfield);
}

// 初始化第一视角3D场景
function initFirstPersonScene() {
    console.log('开始初始化第一视角场景...');
    
    // 检查Three.js是否可用
    if (typeof THREE === 'undefined') {
        console.error('Three.js库未加载！');
        alert('Three.js库未正确加载，请检查网络连接');
        return;
    }
    
    // 检查canvas和parentElement
    if (!canvas) {
        console.error('Canvas元素不存在！');
        return;
    }
    
    if (!canvas.parentElement) {
        console.error('Canvas的父元素不存在！');
        return;
    }
    
    console.log('Canvas和父元素检查通过');
    
    // 创建场景
    firstPersonScene = new THREE.Scene();
    console.log('Three.js场景创建成功');
    
    // 获取当前画布尺寸（考虑横屏模式）
    const currentWidth = canvas.width;
    const currentHeight = canvas.height;
    console.log(`画布尺寸: ${currentWidth}x${currentHeight}`);
    
    // 创建相机 - 使用正确的宽高比
    firstPersonCamera = new THREE.PerspectiveCamera(75, currentWidth / currentHeight, 0.1, 1000);
    console.log('相机创建成功');
    
    // 创建渲染器 - 启用抗锯齿
    try {
        firstPersonRenderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true // 启用渲染器级别的抗锯齿
        });
        console.log('渲染器创建成功');
    } catch (error) {
        console.error('渲染器创建失败:', error);
        alert('WebGL渲染器创建失败，您的浏览器可能不支持WebGL');
        return;
    }
    
    firstPersonRenderer.setSize(currentWidth, currentHeight);
    firstPersonRenderer.setClearColor(0x000000, 0); // 透明背景
    console.log('渲染器尺寸设置完成');
    
    // 检查渲染器的DOM元素
    if (!firstPersonRenderer.domElement) {
        console.error('渲染器DOM元素不存在！');
        return;
    }
    
    // 将渲染器的DOM元素添加到页面中
    firstPersonRenderer.domElement.style.position = 'absolute';
    firstPersonRenderer.domElement.style.top = '0';
    firstPersonRenderer.domElement.style.left = '0';
    firstPersonRenderer.domElement.style.width = '100%';
    firstPersonRenderer.domElement.style.height = '100%';
    firstPersonRenderer.domElement.style.zIndex = '1';
    firstPersonRenderer.domElement.style.pointerEvents = 'none';
    
    try {
        canvas.parentElement.appendChild(firstPersonRenderer.domElement);
        console.log('Three.js渲染器DOM元素添加成功');
        console.log('渲染器DOM元素尺寸:', firstPersonRenderer.domElement.width, 'x', firstPersonRenderer.domElement.height);
    } catch (error) {
        console.error('添加渲染器DOM元素失败:', error);
        return;
    }
    
    // 创建文本标注容器
labelContainer = document.createElement('div');
labelContainer.style.position = 'absolute';
labelContainer.style.top = '0';
labelContainer.style.left = '0';
labelContainer.style.width = '100%';
labelContainer.style.height = '100%';
labelContainer.style.pointerEvents = 'none';
labelContainer.style.zIndex = '1000';
canvas.parentElement.appendChild(labelContainer);
console.log('文本标注容器初始化成功');
    
    // 创建相机容器用于绕世界Y轴旋转
    cameraContainer = new THREE.Object3D();
    firstPersonScene.add(cameraContainer);
    
    // 根据经纬度计算观察者在内部球壳上的位置和朝向
    function updateObserverPositionOnSphere() {
        const lat = observerLatitude;
        const lon = observerLongitude;
        cameraContainer.position.x = innerSphereRadius * Math.cos(lat) * Math.sin(lon);
        cameraContainer.position.y = innerSphereRadius * Math.sin(lat);
        cameraContainer.position.z = innerSphereRadius * Math.cos(lat) * Math.cos(lon);
        
        // 计算正确的朝向，确保地平线始终平行于玩家视角
        
        // 1. 从球心指向观察者的方向（表面法线方向）
        const normalDirection = new THREE.Vector3(
            cameraContainer.position.x,
            cameraContainer.position.y,
            cameraContainer.position.z
        ).normalize();
        
        // 2. 东方向（在球壳表面上，增加经度的方向）
        const eastDirection = new THREE.Vector3(
            Math.cos(lon),
            0,
            -Math.sin(lon)
        ).normalize();
        
        // 3. 北方向（在球壳表面上，增加纬度的方向）
        // 通过叉乘计算：北 = 法线 × 东
        const northDirection = new THREE.Vector3();
        northDirection.crossVectors(normalDirection, eastDirection).normalize();
        
        // 设置相机的up向量为法线方向（确保地平线水平）
        cameraContainer.up = normalDirection.clone();
        
        // 计算观察点：向前看（北方向）
        const lookAtPoint = cameraContainer.position.clone().add(northDirection);
        
        // 让相机看向观察点
        cameraContainer.lookAt(lookAtPoint);
    }
    
    // 初始化观察者位置
    updateObserverPositionOnSphere();
    
    // 相机初始位置 - 在球壳表面稍微抬高一点
    firstPersonCamera.position.y = 0.5;
    cameraContainer.add(firstPersonCamera);
    
    // 创建内部行星表面球壳
    const innerSphereGeometry = new THREE.SphereGeometry(innerSphereRadius, 64, 64);
    const innerSphereMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x404040, // 更深的灰色
        roughness: 1.0,
        metalness: 0.0,
        side: THREE.BackSide,
        wireframe: false,
        transparent: false // 不透明
    });
    const innerSphere = new THREE.Mesh(innerSphereGeometry, innerSphereMaterial);
    innerSphere.name = 'innerSphere';
    firstPersonScene.add(innerSphere);
    
    // 创建经纬度网 - 使用更简单的方法
    // 使用SphereGeometry的wireframe来创建经纬网
    const gridGeometry = new THREE.SphereGeometry(innerSphereRadius * 1.001, 24, 12); // 稍微大一点，在球壳表面
    const gridMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        side: THREE.BackSide
    });
    const gridSphere = new THREE.Mesh(gridGeometry, gridMaterial);
    gridSphere.name = 'gridSphere';
    firstPersonScene.add(gridSphere);
    
    // 创建天穹（球体）
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
        color: 0x000011,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.9,
        depthWrite: false // 天穹不写入深度缓冲，避免遮挡恒星
    });
    skyDome = new THREE.Mesh(skyGeometry, skyMaterial);
    firstPersonScene.add(skyDome);
    
    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0x222244, 0.4);
    firstPersonScene.add(ambientLight);
    
    // 添加三个动态点光源（对应三颗恒星）
    sunLight = new THREE.PointLight(0xff6600, 2, 600);
    sunLight.position.set(0, 100, 0);
    sunLight.castShadow = true;
    firstPersonScene.add(sunLight);
    
    sunLight2 = new THREE.PointLight(0x0066ff, 1.5, 500);
    sunLight2.position.set(100, 0, 0);
    firstPersonScene.add(sunLight2);
    
    sunLight3 = new THREE.PointLight(0xffff00, 1.2, 450);
    sunLight3.position.set(0, 0, 100);
    firstPersonScene.add(sunLight3);
    
    // 添加大气雾效
    atmosphericFog = new THREE.FogExp2(0x000022, 0.002);
    firstPersonScene.fog = atmosphericFog;
    
    // 添加星星背景
    createStarField();
    
    firstPersonInitialized = true;
}

// 背景星星对象引用
let starField = null;

// 创建星星背景
function createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000; // 增加星星数量
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        const index = i / 3;
        // 在球面上随机分布星星
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 480 + Math.random() * 10; // 稍微随机的半径
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
        
        // 随机星星颜色（白色、淡蓝色、淡黄色）
        const colorType = Math.random();
        let r, g, b;
        if (colorType < 0.7) {
            // 白色星星
            r = g = b = 0.9 + Math.random() * 0.1;
        } else if (colorType < 0.85) {
            // 蓝色星星
            r = 0.7 + Math.random() * 0.3;
            g = 0.8 + Math.random() * 0.2;
            b = 1.0;
        } else {
            // 黄色/橙色星星
            r = 1.0;
            g = 0.8 + Math.random() * 0.2;
            b = 0.6 + Math.random() * 0.2;
        }
        
        colors[i] = r;
        colors[i + 1] = g;
        colors[i + 2] = b;
        
        // 随机星星大小（更大）
        sizes[index] = 1.0 + Math.random() * 3.0;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // 使用自定义着色器材质，实现更真实的星星效果（更亮）
    const starMaterial = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (400.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                float distanceToCenter = distance(gl_PointCoord, vec2(0.5, 0.5));
                if (distanceToCenter > 0.5) {
                    discard;
                }
                
                float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                alpha = pow(alpha, 0.5); // 更亮的中心
                gl_FragColor = vec4(vColor, alpha * 1.0);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    
    starField = new THREE.Points(starGeometry, starMaterial);
    firstPersonScene.add(starField);
}

// 横屏模式下调整第一视角渲染器尺寸
function adjustFirstPersonRendererForLandscape() {
    if (!firstPersonInitialized || !firstPersonRenderer || !firstPersonCamera) return;
    
    // 获取当前画布实际尺寸
    const currentWidth = canvas.width;
    const currentHeight = canvas.height;
    
    // 检查是否需要调整尺寸
    const rendererWidth = firstPersonRenderer.domElement.width;
    const rendererHeight = firstPersonRenderer.domElement.height;
    
    if (rendererWidth !== currentWidth || rendererHeight !== currentHeight) {
        console.log(`调整第一视角渲染器尺寸: ${rendererWidth}x${rendererHeight} -> ${currentWidth}x${currentHeight}`);
        
        // 更新渲染器尺寸
        firstPersonRenderer.setSize(currentWidth, currentHeight);
        
        // 更新相机宽高比
        firstPersonCamera.aspect = currentWidth / currentHeight;
        firstPersonCamera.updateProjectionMatrix();
    }
}

// 更新第一视角中的恒星位置
function updateStarsInFirstPersonView(planetP) {
    if (!firstPersonInitialized) return;
    
    // 获取行星P的自转角度
    let planetRotation = 0;
    if (planetP && planetP.rotationAngle) {
        planetRotation = planetP.rotationAngle;
    }
    
    // 确保获取所有三颗恒星
    const stars = bodies.filter(body => body.name !== 'p');
    
    // 临时存储新的恒星对象
    const newStarObjects = [];
    
    // 确保我们有三颗太阳，这是三体问题的核心
    if (stars.length !== 3) {
        console.warn('预期有三颗太阳，但实际获取到:', stars.length);
    }
    
    // 观察者位于行星P的位置
    const observerX = planetP.x;
    const observerY = planetP.y;
    const observerZ = planetP.z;
    
    // 为每颗恒星创建或更新对象
    stars.forEach(star => {
        // 计算恒星相对于观察者的位置
        const dx = star.x - observerX;
        const dy = star.y - observerY;
        const dz = star.z - observerZ;
        
        // 计算距离
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // 飞星判断逻辑：当恒星与行星距离大于900时成为飞星
        let isFlyingStar = false;
        if (distance > 900) {
            isFlyingStar = true;
            // 在第一视角下，飞星显示为白色
            star.color = '#ffffff';
        } else {
            // 恢复原来的恒星颜色
            star.color = getSpectralColor(star.mass);
        }
        
        // 应用用户描述的天球坐标系算法
        // 1. 计算恒星与行星连线与垂直面的夹角（纬度）
        // 垂直面是垂直于Y轴的平面，纬度是连线与这个平面的夹角
        const latitude = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
        
        // 2. 计算恒星在垂直面上的投影
        const projectionX = dx;
        const projectionZ = dz;
        
        // 3. 计算投影线的方位角（经度）
        // 仅基于恒星的实际位置，不受观察者视角旋转影响
        let longitude = Math.atan2(projectionX, projectionZ);
        
        // 创建一个表示天穹旋转的向量
        // 由于天穹绕X轴旋转，我们需要应用这个旋转到太阳的位置向量上
        // 这里先不直接添加skyRotation，而是在计算最终位置时应用向量旋转
        
        // 将经度标准化到[-π, π]范围
        while (longitude > Math.PI) longitude -= 2 * Math.PI;
        while (longitude < -Math.PI) longitude += 2 * Math.PI;
        
        // 5. 将新的坐标系投影到天穹上
        // 纬度相对于地面固定，不受观察者视角影响
        
        // 将经度和纬度转换为3D空间中的位置
        const skyRadius = 490; // 稍微小于天穹半径
        
        // 计算太阳在天穹上的基础位置向量
        let x = skyRadius * Math.cos(latitude) * Math.sin(longitude);
        let y = skyRadius * Math.sin(latitude);
        let z = skyRadius * Math.cos(latitude) * Math.cos(longitude);
        
        // 应用天穹旋转向量 - 绕X轴旋转skyRotation角度
        // 使用三维旋转矩阵进行向量旋转
        const cos = Math.cos(skyRotation);
        const sin = Math.sin(skyRotation);
        
        // 绕X轴旋转的旋转矩阵
        // x保持不变
        // y' = y*cos(θ) - z*sin(θ)
        // z' = y*sin(θ) + z*cos(θ)
        const yRotated = y * cos - z * sin;
        const zRotated = y * sin + z * cos;
        
        // 更新位置向量
        y = yRotated;
        z = zRotated;
        
        // 检查恒星是否被内部球壳遮挡
        // 计算观察者在球壳上的位置向量
        const observerPos = new THREE.Vector3(
            innerSphereRadius * Math.cos(observerLatitude) * Math.sin(observerLongitude),
            innerSphereRadius * Math.sin(observerLatitude),
            innerSphereRadius * Math.cos(observerLatitude) * Math.cos(observerLongitude)
        ).normalize();
        
        // 计算恒星在天穹上的位置向量
        const starPos = new THREE.Vector3(x, y, z).normalize();
        
        // 计算观察者位置和恒星位置的点积
        // 如果点积为正，说明恒星在观察者可见的半球上
        const dotProduct = observerPos.dot(starPos);
        
        // 如果点积小于0，说明恒星在球壳的另一边，被遮挡了
        const isOccluded = dotProduct < 0;
        
        if (isOccluded) {
            // 恒星被遮挡，跳过创建
            return;
        }
        
        // 创建恒星对象 - 根据距离动态调整大小，增强远距离变小效果
        // 基础大小根据距离缩放，距离越近越大，距离越远越小
        let baseSize = star.radius * 2;
        let distanceScale = Math.max(0.1, Math.min(12, 500 / distance)); // 距离500时为原始大小，距离越近越大，最大12倍，最小0.1倍
        
        // 如果是飞星，调整大小和亮度
        if (isFlyingStar) {
            baseSize = star.radius * 1.5; // 飞星更大
            distanceScale = Math.max(0.5, Math.min(5, 300 / distance)); // 飞星更明显
        }
        
        // 计算恒星大小
        let calculatedSize = baseSize * distanceScale;
        const starSize = Math.max(1, Math.min(60, calculatedSize)); // 飞星最小尺寸更大
        const starGeometry = new THREE.SphereGeometry(starSize, 32, 32); // 增加分段数使太阳更接近圆形
        
        // 根据距离调整亮度 - 大幅增强近距离亮度效果
        let brightness = Math.max(0.5, Math.min(15, 3 - distance * 0.006)); // 提高基础亮度、最大亮度和影响范围
        
        // 飞星也明亮
        if (isFlyingStar) {
            brightness = Math.max(1, Math.min(8, 2 - distance * 0.001));
        }
        
        // 使用光谱颜色
        const spectralColor = getSpectralColor(star.mass);
        
        // 直接使用star对象的color属性，确保光晕颜色与恒星本身颜色一致
        const starColor = star.color || spectralColor;
        
        // 创建恒星核心材质
        const starMaterial = new THREE.MeshBasicMaterial({
            color: starColor
        });
        
        const starMesh = new THREE.Mesh(starGeometry, starMaterial);
        starMesh.position.set(x, y, z);
        
        // 添加平滑光晕效果 - 应用旁观模式的渲染方式，但光晕大小调整为恒星半径的0.5倍左右
        let glowMeshes = [];
        
        // 解析光谱颜色为RGB值
        let r, g, b;
        if (starColor.startsWith('#')) {
            const hex = starColor.slice(1);
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
        } else if (starColor.startsWith('rgb(')) {
            const rgbMatch = starColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
                r = parseInt(rgbMatch[1]);
                g = parseInt(rgbMatch[2]);
                b = parseInt(rgbMatch[3]);
            } else {
                r = g = b = 255;
            }
        } else {
            // 如果不是十六进制颜色，尝试使用THREE.Color直接解析
            const tempColor = new THREE.Color(starColor);
            r = Math.round(tempColor.r * 255);
            g = Math.round(tempColor.g * 255);
            b = Math.round(tempColor.b * 255);
        }
        
        // 自定义着色器材质，实现光晕从中心到边缘的平滑渐变效果，并确保光晕不会出现在地面以下
        const createGlowMaterial = (color, maxOpacity) => {
            return new THREE.ShaderMaterial({
                uniforms: {
                    color: { value: color },
                    maxOpacity: { value: maxOpacity }
                },
                vertexShader: `
                    varying vec2 vUv;
                    
                    void main() {
                        vUv = uv;
                        

                        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color;
                    uniform float maxOpacity;
                    varying vec2 vUv;
                    
                    void main() {
                        // 计算从中心到边缘的距离（0-1）
                        vec2 center = vec2(0.5, 0.5);
                        float distance = length(vUv - center) * 2.0; // 映射到0-1范围
                        
                        // 使用平滑的衰减函数，使光晕从中心到边缘逐渐淡出到完全透明
                        // 减小衰减因子，使光晕更加明显
                        float opacity = maxOpacity * exp(-distance * 2.0);
                        

                        
                        gl_FragColor = vec4(color, opacity);
                    }
                `,
                transparent: true,
                depthWrite: false,
                depthTest: false,
                blending: THREE.AdditiveBlending
            });
        };
        
        // 添加光晕（不再检查地面）
        if (isFlyingStar) {
                // 飞星有明显的光晕
                const innerGlowRadius = starSize * 2;
                const innerGlowGeometry = new THREE.SphereGeometry(innerGlowRadius, 32, 32);
                const innerGlowMaterial = createGlowMaterial(new THREE.Color(r/255, g/255, b/255), 0.8);
                const innerGlowMesh = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
                innerGlowMesh.position.set(x, y, z);
                innerGlowMesh.renderOrder = -1;
                firstPersonScene.add(innerGlowMesh);
                glowMeshes.push(innerGlowMesh);
                
                const outerGlowRadius = starSize * 3;
                const outerGlowGeometry = new THREE.SphereGeometry(outerGlowRadius, 32, 32);
                const outerGlowMaterial = createGlowMaterial(new THREE.Color(r/255, g/255, b/255), 0.4);
                const outerGlowMesh = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
                outerGlowMesh.position.set(x, y, z);
                outerGlowMesh.renderOrder = -1;
                firstPersonScene.add(outerGlowMesh);
                glowMeshes.push(outerGlowMesh);
            } else {
                // 内层光晕（柔和的光晕，使用自定义着色器实现平滑渐变）- 增加透明度使光晕更明显
                const innerGlowRadius = starSize * 1.2; // 增大尺寸为恒星的1.2倍
                const innerGlowGeometry = new THREE.SphereGeometry(innerGlowRadius, 32, 32);
                const innerGlowMaterial = createGlowMaterial(new THREE.Color(r/255, g/255, b/255), 1); // 透明度从0.3增加到0.8
                const innerGlowMesh = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
                innerGlowMesh.position.set(x, y, z);
                innerGlowMesh.renderOrder = -1; // 确保光晕在地面之前渲染
                firstPersonScene.add(innerGlowMesh);
                glowMeshes.push(innerGlowMesh);
                
                // 外层光晕（更弱更弥散的光晕，使用自定义着色器实现平滑渐变）- 增加透明度使光晕更明显
                const outerGlowRadius = starSize * 1.8; // 增大尺寸为恒星的1.8倍
                const outerGlowGeometry = new THREE.SphereGeometry(outerGlowRadius, 32, 32);
                const outerGlowMaterial = createGlowMaterial(new THREE.Color(r/255, g/255, b/255), 0.6); // 透明度从0.35增加到0.6
                const outerGlowMesh = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
                outerGlowMesh.position.set(x, y, z);
                outerGlowMesh.renderOrder = -1; // 确保光晕在地面之前渲染
                firstPersonScene.add(outerGlowMesh);
                glowMeshes.push(outerGlowMesh);
            }
        
        firstPersonScene.add(starMesh);
        
        const typeLabel = isFlyingStar ? '(飞星)' : '(太阳)';
        
        // 创建恒星名称标注
        try {
                const starNameDiv = document.createElement('div');
                starNameDiv.className = 'star-label';
                starNameDiv.textContent = star.name;
                starNameDiv.style.color = '#ffffff';
                starNameDiv.style.fontSize = '14px';
                starNameDiv.style.fontWeight = 'bold';
                starNameDiv.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.6)';
                starNameDiv.style.pointerEvents = 'none';
                starNameDiv.style.userSelect = 'none';
                starNameDiv.style.transform = 'translate(-50%, -50%)';
                
                // 存储标注元素和关联的恒星信息
                const labelInfo = {
                    element: starNameDiv,
                    star: star,
                    position: new THREE.Vector3(x, y, z)
                };
                
                labelContainer.appendChild(starNameDiv);
                starLabels.push(labelInfo);
                console.log(`为恒星 ${star.name} 创建文本标注`);
            } catch (error) {
                console.warn(`创建恒星 ${star.name} 文本标注失败:`, error);
            }
        
        // 计算太阳中心到行星表面的垂直距离
        const sunRadius = 10; // 太阳半径
        const planetRadius = 20; // 行星P半径
        const sunCenterToSurface = y - planetRadius;
        
        // 固定为可见状态
        const visibilityLabel = '(可见)';
        const visibilityRatio = 1.0; // 可见比例，用于亮度计算
        
        // 为恒星设置观察者坐标系中的位置，用于高度角计算
        star.screenX = x;
        star.screenY = y;
        star.screenZ = z;
        
        // 保存到新的恒星对象数组
        newStarObjects.push({
            mesh: starMesh,
            glowMeshes: glowMeshes,
            star: star,
            distance: distance,
            brightness: brightness,
            typeLabel: typeLabel,
            visibilityLabel: visibilityLabel,
            visibilityRatio: visibilityRatio,
            sunCenterToSurface: sunCenterToSurface
        });
    });
    
    // 清除未被复用的旧恒星对象
    starObjects.forEach(star => {
        firstPersonScene.remove(star.mesh);
        // 释放几何体和材质内存
        if (star.mesh.geometry) star.mesh.geometry.dispose();
        if (star.mesh.material) {
            if (Array.isArray(star.mesh.material)) {
                star.mesh.material.forEach(material => material.dispose());
            } else {
                star.mesh.material.dispose();
            }
        }
        
        // 清除光晕网格对象
        if (star.glowMeshes && star.glowMeshes.length > 0) {
            star.glowMeshes.forEach(glowMesh => {
                firstPersonScene.remove(glowMesh);
                if (glowMesh.geometry) glowMesh.geometry.dispose();
                if (glowMesh.material) {
                    if (Array.isArray(glowMesh.material)) {
                        glowMesh.material.forEach(material => material.dispose());
                    } else {
                        glowMesh.material.dispose();
                    }
                }
            });
        }
    });
    
    // 清除旧的恒星名称标签
    starLabels.forEach(labelInfo => {
        if (labelInfo.element && labelInfo.element.parentElement) {
            labelInfo.element.parentElement.removeChild(labelInfo.element);
        }
    });
    starLabels = [];
    
    // 替换为新的恒星对象数组
    starObjects = newStarObjects;
    
    // 更新天空颜色根据太阳距离（原有配色方法）
    updateSkyDomeColor(stars, planetP);
    
    // 更新地面亮度
    updateGroundBrightness();
    
    // 更新动态点光源的位置和强度
    updateDynamicLights(stars, planetP);
    
    // 更新大气效果
    updateAtmosphere(stars, planetP);
    
    // 更新星云
    updateNebulasInFirstPersonView(planetP);
}

// 更新第一视角中的星云
// 星云运动完全符合天体真实视运动规律：
// 1. 星云投影到天球上，位置随天球自转而改变（沿天球自转轴做圆周运动）
// 2. 星云始终面向玩家，形状不会自旋
// 3. 星云与背景星空保持相对静止
function updateNebulasInFirstPersonView(planetP) {
    if (!firstPersonInitialized) return;
    
    // 观察者位于行星P的位置
    const observerX = planetP.x;
    const observerY = planetP.y;
    const observerZ = planetP.z;
    
    // 临时存储新的星云对象
    const newNebulaObjects = [];
    
    for (let nebula of nebulas) {
        // 计算星云相对于观察者的位置
        const dx = nebula.x - observerX;
        const dy = nebula.y - observerY;
        const dz = nebula.z - observerZ;
        
        let x, y, z, nebulaSize;
        
        // 所有星云都投影到天球上
        // 纬度：星云与观察者连线与水平面（XZ平面）的夹角
        const latitude = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
        // 经度：星云在水平面上的投影与正北方向（Z轴）的夹角
        let longitude = Math.atan2(dx, dz);
        
        // 标准化经度到[-π, π]范围
        while (longitude > Math.PI) longitude -= 2 * Math.PI;
        while (longitude < -Math.PI) longitude += 2 * Math.PI;
        
        // 将经纬度转换为3D空间中的位置（未旋转前）
        const skyRadius = 480;
        x = skyRadius * Math.cos(latitude) * Math.sin(longitude);
        y = skyRadius * Math.sin(latitude);
        z = skyRadius * Math.cos(latitude) * Math.cos(longitude);
        
        // 应用天球自转（绕X轴旋转skyRotation角度）
        // 这是天体视运动的核心：所有天体都随着天球一起绕天球自转轴旋转
        const cos = Math.cos(skyRotation);
        const sin = Math.sin(skyRotation);
        const yRotated = y * cos - z * sin;
        const zRotated = y * sin + z * cos;
        y = yRotated;
        z = zRotated;
        
        nebulaSize = nebula.currentRadius * 0.3;
        
        // 根据相机到星云的距离动态调整星云大小 - 离得越近越大
        if (babylonCamera) {
            // 计算相机到星云的距离
            const distance = Math.sqrt(
                (babylonCamera.position.x - x) * (babylonCamera.position.x - x) +
                (babylonCamera.position.y - y) * (babylonCamera.position.y - y) +
                (babylonCamera.position.z - z) * (babylonCamera.position.z - z)
            );
            
            // 距离越近，星云越大；距离越远，星云越小
            // 使用对数函数来让大小变化更自然
            const baseDistance = 480; // 基准距离
            const sizeMultiplier = Math.max(0.2, Math.min(10.0, 1.0 + (baseDistance - distance) / baseDistance * 1.5));
            nebulaSize *= sizeMultiplier;
        }
        
        // 解析星云颜色
        let r1, g1, b1;
        if (nebula.color1.startsWith('#')) {
            const hex = nebula.color1.slice(1);
            r1 = parseInt(hex.slice(0, 2), 16) / 255;
            g1 = parseInt(hex.slice(2, 4), 16) / 255;
            b1 = parseInt(hex.slice(4, 6), 16) / 255;
        } else {
            r1 = g1 = b1 = 0.8;
        }
        
        let r2, g2, b2;
        if (nebula.color2.startsWith('#')) {
            const hex = nebula.color2.slice(1);
            r2 = parseInt(hex.slice(0, 2), 16) / 255;
            g2 = parseInt(hex.slice(2, 4), 16) / 255;
            b2 = parseInt(hex.slice(4, 6), 16) / 255;
        } else {
            r2 = g2 = b2 = 0.6;
        }
        
        const tempFactor = Math.max(0.5, Math.min(1, nebula.temperature / 10000));
        
        // 创建多层星云效果
        const layers = 4;
        for (let layer = 0; layer < layers; layer++) {
            const layerScale = 0.5 + (layer / layers) * 0.7;
            const layerSize = nebulaSize * layerScale;
            const layerAlpha = 1.0 - (layer / layers) * 0.5;
            const layerOffset = nebula.layerOffsets[layer % nebula.layerOffsets.length];
            const shapeData = nebula.layerShapeData[layer % nebula.layerShapeData.length];
            
            // 创建球体几何体并应用预计算的不规则形状
            // 使用更高的分段数以获得更平滑的星云形状
            const segments = 32;
            const rings = 20;
            const layerGeometry = new THREE.SphereGeometry(layerSize, segments, rings);
            
            // 应用不规则形状
            const positions = layerGeometry.attributes.position.array;
            for (let i = 0, vertexIndex = 0; i <= rings; i++) {
                for (let j = 0; j <= segments; j++) {
                    const idx = vertexIndex * 3;
                    const px = positions[idx];
                    const py = positions[idx + 1];
                    const pz = positions[idx + 2];
                    
                    const length = Math.sqrt(px * px + py * py + pz * pz);
                    if (length > 0) {
                        const nx = px / length;
                        const ny = py / length;
                        const nz = pz / length;
                        
                        // 获取这个方向的有效半径
                        const dataIndex = i * (segments + 1) + j;
                        const effectiveRadius = shapeData[dataIndex] || 0.75;
                        
                        // 应用不规则形状
                        positions[idx] = nx * layerSize * effectiveRadius;
                        positions[idx + 1] = ny * layerSize * effectiveRadius;
                        positions[idx + 2] = nz * layerSize * effectiveRadius;
                    }
                    vertexIndex++;
                }
            }
            layerGeometry.attributes.position.needsUpdate = true;
            layerGeometry.computeVertexNormals();
            
            const layerMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    color1: { value: new THREE.Color(r1, g1, b1) },
                    color2: { value: new THREE.Color(r2, g2, b2) },
                    temperature: { value: tempFactor },
                    layerAlpha: { value: layerAlpha },
                    layerSize: { value: layerSize },
                    randomSeed: { value: nebula.randomSeed },
                    layerOffsetX: { value: layerOffset.x },
                    layerOffsetY: { value: layerOffset.y }
                },
                vertexShader: `
                    varying vec3 vPosition;
                    
                    void main() {
                        vPosition = position;
                        gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color1;
                    uniform vec3 color2;
                    uniform float temperature;
                    uniform float layerAlpha;
                    uniform float layerSize;
                    varying vec3 vPosition;
                    
                    void main() {
                        vec3 normPos = vPosition / layerSize;
                        float distanceToCenter = length(normPos);
                        
                        if (distanceToCenter > 1.0) {
                            discard;
                        }
                        
                        float coreFactor = 1.0 - distanceToCenter;
                        coreFactor = pow(coreFactor, 0.5);
                        
                        vec3 mixedColor1 = color1 * 0.6 + color2 * 0.4;
                        vec3 mixedColor2 = color1 * 0.4 + color2 * 0.6;
                        vec3 color = mix(mixedColor1, mixedColor2, smoothstep(0.2, 0.8, distanceToCenter));
                        
                        float alpha = coreFactor * temperature * layerAlpha * 0.9;
                        
                        vec3 brightColor = color * (1.0 + coreFactor * 0.3);
                        
                        gl_FragColor = vec4(brightColor, alpha);
                    }
                `,
                transparent: true,
                depthWrite: false,
                depthTest: false,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            });
            
            const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
            layerMesh.position.set(x, y, z);
            layerMesh.renderOrder = -4 + layer;
            
            firstPersonScene.add(layerMesh);
            newNebulaObjects.push({
                mesh: layerMesh,
                nebula: nebula
            });
        }
    }
    
    // 清除旧的星云对象
    nebulaObjects.forEach(nebulaObj => {
        firstPersonScene.remove(nebulaObj.mesh);
        if (nebulaObj.mesh.geometry) nebulaObj.mesh.geometry.dispose();
        if (nebulaObj.mesh.material) nebulaObj.mesh.material.dispose();
    });
    
    nebulaObjects = newNebulaObjects;
}

// 更新第一视角中的爆炸
// 冲击波相关变量
let shockwaveObjects = [];

function updateShockwavesInFirstPersonView(planetP) {
    if (!firstPersonInitialized) return;
    
    // 观察者位于行星P的位置
    const observerX = planetP.x;
    const observerY = planetP.y;
    const observerZ = planetP.z;
    
    // 临时存储新的冲击波对象
    const newShockwaveObjects = [];
    
    for (let shockwave of shockwaves) {
        if (!shockwave.isActive) continue;
        
        // 计算冲击波相对于观察者的位置
        const dx = shockwave.x - observerX;
        const dy = shockwave.y - observerY;
        const dz = shockwave.z - observerZ;
        
        // 所有冲击波都投影到天球上
        const latitude = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
        let longitude = Math.atan2(dx, dz);
        
        while (longitude > Math.PI) longitude -= 2 * Math.PI;
        while (longitude < -Math.PI) longitude += 2 * Math.PI;
        
        const skyRadius = 485;
        let x = skyRadius * Math.cos(latitude) * Math.sin(longitude);
        let y = skyRadius * Math.sin(latitude);
        let z = skyRadius * Math.cos(latitude) * Math.cos(longitude);
        
        const cos = Math.cos(skyRotation);
        const sin = Math.sin(skyRotation);
        const yRotated = y * cos - z * sin;
        const zRotated = y * sin + z * cos;
        y = yRotated;
        z = zRotated;
        
        const shockwaveSize = shockwave.radius * 0.4;
        const progress = shockwave.age / shockwave.maxAge;
        const alphaFactor = 1 - progress * 0.9;
        
        // 解析冲击波颜色
        let r1, g1, b1;
        if (shockwave.color1.startsWith('#')) {
            const hex = shockwave.color1.slice(1);
            r1 = parseInt(hex.slice(0, 2), 16) / 255;
            g1 = parseInt(hex.slice(2, 4), 16) / 255;
            b1 = parseInt(hex.slice(4, 6), 16) / 255;
        } else {
            r1 = g1 = b1 = 1.0;
        }
        
        let r2, g2, b2;
        if (shockwave.color2.startsWith('#')) {
            const hex = shockwave.color2.slice(1);
            r2 = parseInt(hex.slice(0, 2), 16) / 255;
            g2 = parseInt(hex.slice(2, 4), 16) / 255;
            b2 = parseInt(hex.slice(4, 6), 16) / 255;
        } else {
            r2 = g2 = b2 = 0.8;
        }
        
        // 绘制冲击波前沿（一个明亮的薄壳）
        const shellThickness = Math.max(5, shockwaveSize * 0.05);
        const outerSize = shockwaveSize;
        const innerSize = Math.max(0, shockwaveSize - shellThickness);
        
        // 创建外球
        const outerGeometry = new THREE.SphereGeometry(outerSize, 32, 32);
        const outerMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color1: { value: new THREE.Color(1.0, 1.0, 1.0) },
                color2: { value: new THREE.Color(r1, g1, b1) },
                innerSize: { value: innerSize / outerSize },
                alpha: { value: alphaFactor }
            },
            vertexShader: `
                varying vec3 vPosition;
                
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                uniform float innerSize;
                uniform float alpha;
                varying vec3 vPosition;
                
                void main() {
                    float distanceToCenter = length(vPosition);
                    
                    if (distanceToCenter < innerSize || distanceToCenter > 1.0) {
                        discard;
                    }
                    
                    float shellFactor = 1.0 - abs(distanceToCenter - (innerSize + 1.0) * 0.5) / (1.0 - innerSize);
                    shellFactor = pow(shellFactor, 0.5);
                    
                    vec3 color = mix(color2, color1, shellFactor);
                    float finalAlpha = shellFactor * alpha;
                    
                    gl_FragColor = vec4(color, finalAlpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        
        const outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
        outerMesh.position.set(x, y, z);
        outerMesh.renderOrder = -5;
        firstPersonScene.add(outerMesh);
        newShockwaveObjects.push({
            mesh: outerMesh,
            shockwave: shockwave
        });
    }
    
    // 清除旧的冲击波对象
    shockwaveObjects.forEach(shockwaveObj => {
        firstPersonScene.remove(shockwaveObj.mesh);
        if (shockwaveObj.mesh.geometry) shockwaveObj.mesh.geometry.dispose();
        if (shockwaveObj.mesh.material) shockwaveObj.mesh.material.dispose();
    });
    
    shockwaveObjects = newShockwaveObjects;
}

// 更新动态点光源
function updateDynamicLights(stars, planetP) {
    if (!sunLight || !sunLight2 || !sunLight3) return;
    
    const lights = [sunLight, sunLight2, sunLight3];
    
    stars.forEach((star, index) => {
        if (index >= lights.length) return;
        
        const light = lights[index];
        const dx = star.x - planetP.x;
        const dy = star.y - planetP.y;
        const dz = star.z - planetP.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // 将恒星位置转换为天球坐标系
        const latitude = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
        let longitude = Math.atan2(dx, dz);
        
        // 应用天穹旋转
        const skyRadius = 100; // 光源距离更近以产生更真实的光照
        let x = skyRadius * Math.cos(latitude) * Math.sin(longitude);
        let y = skyRadius * Math.sin(latitude);
        let z = skyRadius * Math.cos(latitude) * Math.cos(longitude);
        
        const cos = Math.cos(skyRotation);
        const sin = Math.sin(skyRotation);
        const yRotated = y * cos - z * sin;
        const zRotated = y * sin + z * cos;
        
        y = yRotated;
        z = zRotated;
        
        // 更新光源位置
        light.position.set(x, y, z);
        
        // 根据距离调整光源强度 - 距离越近越亮
        const baseIntensity = index === 0 ? 2 : (index === 1 ? 1.5 : 1.2);
        const intensityScale = Math.max(0.1, Math.min(3, 150 / distance));
        light.intensity = baseIntensity * intensityScale;
        
        // 根据恒星质量设置光源颜色
        const starColor = new THREE.Color(getSpectralColor(star.mass));
        light.color.copy(starColor);
        
        // 如果恒星在地面以下，减弱光照
        if (y < -5) {
            light.intensity *= 0.3;
        }
    });
}

// 更新大气效果
function updateAtmosphere(stars, planetP) {
    if (!skyDome || !atmosphericFog) return;
    
    let totalBrightness = 0;
    let dominantColor = new THREE.Color(0x000011);
    
    stars.forEach((star, index) => {
        const dx = star.x - planetP.x;
        const dy = star.y - planetP.y;
        const dz = star.z - planetP.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // 计算恒星高度角
        const latitude = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
        
        // 只有在地平线以上的恒星才影响大气
        if (latitude > -0.2) {
            const starBrightness = Math.max(0, Math.min(2, 100 / distance));
            totalBrightness += starBrightness;
            
            // 混合恒星颜色
            const starColor = new THREE.Color(getSpectralColor(star.mass));
            dominantColor.lerp(starColor, starBrightness / (totalBrightness + 0.1));
        }
    });
    
    // 更新天空颜色
    const skyBaseColor = new THREE.Color(0x000022);
    const skySunsetColor = new THREE.Color(0xff6633);
    const skyDayColor = dominantColor.clone().multiplyScalar(0.5);
    
    const skyColor = new THREE.Color();
    if (totalBrightness > 0.5) {
        // 白天 - 混合主恒星颜色
        skyColor.lerpColors(skyBaseColor, skyDayColor, Math.min(1, totalBrightness / 2));
    } else if (totalBrightness > 0.1) {
        // 黄昏/黎明 - 橙红色天空
        skyColor.lerpColors(skyBaseColor, skySunsetColor, totalBrightness / 0.5);
    } else {
        // 夜晚 - 深色天空
        skyColor.copy(skyBaseColor);
    }
    
    skyDome.material.color.copy(skyColor);
    
    // 更新雾效
    const fogColor = skyColor.clone().multiplyScalar(0.8);
    atmosphericFog.color.copy(fogColor);
    atmosphericFog.density = 0.001 + totalBrightness * 0.001;
}

// 计算总亮度的函数（不依赖UI更新）
function calculateTotalBrightness() {
    const planetP = bodies.find(body => body.name === 'p');
    const celestialBodies = bodies.filter(body => body.name !== 'p');
    
    if (!planetP || celestialBodies.length === 0) {
        currentTotalBrightness = 0;
        return;
    }
    
    let totalBrightness = 0;
    let starCount = 0;
    
    celestialBodies.forEach((body) => {
        // 计算天体到行星的距离
        const dx = body.x - planetP.x;
        const dy = body.y - planetP.y;
        const dz = body.z - planetP.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // 计算恒星高度角
        const starScreenX = body.screenX || 0;
        const starScreenY = body.screenY || 0;
        const starScreenZ = body.screenZ || 0;
        
        const observerY = starScreenY;
        const observerHorizontalDistance = Math.sqrt(starScreenX * starScreenX + starScreenZ * starScreenZ);
        
        let heightAngle = 0;
        if (observerHorizontalDistance > 0) {
            heightAngle = Math.atan(observerY / observerHorizontalDistance) * (180 / Math.PI);
        } else if (observerY > 0) {
            heightAngle = 90;
        } else if (observerY < 0) {
            heightAngle = -90;
        }
        
        // 判断恒星状态
        let starStatus = '';
        // 初始化previousStarHeights对象，如果不存在
        if (!previousStarHeights) {
            previousStarHeights = {};
        }
        const previousHeight = previousStarHeights[body.name] || heightAngle;
        
        if (heightAngle >= 10 && heightAngle <= 90) {
            starStatus = '升起';
        } else if (heightAngle >= -90 && heightAngle <= -10) {
            starStatus = '落下';
        } else if (heightAngle > -10 && heightAngle < 10) {
            // 在地平线附近（-10到10度），需要更精确的判断
            if (heightAngle > previousHeight) {
                // 高度角在增加，可能是日出或从落下变为升起
                if (previousHeight <= -10) {
                    // 从落下状态变为升起，是日出
                    starStatus = '日出';
                } else {
                    // 已经在地平线附近，高度角增加，继续认为是日出
                    starStatus = '日出';
                }
            } else {
                // 高度角在减少，可能是日落或从升起变为落下
                if (previousHeight >= 10) {
                    // 从升起状态变为落下，是日落
                    starStatus = '日落';
                } else {
                    // 已经在地平线附近，高度角减少，继续认为是日落
                    starStatus = '日落';
                }
            }
        }
        
        // 更新上一次的高度角
        previousStarHeights[body.name] = heightAngle;
        
        // 计算亮度
        const massFactor = Math.min(body.mass / 10, 1);
        const distanceFactor = Math.min(100 / distance, 1);
        let brightness = massFactor * distanceFactor * 100;
        
        // 根据恒星状态调整亮度
        if (starStatus === '落下') {
            brightness = brightness * 0;
        } else if (starStatus === '日出' || starStatus === '日落') {
            const transitionFactor = (heightAngle + 10) / 20;
            brightness = brightness * transitionFactor;
        }
        
        brightness = Math.max(0, Math.min(100, brightness));
        totalBrightness += brightness;
        starCount++;
    });
    
    const averageBrightness = starCount > 0 ? totalBrightness / starCount : 0;
    currentTotalBrightness = averageBrightness;
}

// 更新地面亮度
function updateGroundBrightness() {
    // 查找内部球壳
    const innerSphere = firstPersonScene.children.find(child => child.name === 'innerSphere');
    if (!innerSphere) return;
    
    // 根据总亮度计算地面颜色（原有配色方法）
    const normalizedBrightness = Math.max(0, Math.min(1, currentTotalBrightness / 60)); // 0-60映射到0-1
    
    // 深灰色（最暗）
    const baseR = 64, baseG = 64, baseB = 64; // 深灰色 #404040
    // 明亮的浅灰色（最亮）
    const brightR = 200, brightG = 200, brightB = 200;
    
    // 使用线性插值计算最终颜色
    const finalR = Math.floor(baseR + (brightR - baseR) * normalizedBrightness);
    const finalG = Math.floor(baseG + (brightG - baseG) * normalizedBrightness);
    const finalB = Math.floor(baseB + (brightB - baseB) * normalizedBrightness);
    
    const groundColor = new THREE.Color(finalR/255, finalG/255, finalB/255);
    innerSphere.material.color = groundColor;
}

// 更新天空颜色根据太阳距离（原有配色方法）
function updateSkyDomeColor(stars, planetP) {
    if (!skyDome) return;
    
    // 根据总亮度计算天空颜色（深普蓝到浅蓝）
    const normalizedBrightness = Math.max(0, Math.min(1, currentTotalBrightness / 60)); // 0-60映射到0-1
    
    // 深普蓝（最暗）
    const darkR = 25, darkG = 25, darkB = 112; // #191970
    // 浅蓝（最亮）
    const brightR = 135, brightG = 206, brightB = 235; // #87CEEB
    
    // 使用线性插值计算最终颜色
    const finalR = darkR + (brightR - darkR) * normalizedBrightness;
    const finalG = darkG + (brightG - darkG) * normalizedBrightness;
    const finalB = darkB + (brightB - darkB) * normalizedBrightness;
    
    const skyColor = new THREE.Color(finalR/255, finalG/255, finalB/255);
    
    // 更新天穹颜色
    skyDome.material.color = skyColor;
    
    // 根据亮度调整透明度（亮度越低，天空越透明）
    const opacity = 0.5 + normalizedBrightness * 0.45; // 从0.5到0.95
    skyDome.material.opacity = opacity;
}

// 用于跟踪天穹和恒星的旋转角度
let skyRotation = 0;

// 渲染第一视角场景
function renderFirstPersonScene() {
    if (!firstPersonInitialized) return;
    
    // 确保渲染器尺寸匹配当前canvas尺寸
    if (firstPersonRenderer && 
        (firstPersonRenderer.domElement.width !== canvas.width || 
         firstPersonRenderer.domElement.height !== canvas.height)) {
        firstPersonRenderer.setSize(canvas.width, canvas.height);
        firstPersonCamera.aspect = canvas.width / canvas.height;
        firstPersonCamera.updateProjectionMatrix();
    }
    
    // 计算每10刻旋转一圈的角度增量
    // 根据当前速度因子调整旋转速度
    const rotationSpeed = (2 * Math.PI) / 10; // 每10刻旋转一圈的速度
    
    // 只有在模拟运行时才更新旋转角度（避免暂停时继续旋转）
    if (speedFactor > 0) {
        // 每帧更新的角度 = 每刻旋转角度 * 0.01（因为每帧更新0.01时间单位）* 速度因子
        skyRotation += rotationSpeed * 0.01 * speedFactor;
        // 确保角度在0到2π之间循环
        if (skyRotation > 2 * Math.PI) {
            skyRotation -= 2 * Math.PI;
        }
    }
    
    // 第一视角移动控制 - 在内部球壳上移动
    if (isFirstPersonView) {
        const moveDelta = firstPersonMoveSpeed * 0.003; // 每帧移动角度
        
        // 根据面朝方向计算移动
        let forwardMovement = 0;
        let rightMovement = 0;
        
        // W - 向前移动
        if (keys.w) {
            forwardMovement += moveDelta;
        }
        // S - 向后移动
        if (keys.s) {
            forwardMovement -= moveDelta;
        }
        // A - 向左移动
        if (keys.a) {
            rightMovement -= moveDelta;
        }
        // D - 向右移动
        if (keys.d) {
            rightMovement += moveDelta;
        }
        
        // 只有在有移动时才更新位置
        if (forwardMovement !== 0 || rightMovement !== 0) {
            // 当前经纬度
            const lat = observerLatitude;
            const lon = observerLongitude;
            
            // 计算当前位置的3D向量
            const currentPos = new THREE.Vector3(
                Math.cos(lat) * Math.sin(lon),
                Math.sin(lat),
                Math.cos(lat) * Math.cos(lon)
            ).normalize();
            
            // 计算东方向和北方向
            const normal = currentPos.clone();
            const east = new THREE.Vector3(Math.cos(lon), 0, -Math.sin(lon)).normalize();
            const north = new THREE.Vector3();
            north.crossVectors(normal, east).normalize();
            
            // 根据面朝方向（firstPersonRotation）旋转移动方向
            const cos = Math.cos(firstPersonRotation);
            const sin = Math.sin(firstPersonRotation);
            
            // 计算旋转后的移动方向
            const rotatedNorth = new THREE.Vector3();
            rotatedNorth.x = north.x * cos - east.x * sin;
            rotatedNorth.y = north.y * cos - east.y * sin;
            rotatedNorth.z = north.z * cos - east.z * sin;
            
            const rotatedEast = new THREE.Vector3();
            rotatedEast.x = north.x * sin + east.x * cos;
            rotatedEast.y = north.y * sin + east.y * cos;
            rotatedEast.z = north.z * sin + east.z * cos;
            
            // 计算移动向量
            const moveVector = new THREE.Vector3();
            moveVector.addScaledVector(rotatedNorth, forwardMovement);
            moveVector.addScaledVector(rotatedEast, rightMovement);
            
            // 在球面上移动 - 使用球面几何
            // 将当前位置和移动向量结合，得到新的位置
            const newPos = currentPos.clone().add(moveVector).normalize();
            
            // 将新位置转换回经纬度
            const newLat = Math.asin(Math.max(-1, Math.min(1, newPos.y)));
            const newLon = Math.atan2(newPos.x, newPos.z);
            
            // 更新经纬度
            observerLatitude = newLat;
            observerLongitude = newLon;
            
            // 限制纬度范围在 -π/2 到 π/2 之间
            observerLatitude = Math.max(-Math.PI / 2 + 0.001, Math.min(Math.PI / 2 - 0.001, observerLatitude));
            
            // 经度可以自由循环
            while (observerLongitude > Math.PI) observerLongitude -= Math.PI * 2;
            while (observerLongitude < -Math.PI) observerLongitude += Math.PI * 2;
        }
    }
    
    // 根据当前经纬度更新观察者位置和朝向
    const lat = observerLatitude;
    const lon = observerLongitude;
    
    // 更新位置
    cameraContainer.position.x = innerSphereRadius * Math.cos(lat) * Math.sin(lon);
    cameraContainer.position.y = innerSphereRadius * Math.sin(lat);
    cameraContainer.position.z = innerSphereRadius * Math.cos(lat) * Math.cos(lon);
    
    // 计算正确的朝向，确保地平线始终平行于玩家视角
    
    // 1. 从球心指向观察者的方向（表面法线方向）
    const normalDirection = new THREE.Vector3(
        cameraContainer.position.x,
        cameraContainer.position.y,
        cameraContainer.position.z
    ).normalize();
    
    // 2. 东方向（在球壳表面上，增加经度的方向）
    const eastDirection = new THREE.Vector3(
        Math.cos(lon),
        0,
        -Math.sin(lon)
    ).normalize();
    
    // 3. 北方向（在球壳表面上，增加纬度的方向）
    // 通过叉乘计算：北 = 法线 × 东
    const northDirection = new THREE.Vector3();
    northDirection.crossVectors(normalDirection, eastDirection).normalize();
    
    // 4. 构建相机的正交基向量
    // - up向量：指向法线方向（垂直于表面，向上）
    // - right向量：东方向（平行于地平线，向右）
    // - forward向量：北方向（平行于地平线，向前）
    
    // 应用用户的水平旋转（firstPersonRotation）
    // 绕法线方向旋转东和北方向
    const cos = Math.cos(firstPersonRotation);
    const sin = Math.sin(firstPersonRotation);
    
    const rotatedEast = new THREE.Vector3();
    rotatedEast.x = eastDirection.x * cos + northDirection.x * sin;
    rotatedEast.y = eastDirection.y * cos + northDirection.y * sin;
    rotatedEast.z = eastDirection.z * cos + northDirection.z * sin;
    rotatedEast.normalize();
    
    const rotatedNorth = new THREE.Vector3();
    rotatedNorth.x = -eastDirection.x * sin + northDirection.x * cos;
    rotatedNorth.y = -eastDirection.y * sin + northDirection.y * cos;
    rotatedNorth.z = -eastDirection.z * sin + northDirection.z * cos;
    rotatedNorth.normalize();
    
    // 设置相机的up向量为法线方向（确保地平线水平）
    cameraContainer.up = normalDirection.clone();
    
    // 计算观察点：向前看（北方向）
    const lookAtPoint = cameraContainer.position.clone().add(rotatedNorth);
    
    // 让相机看向观察点
    cameraContainer.lookAt(lookAtPoint);
    
    // 应用用户的垂直视角旋转（verticalAngle）
    // 通过旋转相机自身来实现
    firstPersonCamera.rotation.x = -verticalAngle;
    
    // 应用自定义旋转：使天穹和恒星围绕观察者初始视线方向旋转
    // 旋转轴为平行于地面（X轴）
    if (skyDome) {
        // 使用我们自己的旋转角度而不是行星自转
        skyDome.rotation.x = skyRotation;
    }
    
    // 让背景星星也随天穹一起旋转
    if (starField) {
        starField.rotation.x = skyRotation;
    }
    
    // 让太阳也随天穹一起旋转
    if (starObjects && starObjects.length > 0) {
        starObjects.forEach(starObj => {
            if (starObj.mesh) {
                // 应用与天穹相同的旋转角度
                starObj.mesh.rotation.x = skyRotation;
            }
        });
    }
    
    // 星云长轴对准北/南天极（天球自转轴方向）
    // 天球自转轴是X轴，所以星云的长轴应该对准X轴方向
    // 这样星云会随着天球自转而改变方向，与背景星空保持相对静止
    if (nebulaObjects && nebulaObjects.length > 0) {
        nebulaObjects.forEach(nebulaObj => {
            if (nebulaObj.mesh) {
                // 重置旋转
                nebulaObj.mesh.rotation.set(0, 0, 0);
                // 让星云的长轴（Y轴）对准天球自转轴（X轴）
                // 通过旋转使长轴指向北/南天极
                nebulaObj.mesh.rotateZ(Math.PI / 2);
            }
        });
    }
    
    // 渲染场景
    firstPersonRenderer.render(firstPersonScene, firstPersonCamera);
    
    // 渲染CSS2D文本标注
    // 更新文本标注位置
    if (starLabels.length > 0) {
        console.log('更新恒星标注位置，标注数量:', starLabels.length);
        try {
            starLabels.forEach((labelInfo, index) => {
                if (labelInfo.element && labelInfo.star) {
                    // 将3D位置转换为屏幕坐标
                    const vector = labelInfo.position.clone();
                    vector.project(firstPersonCamera);
                    
                    // 转换为屏幕坐标
                    const x = (vector.x * 0.5 + 0.5) * canvas.width;
                    const y = (-vector.y * 0.5 + 0.5) * canvas.height;
                    
                    // 检查是否在屏幕范围内
                    if (vector.z < 1) {
                        labelInfo.element.style.left = x + 'px';
                        labelInfo.element.style.top = y + 'px';
                        labelInfo.element.style.display = 'block';
                        console.log(`标注 ${index} (${labelInfo.star.name}): 位置 (${x.toFixed(1)}, ${y.toFixed(1)}), 显示`);
                    } else {
                        labelInfo.element.style.display = 'none';
                        console.log(`标注 ${index} (${labelInfo.star.name}): 在屏幕后方，隐藏`);
                    }
                } else {
                    console.warn(`标注 ${index}: 元素或恒星信息缺失`);
                }
            });
        } catch (error) {
            console.warn('文本标注位置更新失败:', error);
        }
    } else {
        console.log('没有恒星标注需要更新');
    }
    
    // 将Three.js渲染结果绘制到2D canvas上，确保填满整个画布
    ctx.drawImage(firstPersonRenderer.domElement, 0, 0, canvas.width, canvas.height);
}

// 地面相关变量
let groundTerrain = null;
let debrisStones = [];
let mountainRanges = [];

// 初始化地面地形
function initGroundTerrain() {
    if (groundTerrain) {
        firstPersonScene.remove(groundTerrain);
    }
    
    // 创建起伏的群山地形
    const mountainGeometry = new THREE.PlaneGeometry(800, 800, 64, 64);
    const mountainMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x5a5a5a,
        wireframe: false,
        side: THREE.DoubleSide
    });
    
    // 生成群山高度图
    const vertices = mountainGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        
        // 使用多个正弦波叠加创建起伏的群山效果
        const mountainHeight1 = Math.sin(x * 0.005) * Math.cos(y * 0.005) * 50;
        const mountainHeight2 = Math.sin(x * 0.002) * Math.cos(y * 0.003) * 80;
        const mountainHeight3 = Math.sin(x * 0.008) * Math.cos(y * 0.006) * 30;
        const randomNoise = (Math.random() - 0.5) * 10;
        
        vertices[i + 2] = mountainHeight1 + mountainHeight2 + mountainHeight3 + randomNoise;
    }
    
    mountainGeometry.attributes.position.needsUpdate = true;
    mountainGeometry.computeVertexNormals();
    
    groundTerrain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    groundTerrain.rotation.x = -Math.PI / 2;
    groundTerrain.position.y = -20;
    firstPersonScene.add(groundTerrain);
    
    // 创建随机斑驳的碎石
    createDebrisStones();
}

// 创建随机碎石
function createDebrisStones() {
    // 清除现有碎石
    debrisStones.forEach(stone => {
        firstPersonScene.remove(stone);
    });
    debrisStones = [];
    
    // 创建多个随机碎石
    for (let i = 0; i < 200; i++) {
        const stoneSize = Math.random() * 3 + 0.5;
        const stoneGeometry = new THREE.DodecahedronGeometry(stoneSize, 0);
        
        // 随机碎石颜色（灰色系）
        const grayValue = Math.floor(Math.random() * 60 + 80);
        const stoneMaterial = new THREE.MeshLambertMaterial({
            color: new THREE.Color(grayValue/255, grayValue/255, grayValue/255)
        });
        
        const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
        
        // 随机位置
        stone.position.x = (Math.random() - 0.5) * 600;
        stone.position.y = -20 + Math.random() * 5;
        stone.position.z = (Math.random() - 0.5) * 600;
        
        // 随机旋转
        stone.rotation.x = Math.random() * Math.PI;
        stone.rotation.y = Math.random() * Math.PI;
        stone.rotation.z = Math.random() * Math.PI;
        
        firstPersonScene.add(stone);
        debrisStones.push(stone);
    }
}

// 绘制地面
function drawGround(brightness = 0) {
    // 获取三颗恒星
    const stars = bodies.filter(body => body.name !== 'p');
    const planetP = bodies.find(body => body.name === 'p');
    
    // 使用太阳中心到地平线的距离来计算地面亮度
    let uniformGroundBrightness = 0;
    
    stars.forEach(star => {
        const dx = star.x - planetP.x;
        const dy = star.y - planetP.y;
        const dz = star.z - planetP.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // 计算太阳中心到行星表面的垂直距离
        const sunHeight = star.y - planetP.y - 20; // 行星半径为20
        const sunRadius = 10; // 太阳半径
        
        // 将高度标准化到 -2r 到 2r 的范围，实现线性亮度变化
        const normalizedHeight = (sunHeight + sunRadius * 2) / (sunRadius * 4);
        uniformGroundBrightness = Math.max(0, Math.min(1, normalizedHeight));
    });
    
    // 根据总亮度计算地面颜色
    const normalizedBrightness = Math.max(0, Math.min(1, currentTotalBrightness / 60)); // 0-60映射到0-1
    const baseR = 64, baseG = 64, baseB = 64; // 深灰色 #404040
    const brightR = 200, brightG = 200, brightB = 200; // 明亮的浅灰色
    
    // 使用线性插值计算最终颜色
    const finalR = Math.floor(baseR + (brightR - baseR) * normalizedBrightness);
    const finalG = Math.floor(baseG + (brightG - baseG) * normalizedBrightness);
    const finalB = Math.floor(baseB + (brightB - baseB) * normalizedBrightness);
    
    // 更新Three.js地面材质颜色
    if (groundTerrain) {
        groundTerrain.material.color.setRGB(finalR/255, finalG/255, finalB/255);
    }
    
    // 更新碎石颜色
    debrisStones.forEach(stone => {
        const stoneGray = Math.floor(Math.random() * 60 + 80);
        const adjustedGray = Math.floor(stoneGray * (0.5 + normalizedBrightness * 0.5));
        stone.material.color.setRGB(adjustedGray/255, adjustedGray/255, adjustedGray/255);
    });
    
    // 绘制地面渐变（作为背景）
    const groundGradient = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
    groundGradient.addColorStop(0, `rgb(${finalR}, ${finalG}, ${finalB})`);
    groundGradient.addColorStop(0.5, `rgb(${Math.floor(finalR*0.9)}, ${Math.floor(finalG*0.9)}, ${Math.floor(finalB*0.9)})`);
    groundGradient.addColorStop(1, `rgb(${Math.floor(finalR*0.7)}, ${Math.floor(finalG*0.7)}, ${Math.floor(finalB*0.7)})`);
    
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
    
    // 在地平线附近添加一条微弱的分界线，增强地平线效果
    ctx.strokeStyle = `rgba(${Math.floor(finalR*0.8)}, ${Math.floor(finalG*0.8)}, ${Math.floor(finalB*0.8)}, 0.5)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.6);
    ctx.lineTo(canvas.width, canvas.height * 0.6);
    ctx.stroke();
    
    // 在地平线上标注四个方位
    drawCompassDirections(finalR, finalG, finalB);
}

// 绘制方位标注
function drawCompassDirections(r, g, b) {
    const horizonY = canvas.height * 0.6;
    const centerX = canvas.width / 2;
    const textOffset = 60; // 文字距离地平线的偏移
    
    // 设置文字样式
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 根据背景亮度调整文字颜色
    const brightness = (r + g + b) / 3;
    const textColor = brightness > 128 ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)';
    
    // 绘制四个方位
    const directions = [
        { name: '北', x: centerX, y: horizonY - textOffset },
        { name: '南', x: centerX, y: horizonY + textOffset },
        { name: '东', x: centerX + textOffset * 2, y: horizonY },
        { name: '西', x: centerX - textOffset * 2, y: horizonY }
    ];
    
    // 绘制方位文字背景
    ctx.fillStyle = `rgba(${Math.floor(r*0.3)}, ${Math.floor(g*0.3)}, ${Math.floor(b*0.3)}, 0.7)`;
    directions.forEach(dir => {
        const textWidth = ctx.measureText(dir.name).width;
        ctx.fillRect(dir.x - textWidth/2 - 4, dir.y - 10, textWidth + 8, 20);
    });
    
    // 绘制方位文字
    ctx.fillStyle = textColor;
    directions.forEach(dir => {
        ctx.fillText(dir.name, dir.x, dir.y);
    });
    
    // 绘制方位指示线
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]); // 虚线
    
    // 北方向指示线
    ctx.beginPath();
    ctx.moveTo(centerX, horizonY);
    ctx.lineTo(centerX, horizonY - textOffset + 10);
    ctx.stroke();
    
    // 南方向指示线
    ctx.beginPath();
    ctx.moveTo(centerX, horizonY);
    ctx.lineTo(centerX, horizonY + textOffset - 10);
    ctx.stroke();
    
    // 东方向指示线
    ctx.beginPath();
    ctx.moveTo(centerX, horizonY);
    ctx.lineTo(centerX + textOffset * 2 - 10, horizonY);
    ctx.stroke();
    
    // 西方向指示线
    ctx.beginPath();
    ctx.moveTo(centerX, horizonY);
    ctx.lineTo(centerX - textOffset * 2 + 10, horizonY);
    ctx.stroke();
    
    ctx.setLineDash([]); // 重置虚线
}

// 绘制天穹
function drawSkyDome() {
    // 根据总亮度计算天空颜色（深普蓝到浅蓝）
    const normalizedBrightness = Math.max(0, Math.min(1, currentTotalBrightness / 60)); // 0-60映射到0-1
    
    // 深普蓝（最暗）
    const darkR = 25;
    const darkG = 25;
    const darkB = 112;
    
    // 浅蓝（最亮）
    const brightR = 135;
    const brightG = 206;
    const brightB = 235;
    
    // 使用线性插值计算当前亮度的颜色
    const baseR = Math.floor(darkR + (brightR - darkR) * normalizedBrightness);
    const baseG = Math.floor(darkG + (brightG - darkG) * normalizedBrightness);
    const baseB = Math.floor(darkB + (brightB - darkB) * normalizedBrightness);
    
    const midR = Math.floor(darkR + (brightR - darkR - 15) * normalizedBrightness);
    const midG = Math.floor(darkG + (brightG - darkG - 26) * normalizedBrightness);
    const midB = Math.floor(darkB + (brightB - darkB - 45) * normalizedBrightness);
    
    const horizonR = Math.floor(darkR + (brightR - darkR - 35) * normalizedBrightness);
    const horizonG = Math.floor(darkG + (brightG - darkG - 56) * normalizedBrightness);
    const horizonB = Math.floor(darkB + (brightB - darkB - 65) * normalizedBrightness);
    
    // 绘制天空渐变（使用线性亮度变化）
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
    
    skyGradient.addColorStop(0, `rgb(${baseR}, ${baseG}, ${baseB})`);
    skyGradient.addColorStop(0.4, `rgb(${midR}, ${midG}, ${midB})`);
    skyGradient.addColorStop(0.8, `rgb(${horizonR}, ${horizonG}, ${horizonB})`);
    skyGradient.addColorStop(1, `rgb(${Math.floor(horizonR*0.8)}, ${Math.floor(horizonG*0.8)}, ${Math.floor(horizonB*0.8)})`);
    
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
    
    // 绘制星星背景（根据总亮度调整星星可见性）
    const starBrightness = Math.max(0.05, 1 - normalizedBrightness); // 总亮度越高，星星越暗
    drawStars(starBrightness);
}

// 绘制星星背景
let starsData = null; // 存储星星数据的数组

function drawStars(brightness = 1) {
    // 如果星星数据未初始化，则生成并存储
    if (starsData === null) {
        starsData = [];
        const starCount = 300; // 星星数量
        
        for (let i = 0; i < starCount; i++) {
            // 生成随机位置和属性
            const x = Math.random() * canvas.width;
            const y = Math.random() * (canvas.height * 0.6);
            const sizeVariation = Math.random() * 2 + 0.3; // 0.3-2.3
            const brightnessVariation = Math.random() * 0.5 + 0.5; // 0.5-1.0
            const colorVariation = Math.random();
            const r = 255;
            const g = Math.floor(255 - colorVariation * 30);
            const b = Math.floor(255 - colorVariation * 50);
            
            starsData.push({
                x: x,
                y: y,
                sizeVariation: sizeVariation,
                brightnessVariation: brightnessVariation,
                r: r,
                g: g,
                b: b
            });
        }
    }
    
    // 使用存储的星星数据绘制
    starsData.forEach(star => {
        const size = star.sizeVariation * brightness * star.brightnessVariation;
        
        ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${brightness * star.brightnessVariation})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// 计算并绘制恒星在天穹上的位置
function drawStarsOnSkyDome(planetP) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.3; // 天穹中心
    const radius = Math.min(canvas.width, canvas.height * 0.6) * 0.4; // 天穹半径
    
    // 获取三颗恒星
    const stars = bodies.filter(body => body.name !== 'p');
    let totalBrightness = 0;
    
    // 观察者位于行星P的位置
    const observerX = planetP.x;
    const observerY = planetP.y;
    const observerZ = planetP.z; // 使用行星P的实际z坐标
    
    stars.forEach(star => {
        // 计算恒星相对于观察者的位置
        const dx = star.x - observerX;
        const dy = star.y - observerY;
        const dz = star.z - observerZ;
        
        // 计算距离
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // 新的投影算法：基于垂直于观察者头顶到脚尖线的平面
        // 观察者头顶到脚尖的线为Y轴（垂直方向）
        
        // 1. 计算恒星与行星连线与垂直面的夹角（纬度）
        // 垂直面是垂直于Y轴的平面，纬度是连线与这个平面的夹角
        const latitude = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
        
        // 2. 计算恒星在垂直面上的投影
        const projectionX = dx;
        const projectionZ = dz;
        
        // 3. 计算投影线与观察者视角投影线的夹角（经度）
        // 观察者视角由firstPersonRotation（水平旋转）和verticalAngle（垂直旋转）控制
        
        // 计算投影线的方位角
        const projectionAzimuth = Math.atan2(projectionX, projectionZ);
        
        // 观察者视角的投影方位角（考虑水平旋转）
        const observerAzimuth = firstPersonRotation;
        
        // 计算经度差（投影线与观察者视角投影线的夹角）
        let longitude = projectionAzimuth - observerAzimuth;
        
        // 将经度标准化到[-π, π]范围
        while (longitude > Math.PI) longitude -= 2 * Math.PI;
        while (longitude < -Math.PI) longitude += 2 * Math.PI;
        
        // 4. 应用垂直视角限制（观察者只能在面以上的方向移动）
        // 如果纬度小于0（在平面以下），则不显示
        if (latitude < 0) {
            return; // 跳过这颗恒星的绘制
        }
        
        // 5. 将新的坐标系投影到天穹上
        // 使用修正的投影方式，考虑观察者的垂直视角
        
        // 计算观察者垂直视角对纬度的影响
        const adjustedLatitude = latitude - verticalAngle;
        
        // 如果调整后的纬度小于0，说明恒星在观察者视角下方，不显示
        if (adjustedLatitude < 0) {
            return; // 跳过这颗恒星的绘制
        }
        
        // 将经度和纬度转换为天穹上的坐标
        const skyX = centerX + radius * Math.cos(adjustedLatitude) * Math.sin(longitude);
        const skyY = centerY - radius * Math.sin(adjustedLatitude);
        
        // 计算恒星大小和亮度
        // 距离因子：越近越亮
        const distanceFactor = Math.max(0.1, 1 - distance * 0.005);
        
        // 不再考虑地平线遮挡效果
        const brightness = distanceFactor;
        
        totalBrightness += brightness;
        
        // 恒星大小和透明度（第一视角下更大更亮）
        const sizeMultiplier = isFirstPersonView ? 4 : 1;
        const brightnessMultiplier = isFirstPersonView ? 1.5 : 1;
        
        // 根据恒星半径和距离计算实际大小
        const starRadiusFactor = star.radius / 10;
        const distanceSizeFactor = Math.max(0.3, 800 / (distance + 80));
        
        const baseSize = 12 * starRadiusFactor * distanceSizeFactor * brightness;
        const maxStarSize = Math.min(canvas.width, canvas.height) * 0.2;
        const size = Math.max(5, Math.min(maxStarSize, baseSize * sizeMultiplier));
        const alpha = Math.max(0.3, brightness * brightnessMultiplier);
        
        // 所有恒星都按正常方式渲染，不再区分飞星
        const starR = 255;
        const starG = 255;
        const starB = 100;
        
        // 绘制恒星光晕
        const gradient = ctx.createRadialGradient(skyX, skyY, 0, skyX, skyY, size * 2);
        gradient.addColorStop(0, `rgba(${starR}, ${starG}, ${starB}, ${alpha})`);
        gradient.addColorStop(0.3, `rgba(${starR}, ${starG}, ${starB}, ${alpha * 0.6})`);
        gradient.addColorStop(0.7, `rgba(${starR}, ${starG-55}, ${starB}, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${starR}, ${starG}, ${starB}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(skyX, skyY, size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制恒星核心
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(skyX, skyY, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制恒星主体
        ctx.fillStyle = `rgba(${starR}, ${starG}, ${starB}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(skyX, skyY, size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // 返回总亮度用于调整地面亮度
    return Math.min(1, totalBrightness);
}
// 绘制第一视角控制提示
function drawFirstPersonControls() {
    if (isFirstPersonView) {
        // 第一视角模式下显示操作说明和经纬度
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 320, 110);
        
        // 转换经纬度为度数
        const latDegrees = (observerLatitude * 180 / Math.PI).toFixed(1);
        const lonDegrees = (observerLongitude * 180 / Math.PI).toFixed(1);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('第一视角模式', 20, 30);
        ctx.fillText(`纬度: ${latDegrees}°`, 20, 50);
        ctx.fillText(`经度: ${lonDegrees}°`, 20, 70);
        ctx.fillText('WASD: 在球面上移动', 20, 90);
        ctx.fillText('ESC键: 退出第一视角', 20, 110);
    } else {
        // 普通模式下显示操作说明
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 300, 80);
        
        ctx.fillStyle = '#00ccff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('第一视角模式', 20, 30);
        ctx.fillText('WASD: 移动', 20, 50);
        ctx.fillText('ESC键: 退出第一视角', 20, 70);
    }
}

// 绘制Babylon.js第一视角场景
function drawBabylonView() {
    if (!babylonInitialized || !babylonScene) {
        return;
    }
    
    // 更新Babylon.js场景中的天体
    updateBabylonBodies();
    
    // 处理相机移动
    handleBabylonCameraMovement();
    
    // 绘制控制提示
    drawFirstPersonControls();
}

// 更新Babylon.js场景中的天体
function updateBabylonBodies() {
    if (!babylonScene) {
        return;
    }
    
    // 清除现有的天体
    for (let mesh of babylonStarObjects) {
        mesh.dispose();
    }
    babylonStarObjects = [];
    
    // 创建新的天体
    for (let body of bodies) {
        if (body.name === 'p') {
            // 行星P - 创建一个特殊的地球样式
            const planetSize = body.radius * 2;
            const planetMesh = BABYLON.MeshBuilder.CreateSphere(body.name, {
                diameter: planetSize
            }, babylonScene);
            
            planetMesh.position = new BABYLON.Vector3(body.x, body.y, body.z);
            
            const planetMaterial = new BABYLON.StandardMaterial(body.name + 'Mat', babylonScene);
            planetMaterial.diffuseColor = new BABYLON.Color3(0, 0.5, 1);
            planetMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            planetMaterial.emissiveColor = new BABYLON.Color3(0, 0.1, 0.2);
            
            planetMesh.material = planetMaterial;
            babylonStarObjects.push(planetMesh);
        } else if (body.mass >= 1000) {
            // 恒星
            const starSize = body.radius * 2;
            const starMesh = BABYLON.MeshBuilder.CreateSphere(body.name, {
                diameter: starSize
            }, babylonScene);
            
            starMesh.position = new BABYLON.Vector3(body.x, body.y, body.z);
            
            // 解析颜色
            let r, g, b;
            const color = body.color;
            if (color.startsWith('#')) {
                const hex = color.slice(1);
                r = parseInt(hex.slice(0, 2), 16) / 255;
                g = parseInt(hex.slice(2, 4), 16) / 255;
                b = parseInt(hex.slice(4, 6), 16) / 255;
            } else {
                r = g = b = 1; // 默认白色
            }
            
            const starMaterial = new BABYLON.StandardMaterial(body.name + 'Mat', babylonScene);
            starMaterial.diffuseColor = new BABYLON.Color3(r, g, b);
            starMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
            starMaterial.emissiveColor = new BABYLON.Color3(r, g, b);
            
            starMesh.material = starMaterial;
            babylonStarObjects.push(starMesh);
        } else if (body.isFragment) {
            // 碎片
            const fragmentSize = body.radius * 2;
            const fragmentMesh = BABYLON.MeshBuilder.CreateSphere(body.name, {
                diameter: fragmentSize
            }, babylonScene);
            
            fragmentMesh.position = new BABYLON.Vector3(body.x, body.y, body.z);
            
            const fragmentMaterial = new BABYLON.StandardMaterial(body.name + 'Mat', babylonScene);
            fragmentMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            fragmentMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            
            fragmentMesh.material = fragmentMaterial;
            babylonStarObjects.push(fragmentMesh);
        }
    }
}

// 为Babylon.js场景创建爆炸粒子系统
function createBabylonExplosion(x, y, z, color1, color2) {
    if (!babylonScene) return;
    
    // 创建主爆炸粒子系统
    const explosionPs = new BABYLON.ParticleSystem("explosion", 3000, babylonScene);
    
    // 解析颜色
    const r1 = parseInt(color1.slice(1, 3), 16) / 255;
    const g1 = parseInt(color1.slice(3, 5), 16) / 255;
    const b1 = parseInt(color1.slice(5, 7), 16) / 255;
    
    const r2 = parseInt(color2.slice(1, 3), 16) / 255;
    const g2 = parseInt(color2.slice(3, 5), 16) / 255;
    const b2 = parseInt(color2.slice(5, 7), 16) / 255;
    
    // 使用发光纹理
    explosionPs.particleTexture = new BABYLON.Texture("https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/dist/textures/flare.png", babylonScene);
    
    // 粒子系统设置
    explosionPs.emitter = new BABYLON.Vector3(x, y, z);
    explosionPs.minEmitBox = new BABYLON.Vector3(-5, -5, -5);
    explosionPs.maxEmitBox = new BABYLON.Vector3(5, 5, 5);
    
    // 颜色渐变
    explosionPs.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 1));
    explosionPs.addColorGradient(0.1, new BABYLON.Color4(r1, g1, b1, 0.9));
    explosionPs.addColorGradient(0.3, new BABYLON.Color4(r2, g2, b2, 0.7));
    explosionPs.addColorGradient(0.7, new BABYLON.Color4(1, 0.5, 0, 0.4));
    explosionPs.addColorGradient(1, new BABYLON.Color4(0, 0, 0, 0));
    
    // 大小渐变
    explosionPs.addSizeGradient(0, 2);
    explosionPs.addSizeGradient(0.3, 5);
    explosionPs.addSizeGradient(0.7, 3);
    explosionPs.addSizeGradient(1, 0.5);
    
    // 生命周期
    explosionPs.minLifeTime = 1.5;
    explosionPs.maxLifeTime = 4;
    
    // 速度
    explosionPs.minEmitPower = 20;
    explosionPs.maxEmitPower = 50;
    explosionPs.updateSpeed = 0.01;
    
    // 方向（球形扩散）
    explosionPs.direction1 = new BABYLON.Vector3(-1, -1, -1);
    explosionPs.direction2 = new BABYLON.Vector3(1, 1, 1);
    
    // 旋转
    explosionPs.minAngularSpeed = -2;
    explosionPs.maxAngularSpeed = 2;
    
    // 混合模式
    explosionPs.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    
    // 开始发射
    explosionPs.start();
    
    // 创建冲击波粒子
    const shockwavePs = new BABYLON.ParticleSystem("shockwave", 1000, babylonScene);
    shockwavePs.particleTexture = new BABYLON.Texture("https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/dist/textures/flare.png", babylonScene);
    shockwavePs.emitter = new BABYLON.Vector3(x, y, z);
    
    shockwavePs.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0.8));
    shockwavePs.addColorGradient(0.5, new BABYLON.Color4((r1 + r2) / 2, (g1 + g2) / 2, (b1 + b2) / 2, 0.4));
    shockwavePs.addColorGradient(1, new BABYLON.Color4(0, 0, 0, 0));
    
    shockwavePs.addSizeGradient(0, 1);
    shockwavePs.addSizeGradient(1, 8);
    
    shockwavePs.minLifeTime = 0.5;
    shockwavePs.maxLifeTime = 1.5;
    shockwavePs.minEmitPower = 40;
    shockwavePs.maxEmitPower = 60;
    shockwavePs.direction1 = new BABYLON.Vector3(-1, -0.5, -1);
    shockwavePs.direction2 = new BABYLON.Vector3(1, 0.5, 1);
    shockwavePs.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    shockwavePs.start();
    
    // 清理粒子
    const cleanupPs = (ps, stopTime, disposeTime) => {
        setTimeout(() => {
            ps.stop();
            setTimeout(() => {
                ps.dispose();
                const index = babylonParticleSystems.indexOf(ps);
                if (index > -1) {
                    babylonParticleSystems.splice(index, 1);
                }
            }, disposeTime);
        }, stopTime);
    };
    
    cleanupPs(explosionPs, 800, 3000);
    cleanupPs(shockwavePs, 300, 1500);
    
    babylonParticleSystems.push(explosionPs, shockwavePs);
}

// 为Babylon.js场景创建星云粒子系统
function createBabylonNebulaParticles(nebula) {
    if (!babylonScene) return;
    
    // 解析颜色
    const r1 = parseInt(nebula.color1.slice(1, 3), 16) / 255;
    const g1 = parseInt(nebula.color1.slice(3, 5), 16) / 255;
    const b1 = parseInt(nebula.color1.slice(5, 7), 16) / 255;
    
    const r2 = parseInt(nebula.color2.slice(1, 3), 16) / 255;
    const g2 = parseInt(nebula.color2.slice(3, 5), 16) / 255;
    const b2 = parseInt(nebula.color2.slice(5, 7), 16) / 255;
    
    const radius = nebula.currentRadius;
    
    // 创建主星云粒子系统（核心）
    const corePs = new BABYLON.ParticleSystem("nebulaCore", 4000, babylonScene);
    corePs.particleTexture = new BABYLON.Texture("https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/dist/textures/flare.png", babylonScene);
    corePs.emitter = new BABYLON.Vector3(nebula.x, nebula.y, nebula.z);
    corePs.minEmitBox = new BABYLON.Vector3(-radius * 0.3, -radius * 0.3, -radius * 0.15);
    corePs.maxEmitBox = new BABYLON.Vector3(radius * 0.3, radius * 0.3, radius * 0.15);
    
    // 核心粒子颜色渐变
    corePs.addColorGradient(0, new BABYLON.Color4((r1 + r2) / 2, (g1 + g2) / 2, (b1 + b2) / 2, 0.6));
    corePs.addColorGradient(0.5, new BABYLON.Color4(r1, g1, b1, 0.4));
    corePs.addColorGradient(1, new BABYLON.Color4(0, 0, 0, 0));
    
    // 核心粒子大小渐变
    corePs.addSizeGradient(0, 2);
    corePs.addSizeGradient(1, 0.5);
    
    corePs.minLifeTime = 5;
    corePs.maxLifeTime = 12;
    corePs.minEmitPower = 1;
    corePs.maxEmitPower = 3;
    corePs.updateSpeed = 0.02;
    corePs.direction1 = new BABYLON.Vector3(-0.5, -0.5, -0.5);
    corePs.direction2 = new BABYLON.Vector3(0.5, 0.5, 0.5);
    corePs.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    corePs.start();
    
    // 创建外层星云粒子系统
    const outerPs = new BABYLON.ParticleSystem("nebulaOuter", 3000, babylonScene);
    outerPs.particleTexture = new BABYLON.Texture("https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/dist/textures/flare.png", babylonScene);
    outerPs.emitter = new BABYLON.Vector3(nebula.x, nebula.y, nebula.z);
    outerPs.minEmitBox = new BABYLON.Vector3(-radius * 0.6, -radius * 0.6, -radius * 0.3);
    outerPs.maxEmitBox = new BABYLON.Vector3(radius * 0.6, radius * 0.6, radius * 0.3);
    
    // 外层粒子颜色渐变
    outerPs.addColorGradient(0, new BABYLON.Color4(r2, g2, b2, 0.3));
    outerPs.addColorGradient(0.5, new BABYLON.Color4(r1, g1, b1, 0.2));
    outerPs.addColorGradient(1, new BABYLON.Color4(0, 0, 0, 0));
    
    // 外层粒子大小渐变
    outerPs.addSizeGradient(0, 3);
    outerPs.addSizeGradient(1, 1);
    
    outerPs.minLifeTime = 8;
    outerPs.maxLifeTime = 15;
    outerPs.minEmitPower = 0.5;
    outerPs.maxEmitPower = 2;
    outerPs.updateSpeed = 0.015;
    outerPs.direction1 = new BABYLON.Vector3(-1, -0.8, -1);
    outerPs.direction2 = new BABYLON.Vector3(1, 0.8, 1);
    outerPs.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    outerPs.start();
    
    // 创建旋转的星云环粒子系统
    const ringPs = new BABYLON.ParticleSystem("nebulaRing", 2000, babylonScene);
    ringPs.particleTexture = new BABYLON.Texture("https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/dist/textures/flare.png", babylonScene);
    ringPs.emitter = new BABYLON.Vector3(nebula.x, nebula.y, nebula.z);
    ringPs.minEmitBox = new BABYLON.Vector3(-radius * 0.7, -radius * 0.1, -radius * 0.7);
    ringPs.maxEmitBox = new BABYLON.Vector3(radius * 0.7, radius * 0.1, radius * 0.7);
    
    // 环粒子颜色渐变
    ringPs.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0.4));
    ringPs.addColorGradient(0.3, new BABYLON.Color4((r1 + r2) / 2, (g1 + g2) / 2, (b1 + b2) / 2, 0.3));
    ringPs.addColorGradient(1, new BABYLON.Color4(0, 0, 0, 0));
    
    ringPs.addSizeGradient(0, 1.5);
    ringPs.addSizeGradient(1, 0.5);
    
    ringPs.minLifeTime = 10;
    ringPs.maxLifeTime = 20;
    ringPs.minEmitPower = 0.3;
    ringPs.maxEmitPower = 1;
    ringPs.updateSpeed = 0.01;
    ringPs.direction1 = new BABYLON.Vector3(-1, 0, -1);
    ringPs.direction2 = new BABYLON.Vector3(1, 0, 1);
    ringPs.minAngularSpeed = -0.5;
    ringPs.maxAngularSpeed = 0.5;
    ringPs.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    ringPs.start();
    
    // 清理粒子
    const cleanupPs = (ps, stopTime, disposeTime) => {
        setTimeout(() => {
            ps.stop();
            setTimeout(() => {
                ps.dispose();
                const index = babylonParticleSystems.indexOf(ps);
                if (index > -1) {
                    babylonParticleSystems.splice(index, 1);
                }
            }, disposeTime);
        }, stopTime);
    };
    
    cleanupPs(corePs, 3000, 12000);
    cleanupPs(outerPs, 4000, 15000);
    cleanupPs(ringPs, 5000, 20000);
    
    babylonParticleSystems.push(corePs, outerPs, ringPs);
}

// Babylon.js星云对象存储 - 用Map存储，避免每帧重新创建
let babylonNebulaMeshMap = new Map();
let lastSkyRotation = 0;
let lastNebulaCount = 0;

// 使用Babylon.js更新星云（保持原有的投影和旋转逻辑）
function updateNebulasInBabylonView(planetP) {
    if (!babylonInitialized || !babylonScene) return;
    
    // 检查是否需要完全重建星云
    const skyRotationChanged = Math.abs(skyRotation - lastSkyRotation) > 0.01;
    const nebulaCountChanged = nebulas.length !== lastNebulaCount;
    
    // 观察者位于行星P的位置
    const observerX = planetP.x;
    const observerY = planetP.y;
    const observerZ = planetP.z;
    
    // 追踪哪些星云还存在
    const existingNebulaIds = new Set();
    
    for (let nebula of nebulas) {
        existingNebulaIds.add(nebula.id);
        
        // 计算星云相对于观察者的位置
        const dx = nebula.x - observerX;
        const dy = nebula.y - observerY;
        const dz = nebula.z - observerZ;
        
        let x, y, z, nebulaSize;
        
        // 所有星云都投影到天球上 - 保持原有逻辑
        const latitude = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
        let longitude = Math.atan2(dx, dz);
        
        while (longitude > Math.PI) longitude -= 2 * Math.PI;
        while (longitude < -Math.PI) longitude += 2 * Math.PI;
        
        const skyRadius = 480;
        x = skyRadius * Math.cos(latitude) * Math.sin(longitude);
        y = skyRadius * Math.sin(latitude);
        z = skyRadius * Math.cos(latitude) * Math.cos(longitude);
        
        // 应用天球自转（绕X轴旋转skyRotation角度）- 保持原有逻辑
        const cos = Math.cos(skyRotation);
        const sin = Math.sin(skyRotation);
        const yRotated = y * cos - z * sin;
        const zRotated = y * sin + z * cos;
        y = yRotated;
        z = zRotated;
        
        nebulaSize = nebula.currentRadius * 0.3;
        
        // 根据相机到星云的距离动态调整星云大小 - 离得越近越大
        if (babylonCamera) {
            // 计算相机到星云的距离
            const distance = Math.sqrt(
                (babylonCamera.position.x - x) * (babylonCamera.position.x - x) +
                (babylonCamera.position.y - y) * (babylonCamera.position.y - y) +
                (babylonCamera.position.z - z) * (babylonCamera.position.z - z)
            );
            
            // 距离越近，星云越大；距离越远，星云越小
            // 使用对数函数来让大小变化更自然
            const baseDistance = 480; // 基准距离
            const sizeMultiplier = Math.max(0.5, Math.min(3.0, 1.0 + (baseDistance - distance) / baseDistance * 1.5));
            nebulaSize *= sizeMultiplier;
        }
        
        // 检查是否需要更新或创建星云
        let nebulaObj = babylonNebulaMeshMap.get(nebula.id);
        
        if (!nebulaObj || skyRotationChanged || nebulaCountChanged) {
            // 解析星云颜色
            let r1, g1, b1;
            if (nebula.color1.startsWith('#')) {
                const hex = nebula.color1.slice(1);
                r1 = parseInt(hex.slice(0, 2), 16) / 255;
                g1 = parseInt(hex.slice(2, 4), 16) / 255;
                b1 = parseInt(hex.slice(4, 6), 16) / 255;
            } else {
                r1 = g1 = b1 = 0.8;
            }
            
            let r2, g2, b2;
            if (nebula.color2.startsWith('#')) {
                const hex = nebula.color2.slice(1);
                r2 = parseInt(hex.slice(0, 2), 16) / 255;
                g2 = parseInt(hex.slice(2, 4), 16) / 255;
                b2 = parseInt(hex.slice(4, 6), 16) / 255;
            } else {
                r2 = g2 = b2 = 0.6;
            }
            
            const tempFactor = Math.max(0.5, Math.min(1, nebula.temperature / 10000));
            
            // 清理旧的星云对象
            if (nebulaObj && nebulaObj.group) {
                nebulaObj.group.dispose();
            }
            
            // 使用Babylon.js高级功能创建星云
            const nebulaGroup = createBabylonNebulaShape(
                x, y, z, nebulaSize, 
                r1, g1, b1, r2, g2, b2, 
                tempFactor, nebula
            );
            
            nebulaObj = {
                group: nebulaGroup,
                nebula: nebula,
                lastX: x,
                lastY: y,
                lastZ: z
            };
            
            babylonNebulaMeshMap.set(nebula.id, nebulaObj);
        } else {
            // 只更新位置
            if (nebulaObj.group) {
                nebulaObj.group.position = new BABYLON.Vector3(x, y, z);
            }
        }
    }
    
    // 清理消失的星云
    for (let [id, nebulaObj] of babylonNebulaMeshMap) {
        if (!existingNebulaIds.has(id)) {
            if (nebulaObj.group) {
                nebulaObj.group.dispose();
            }
            babylonNebulaMeshMap.delete(id);
        }
    }
    
    lastSkyRotation = skyRotation;
    lastNebulaCount = nebulas.length;
}

// 使用Babylon.js高级功能创建真实酷炫的星云形状
function createBabylonNebulaShape(x, y, z, size, r1, g1, b1, r2, g2, b2, tempFactor, nebula) {
    const group = new BABYLON.TransformNode("nebulaGroup", babylonScene);
    group.position = new BABYLON.Vector3(x, y, z);
    
    // 多层星云结构 - 减少层数让形状更平滑
    const layers = 4;
    for (let layer = 0; layer < layers; layer++) {
        const layerScale = 0.5 + (layer / layers) * 0.8;
        const layerSize = size * layerScale;
        const layerAlpha = 1.0 - (layer / layers) * 0.5;
        
        // 创建不规则球体 - 减少分段让形状更平滑
        const segments = 24;
        const rings = 16;
        const sphere = BABYLON.MeshBuilder.CreateSphere(`nebulaLayer${layer}`, {
            diameter: layerSize * 2,
            segments: segments,
            diameterY: layerSize * 2 * 1.8 // 更扁的椭圆形状，更像真实星云
        }, babylonScene);
        
        // 应用不规则形状 - 更平滑的噪声
        const positions = sphere.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        
        for (let i = 0; i < positions.length; i += 3) {
            const px = positions[i];
            const py = positions[i + 1];
            const pz = positions[i + 2];
            
            const length = Math.sqrt(px * px + py * py + pz * pz);
            if (length > 0) {
                const nx = px / length;
                const ny = py / length;
                const nz = pz / length;
                
                // 使用更少、更平滑的噪声生成星云形状
                const seed = nebula.randomSeed + layer * 150;
                const phi = Math.acos(ny);
                const theta = Math.atan2(nx, nz);
                
                // 极简化噪声 - 大幅减少破碎感，特别是两级
                // 只保留低频、低振幅的噪声
                const noise1 = Math.sin(theta * 1.5 + seed * 0.03) * Math.cos(phi * 1.5) * 0.08;
                const noise2 = Math.cos(theta * 2 + seed * 0.05) * Math.sin(phi * 1.5) * 0.05;
                
                // 组合噪声 - 非常平滑
                const noiseVal = noise1 + noise2;
                
                // 两级平滑处理 - 在两级（phi接近0或π）时，让形状更平滑
                const poleSmooth = Math.pow(Math.sin(phi), 3); // 更强烈的平滑函数
                const smoothedNoise = noiseVal * poleSmooth;
                
                // 更接近球体的基础形状
                let effectiveRadius = 0.98 + smoothedNoise;
                
                // 更真实的星云边缘形状 - 两级更薄，赤道更厚
                const nebulaShape = Math.pow(Math.sin(phi), 0.6); // 让两级更薄，形状更像真实星云
                effectiveRadius *= nebulaShape;
                
                // 应用变形
                const finalLength = (layerSize * effectiveRadius);
                positions[i] = nx * finalLength;
                positions[i + 1] = ny * finalLength * 1.8;
                positions[i + 2] = nz * finalLength;
            }
        }
        
        sphere.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
        sphere.computeNormals();
        
        // 创建高级材质 - 使用NodeMaterial或PBR材质
        const nebulaMaterial = new BABYLON.PBRMaterial(`nebulaMat${layer}`, babylonScene);
        nebulaMaterial.albedoColor = new BABYLON.Color3(
            (r1 + r2) / 2,
            (g1 + g2) / 2,
            (b1 + b2) / 2
        );
        nebulaMaterial.emissiveColor = new BABYLON.Color3(
            r1 * tempFactor,
            g1 * tempFactor,
            b1 * tempFactor
        );
        nebulaMaterial.roughness = 1.0;
        nebulaMaterial.metallic = 0.0;
        nebulaMaterial.alpha = layerAlpha * 0.8;
        nebulaMaterial.backFaceCulling = false;
        nebulaMaterial.twoSidedLighting = true;
        
        sphere.material = nebulaMaterial;
        sphere.parent = group;
        sphere.renderingGroupId = layer;
        
        // 添加发光效果 - 使用点光源模拟
        if (layer === 0) {
            const glowLight = new BABYLON.PointLight(`nebulaGlow${layer}`, 
                new BABYLON.Vector3(0, 0, 0), babylonScene);
            glowLight.diffuse = new BABYLON.Color3(r1 * tempFactor, g1 * tempFactor, b1 * tempFactor);
            glowLight.intensity = 50 * tempFactor;
            glowLight.range = layerSize * 4;
            glowLight.parent = group;
        }
    }
    
    // 添加星云环
    const ringMesh = BABYLON.MeshBuilder.CreateTorus("nebulaRing", {
        diameter: size * 2.2,
        thickness: size * 0.15,
        tessellation: 64
    }, babylonScene);
    
    const ringMaterial = new BABYLON.PBRMaterial("nebulaRingMat", babylonScene);
    ringMaterial.albedoColor = new BABYLON.Color3(r1 * 0.8, g1 * 0.8, b1 * 0.8);
    ringMaterial.emissiveColor = new BABYLON.Color3(r2 * 0.6, g2 * 0.6, b2 * 0.6);
    ringMaterial.alpha = 0.6;
    ringMaterial.roughness = 0.8;
    ringMaterial.metallic = 0.1;
    ringMaterial.backFaceCulling = false;
    
    ringMesh.material = ringMaterial;
    ringMesh.rotation.x = Math.PI / 2.5;
    ringMesh.parent = group;
    ringMesh.renderingGroupId = layers;
    
    // 添加旋转动画
    ringMesh.rotation.z = 0;
    let rotationPhase = 0;
    const ringAnimation = new BABYLON.Animation("ringRotation", "rotation.z", 30, 
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    
    const ringKeys = [];
    ringKeys.push({ frame: 0, value: 0 });
    ringKeys.push({ frame: 1000, value: Math.PI * 2 });
    ringAnimation.setKeys(ringKeys);
    ringMesh.animations.push(ringAnimation);
    babylonScene.beginAnimation(ringMesh, 0, 1000, true);
    
    return group;
}

// 处理Babylon.js相机移动
function handleBabylonCameraMovement() {
    if (!babylonCamera) {
        return;
    }
    
    const moveSpeed = firstPersonMoveSpeed * 0.1;
    
    // 获取相机的前向和右向向量
    const forward = babylonCamera.getDirection(BABYLON.Vector3.Forward());
    const right = babylonCamera.getDirection(BABYLON.Vector3.Right());
    
    // 归一化向量
    forward.normalize();
    right.normalize();
    
    // W - 向前移动
    if (keys.w) {
        babylonCamera.position.addInPlace(forward.scale(moveSpeed));
    }
    
    // S - 向后移动
    if (keys.s) {
        babylonCamera.position.subtractInPlace(forward.scale(moveSpeed));
    }
    
    // A - 向左移动
    if (keys.a) {
        babylonCamera.position.subtractInPlace(right.scale(moveSpeed));
    }
    
    // D - 向右移动
    if (keys.d) {
        babylonCamera.position.addInPlace(right.scale(moveSpeed));
    }
}

// 切换第一视角
function resetFirstPersonScene() {
    console.log('重置第一视角场景...');
    
    // 清理现有场景
    if (firstPersonScene) {
        while(firstPersonScene.children.length > 0) {
            firstPersonScene.remove(firstPersonScene.children[0]);
        }
    }
    
    // 清理渲染器DOM
    if (firstPersonRenderer && firstPersonRenderer.domElement) {
        if (firstPersonRenderer.domElement.parentElement) {
            firstPersonRenderer.domElement.parentElement.removeChild(firstPersonRenderer.domElement);
        }
    }
    
    // 清理标签容器
    if (labelContainer && labelContainer.parentElement) {
        labelContainer.parentElement.removeChild(labelContainer);
    }
    
    // 重置所有变量
    firstPersonScene = null;
    firstPersonCamera = null;
    firstPersonRenderer = null;
    cameraContainer = null;
    skyDome = null;
    ground = null;
    starObjects = [];
    starLabels = [];
    labelContainer = null;
    starField = null;
    sunLight = null;
    sunLight2 = null;
    sunLight3 = null;
    atmosphericFog = null;
    firstPersonInitialized = false;
}

function toggleFirstPersonView() {
    isFirstPersonView = !isFirstPersonView;
    console.log('切换第一视角模式:', isFirstPersonView ? '进入' : '退出');
    const btn = document.getElementById('first-person-btn');
    const infoBtn = document.getElementById('toggle-info');
    const infoPanel = document.getElementById('info');
    const infoContent = document.getElementById('info-content');
    
    if (isFirstPersonView) {
        // 进入第一视角模式 - 先重置场景以确保干净的初始化
        resetFirstPersonScene();
        
        // 随机初始化观察者在内部球壳上的经纬度
        observerLatitude = (Math.random() - 0.5) * Math.PI; // -π/2 到 π/2
        observerLongitude = (Math.random() - 0.5) * Math.PI * 2; // -π 到 π
        
        centerBody = null; // 取消任何聚焦
        document.body.classList.add('first-person-mode');
        btn.classList.add('active');
        btn.textContent = '旁观视角';
        
        // 替换操作说明按钮为恒星信息按钮
        infoBtn.title = '恒星信息';
        infoBtn.innerHTML = '⭐';
        
        // 隐藏信息面板内容，但保持面板可见以便后续显示恒星信息
        infoContent.style.display = 'none';
        infoBtn.innerHTML = '⭐'; // 确保显示星星图标
        
        // 隐藏不必要的UI元素，但保持控制面板可见
        document.getElementById('body-info').style.display = 'none';
        // 确保控制面板在第一视角模式下仍然可见
        document.getElementById('controls-container').style.display = 'block';
        
        // 初始化Babylon.js场景
        if (!babylonInitialized) {
            initBabylonScene();
        }
        
        // 第一视角场景会在 animate 函数中自动初始化
    } else {
        // 退出第一视角模式
        document.body.classList.remove('first-person-mode');
        btn.classList.remove('active');
        btn.textContent = '第一视角';
        
        // 停止实时更新恒星信息
        isShowingStarInfo = false;
        
        // 恢复所有恒星的光谱颜色
        bodies.forEach(body => {
            if (body.name !== 'p') {
                body.color = getSpectralColor(body.mass);
            }
        });
        
        // 恢复操作说明按钮
        infoBtn.title = '操作说明';
        infoBtn.innerHTML = '📋';
        
        // 隐藏信息面板，确保不会自动显示
        infoPanel.style.display = 'none';
        infoContent.style.display = 'none';
        
        // 恢复控制面板显示
        document.getElementById('controls-container').style.display = 'block';
        
        // 隐藏第一视角渲染器DOM元素，防止与旁观视角重叠
        if (firstPersonRenderer && firstPersonRenderer.domElement) {
            firstPersonRenderer.domElement.style.display = 'none';
        }
        
        // 隐藏文本标注容器
        if (labelContainer) {
            labelContainer.style.display = 'none';
        }
        
        // 停止Babylon.js引擎
        if (babylonEngine) {
            babylonEngine.stopRenderLoop();
        }
    }
}

// 显示文明历史
function showCivilizationHistory() {
    const modal = document.getElementById('civilization-history-modal');
    const tableBody = document.getElementById('civilization-history-body');

    // 清空表格
    tableBody.innerHTML = '';

    try {
        const data = localStorage.getItem('civilizationHistory');
        if (data) {
            const history = JSON.parse(data);
            // 过滤掉currentId记录，只显示文明记录
            const civilizations = history.filter(entry => entry.id !== undefined && entry.destruction !== undefined);

            civilizations.forEach(entry => {
                // 根据保存的灭亡类型直接判断，避免从消息文本解析出错
                let destructionType = entry.destruction;
                if (entry.destructionType) {
                    // 如果有保存的灭亡类型，直接使用
                    switch(entry.destructionType) {
                        case 'explosion':
                            destructionType = "被恒星爆炸毁灭";
                            break;
                        case 'high_temp':
                            destructionType = "在高温下毁灭";
                            break;
                        case 'low_temp':
                            destructionType = "在低温下毁灭";
                            break;
                        case 'fragment_impact':
                            destructionType = "被碎片撞击毁灭";
                            break;
                        case 'star_eaten':
                            destructionType = "行星被恒星吞噬";
                            break;
                        case 'observer_closed':
                            destructionType = "未知（观察提前结束）";
                            break;
                        case 'interstellar':
                            destructionType = "飞向了新的家园";
                            break;
                        default:
                            destructionType = entry.destruction;
                    }
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.id}号文明</td>
                    <td>${destructionType}</td>
                    <td>${entry.existenceTime}</td>
                    <td>${entry.era || '--'}</td>
                `;
                tableBody.appendChild(row);
            });
        }
    } catch (e) {
        console.error("Error loading civilization history:", e);
    }

    modal.style.display = 'block';

    // 自动滚动到最新记录
    const modalBody = modal.querySelector('.modal-body');
    setTimeout(() => {
        modalBody.scrollTop = modalBody.scrollHeight;
    }, 100);
}
// 关闭文明历史模态框
function closeCivilizationHistory() {
    document.getElementById('civilization-history-modal').style.display = 'none';
}

// 添加全局变量跟踪恒星信息显示状态
let isShowingStarInfo = false;

// 更新逻辑（物理计算、状态更新）
function update(deltaTime) {
    // 物理更新
    updateBodiesPosition();

    // 状态更新
    const tempResult = calculatePlanetPTemperature();
    
    // 检查文明是否达到里程碑
    checkCivilizationMilestone();

    // 检查温度并显示相应消息（仅当文明尚未记录时）
    if (tempResult.temp !== '--' && !lastCivilizationRecorded) {
        const temp = parseFloat(tempResult.temp);
        isDestructionByExplosion = tempResult.isExplosion;
        if (temp > 400) {
            if (tempResult.isExplosion) {
                currentDestructionType = 'explosion';
            } else {
                currentDestructionType = 'high_temp';
            }
            showTemperatureMessage();
        } else if (temp < -100) {
            currentDestructionType = 'low_temp';
            showTemperatureMessage();
        }
    }

    // 清理缓存（定期清理以避免内存泄漏）
    if (time % 10 === 0) {
        calculationCache.clearAll();
    }
}

// UI更新节流器
const uiUpdater = {
    lastUpdateTime: 0,
    updateInterval: 100, // 每100ms更新一次UI
    
    shouldUpdate() {
        const now = Date.now();
        if (now - this.lastUpdateTime >= this.updateInterval) {
            this.lastUpdateTime = now;
            return true;
        }
        return false;
    }
};

// 渲染逻辑（所有绘制操作）
function render() {
    drawBodies();

    // 节流DOM操作
    if (uiUpdater.shouldUpdate()) {
        // 更新UI信息（排除碎片）
        const realBodyCount = bodies.filter(body => !body.isFragment).length;
        document.getElementById('body-count').textContent = `天体数量: ${realBodyCount}`;
        document.getElementById('time-info').textContent = `时间: ${time.toFixed(2)}`;

        // 更新行星P表面温度
        const tempResult = calculatePlanetPTemperature();
        document.getElementById('temperature-info').textContent = `行星P表面温度: ${tempResult.temp} °C`;
        
        // 更新第一视角按钮状态
        updateFirstPersonButtonState();

        // 如果正在显示恒星信息，则实时更新（不限制视角模式）
        if (isShowingStarInfo) {
            updateStarInfo();
        }
    }
}

// 主动画循环
let lastTime = 0;
function animate(currentTime) {
    // 计算时间差
    const deltaTime = (currentTime - lastTime) / 16; // 标准化为16ms每帧
    lastTime = currentTime;

    update(deltaTime);
    render();

    requestAnimationFrame(animate);
}
// 鼠标事件处理
let isMouseLocked = false;

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // 普通模式下拖动
        isDragging = true;
        dragStart.x = e.clientX;
        dragStart.y = e.clientY;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        if (isFirstPersonView) {
            // 第一视角模式下的控制
            // 鼠标左右移动：以头顶脚尖线为中心旋转（水平旋转）
            firstPersonRotation += deltaX * 0.01;
            
            // 鼠标上下移动：向下拖动抬头，向上拖动低头（垂直旋转）
            // 反转了deltaY的方向，使向下拖动时抬头（减小verticalAngle），向上拖动时低头（增大verticalAngle）
            verticalAngle -= deltaY * 0.01;
            
            // 限制垂直角度范围，确保地面始终在视角下半部分
            // 限制在 -60度 到 90度，让玩家不能低头看到地面上方太多
            verticalAngle = Math.max(-Math.PI / 3, Math.min(Math.PI / 2, verticalAngle));
        } else {
            // 普通模式下的旋转
            rotationY += deltaX * 0.01;
            rotationX += deltaY * 0.01;
        }

        dragStart.x = e.clientX;
        dragStart.y = e.clientY;
    }
});


canvas.addEventListener('mouseup', (e) => {
    isDragging = false;

    // 处理点击事件
    if (e.button === 0) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const body = getBodyAtPosition(x, y);
        if (body) {
            showBodyInfo(body);
        } else {
            selectedBody = null;
            document.getElementById('body-info').style.display = 'none';
            // 只在普通模式下显示操作说明窗口，第一视角模式下保持当前状态
            if (!isFirstPersonView) {
                document.getElementById('info').style.display = 'block';
            }
        }
    }
});


canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    if (isFirstPersonView) {
        // 第一视角模式下：鼠标滚轮调整视角远近（通过改变相机FOV）
        if (firstPersonCamera) {
            // deltaY为正表示向下滚动（缩小视角，FOV增大），为负表示向上滚动（放大视角，FOV减小）
            firstPersonCamera.fov += e.deltaY * 0.1;
            // 限制FOV范围在30到90之间，确保视角不会过大或过小
            firstPersonCamera.fov = Math.max(30, Math.min(90, firstPersonCamera.fov));
            // 更新相机投影矩阵
            firstPersonCamera.updateProjectionMatrix();
        }
    } else {
        // 普通模式下保持原有的缩放逻辑
        scale *= e.deltaY > 0 ? 0.9 : 1.1;
        scale = Math.max(0.1, Math.min(scale, 10));
    }
});

// 双击事件处理
canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const body = getBodyAtPosition(x, y);
    if (body) {
        centerBody = body;
        // 确保操作指南按钮保持显示
        document.getElementById('info').style.display = 'block';
    } else {
        centerBody = null; // 取消聚焦
        // 确保操作指南按钮保持显示
        document.getElementById('info').style.display = 'block';
    }
});

// 触摸事件处理（移动端支持）
let lastTouchDistance = 0;
let lastTap = 0;
let lastTapPosition = { x: 0, y: 0 };

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();

    if (e.touches.length === 1) {
        // 单指触摸，旋转视角
        isDragging = true;
        dragStart.x = e.touches[0].clientX;
        dragStart.y = e.touches[0].clientY;

        // 处理双击
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        const touch = e.touches[0];

        if (tapLength < 500 && tapLength > 0) {
            // 检查两次点击位置是否相近（50px内）
            const xDiff = Math.abs(touch.clientX - lastTapPosition.x);
            const yDiff = Math.abs(touch.clientY - lastTapPosition.y);

            if (xDiff < 50 && yDiff < 50) {
                // 双击事件
                const rect = canvas.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                const body = getBodyAtPosition(x, y);
                if (body) {
                    centerBody = body;
                    // 确保操作指南按钮保持显示
                    document.getElementById('info').style.display = 'block';
                } else {
                    centerBody = null; // 取消聚焦
                    // 确保操作指南按钮保持显示
                    document.getElementById('info').style.display = 'block';
                }
                e.preventDefault();
            }
        }

        lastTap = currentTime;
        lastTapPosition.x = touch.clientX;
        lastTapPosition.y = touch.clientY;
    } else if (e.touches.length === 2) {
        // 双指触摸，缩放
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
        // 单指拖动，旋转视角
        const deltaX = e.touches[0].clientX - dragStart.x;
        const deltaY = e.touches[0].clientY - dragStart.y;

        if (isFirstPersonView) {
            // 第一视角模式下的触摸控制
            // 触摸左右移动：以头顶脚尖线为中心旋转（水平旋转）
            firstPersonRotation += deltaX * 0.01;
            
            // 触摸上下移动：向下拖动抬头，向上拖动低头（垂直旋转）
            // 反转了deltaY的方向，使向下拖动时抬头（减小verticalAngle），向上拖动时低头（增大verticalAngle）
            verticalAngle -= deltaY * 0.01;
            
            // 限制垂直角度范围，确保地面始终在视角下半部分
            // 限制在 -60度 到 90度，让玩家不能低头看到地面上方太多
            verticalAngle = Math.max(-Math.PI / 3, Math.min(Math.PI / 2, verticalAngle));
        } else {
            // 普通模式下的旋转
            rotationY += deltaX * 0.01;
            rotationX += deltaY * 0.01;
        }

        dragStart.x = e.touches[0].clientX;
        dragStart.y = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        // 双指缩放
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (lastTouchDistance > 0) {
            const scaleChange = distance / lastTouchDistance;
            scale *= scaleChange;
            scale = Math.max(0.1, Math.min(scale, 10));
        }

        lastTouchDistance = distance;
    }
});

canvas.addEventListener('touchend', (e) => {
    isDragging = false;
    lastTouchDistance = 0;

    // 处理触摸结束时的点击事件
    if (e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const body = getBodyAtPosition(x, y);
        if (body) {
            showBodyInfo(body);
        } else {
            selectedBody = null;
            document.getElementById('body-info').style.display = 'none';
            // 操作说明窗口始终显示，不需要特别处理
        }
    }
});

// 替换原有的速度控制事件监听器
document.getElementById('speed-control').addEventListener('input', (e) => {
    // 分段均匀映射
    const sliderValue = parseFloat(e.target.value); // 0-100

    if (sliderValue <= 25) {
        // 前1/4部分: 0.1到1倍速的均匀映射
        speedFactor = 0.1 + (sliderValue / 25) * 0.9;
    } else {
        // 后3/4部分: 1到300倍速的均匀映射
        speedFactor = 1 + ((sliderValue - 25) / 75) * 299;
    }

    document.getElementById('speed-value').textContent = speedFactor.toFixed(1) + 'x';
});

// 更新初始化时的速度显示和默认值
speedFactor = 1.0; // 默认1倍速
document.getElementById('speed-control').value = 25; // 设置滑块位置对应100倍速
document.getElementById('speed-value').textContent = speedFactor.toFixed(1) + 'x';
// 窗口大小调整
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = document.getElementById('simulation-container').clientHeight;
    
    // 更新离屏Canvas尺寸
    offscreenCache.resize(canvas.width, canvas.height);
    
    // 确保第一视角渲染器也正确调整尺寸
    setTimeout(() => {
        adjustFirstPersonRendererForLandscape();
    }, 200);
});

// 横竖屏切换处理
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = document.getElementById('simulation-container').clientHeight;
        
        // 更新离屏Canvas尺寸
        offscreenCache.resize(canvas.width, canvas.height);
        
        // 确保第一视角渲染器也正确调整尺寸
        adjustFirstPersonRendererForLandscape();
    }, 100);
});

// 防止页面缩放和双击缩放
function preventZoom(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}

document.addEventListener('touchstart', preventZoom, { passive: false });
document.addEventListener('touchmove', preventZoom, { passive: false });

// 改进的触摸事件处理
let touchStartTime = 0;
let touchStartPos = { x: 0, y: 0 };

function handleTouchStart(e) {
    e.preventDefault();
    touchStartTime = Date.now();
    touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}

// 网络状态检测和性能优化
if (navigator.connection && isMobile) {
    navigator.connection.addEventListener('change', () => {
        if (navigator.connection.effectiveType === '2g' || navigator.connection.effectiveType === 'slow-2g') {
            mobileConfig.renderQuality = 0.5;
            mobileConfig.trailLength = 30;
        }
    });
}

// 键盘事件监听器
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isFirstPersonView) {
            toggleFirstPersonView(); // ESC键退出第一视角
        }
    } else if (e.key === 'p' || e.key === 'P') {
        // P键切换视角（移除手动旋转功能，现在行星自动自转）
        if (!isFirstPersonView) {
            // 在普通模式下旋转视角
            rotationY += Math.PI / 6; // 每次旋转30度
        }
    }
});

// 初始化移动端优化
optimizeForMobile();



// 检查行星P是否存在并更新第一视角按钮状态
function updateFirstPersonButtonState() {
    const firstPersonBtn = document.getElementById('first-person-btn');
    const planetP = bodies.find(body => body.name === 'p');
    
    if (planetP) {
        // 行星P存在，启用按钮
        firstPersonBtn.disabled = false;
        firstPersonBtn.style.opacity = '1';
        firstPersonBtn.style.cursor = 'pointer';
        firstPersonBtn.title = '第一视角';
    } else {
        // 行星P不存在，禁用按钮
        firstPersonBtn.disabled = true;
        firstPersonBtn.style.opacity = '0.5';
        firstPersonBtn.style.cursor = 'not-allowed';
        firstPersonBtn.title = '行星P已毁灭，无法使用第一视角';
        
        // 如果当前处于第一视角模式，自动退出
        if (isFirstPersonView) {
            toggleFirstPersonView();
        }
    }
}

// 第一视角按钮事件监听器
document.getElementById('first-person-btn').addEventListener('click', () => {
    // 再次检查行星P是否存在，防止状态变化
    const planetP = bodies.find(body => body.name === 'p');
    if (planetP) {
        toggleFirstPersonView();
    } else {
        updateFirstPersonButtonState(); // 更新按钮状态
    }
});

// 控制面板展开/收起
function setupControlsToggle() {
    const toggleBtn = document.getElementById('toggle-controls');
    if (!toggleBtn) return;
    
    // 移除已存在的事件监听器
    toggleBtn.removeEventListener('click', handleControlsToggle);
    // 添加新的事件监听器
    toggleBtn.addEventListener('click', handleControlsToggle);
}

function handleControlsToggle() {
    const controlsContainer = document.getElementById('controls-container');
    const toggleBtn = document.getElementById('toggle-controls');
    
    if (controlsContainer.classList.contains('collapsed')) {
        controlsContainer.classList.remove('collapsed');
        controlsContainer.classList.add('expanded-by-user');
        toggleBtn.textContent = '▼';
        controlsContainer.style.transform = '';
    } else {
        controlsContainer.classList.add('collapsed');
        controlsContainer.classList.remove('expanded-by-user');
        toggleBtn.textContent = '⚙️';
    }
}

// 初始化控制面板切换功能
setupControlsToggle();



// 添加天体信息窗口关闭按钮事件
if(document.getElementById('toggle-body-info')) {
    document.getElementById('toggle-body-info').addEventListener('click', function() {
        const bodyInfo = document.getElementById('body-info');
        
        bodyInfo.style.display = 'none';
        // 操作说明窗口始终显示，不需要重新显示
        selectedBody = null;
    });
}
// 显示恒星信息窗口（第一视角模式下使用）
function showStarInfo() {
    try {
        const infoPanel = document.getElementById('info');
        const content = document.getElementById('info-content');
        const button = document.getElementById('toggle-info');
        
        if (!infoPanel || !content || !button) {
            console.warn('无法找到恒星信息面板元素');
            return;
        }
        
        // 设置恒星信息显示状态
        isShowingStarInfo = true;
        
        try {
            // 获取所有非行星P且非碎片的天体
            const celestialBodies = bodies.filter(body => body.name !== 'p' && !body.isFragment);
            const planetP = bodies.find(body => body.name === 'p');
            
            if (celestialBodies.length === 0) {
                content.innerHTML = '<h4>恒星信息</h4><p>无法获取恒星数据</p>';
            } else {
                let celestialBodiesHTML = '<h4>恒星信息</h4>';
                
                celestialBodies.forEach((body, index) => {
                    try {
                        // 获取光谱类型信息
                        let spectralType = { name: '未知' };
                        let starColor = '#ffffff'; // 默认颜色
                        
                        if (body && typeof body.mass !== 'undefined') {
                            try {
                                spectralType = getSpectralType(body.mass) || { name: '未知' };
                                starColor = getSpectralColor(body.mass) || '#ffffff';
                            } catch (spectralError) {
                                console.warn(`获取天体 ${body.name} 光谱类型时出错:`, spectralError);
                            }
                        }
                        
                        // 为每个天体创建带ID的元素，便于实时更新
                        celestialBodiesHTML += `
                            <div style="margin-bottom: 10px; padding: 8px; background: rgba(0, 204, 255, 0.1); border-radius: 4px;">
                                <strong>恒星 ${body.name}</strong>
                                <span style="margin-left: 8px; font-size: 12px; color: ${starColor};">(${spectralType.name}型)</span>
                                <span style="display: inline-block; width: 12px; height: 12px; background-color: ${starColor}; border-radius: 50%; margin-left: 4px; vertical-align: middle; border: 1px solid rgba(255, 255, 255, 0.3);"></span>
                                <div style="font-size: 12px; margin-top: 4px;">
                                    距离: <span id="star-${body.name}-distance">计算中...</span> 单位<br>
                                    高度角: <span id="star-${body.name}-height">计算中...</span>°<br>
                                    表面温度: <span id="star-${body.name}-temperature">计算中...</span> °C<br>
                                    亮度: <span id="star-${body.name}-brightness">计算中...</span>
                                </div>
                            </div>
                        `;
                    } catch (bodyError) {
                        console.warn(`创建天体 ${body ? body.name : '未知'} 信息HTML时出错:`, bodyError);
                        // 添加错误占位符，但继续处理其他天体
                        celestialBodiesHTML += `
                            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255, 0, 0, 0.1); border-radius: 4px;">
                                <strong>恒星信息加载错误</strong>
                                <div style="font-size: 12px; margin-top: 4px;">无法显示此天体信息</div>
                            </div>
                        `;
                    }
                });
                
                // 添加动态信息区域，保持与操作说明相同的ID结构
                let temperature = '--';
                try {
                    temperature = planetP ? calculatePlanetPTemperature() : '--';
                } catch (tempError) {
                    console.warn('计算行星P表面温度时出错:', tempError);
                }
                
                let bodiesLength = 0;
                let timeValue = 0;
                try {
                    bodiesLength = bodies.length || 0;
                    timeValue = typeof time !== 'undefined' ? time.toFixed(2) : '0.00';
                } catch (dataError) {
                    console.warn('获取数据时出错:', dataError);
                }
                
                // 添加星云信息
                if (nebulas.length > 0) {
                    celestialBodiesHTML += '<h4 style="margin-top: 15px;">星云信息</h4>';
                    nebulas.forEach(nebula => {
                        const statusText = nebula.isStable ? '稳定' : '扩散中';
                        celestialBodiesHTML += `
                            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255, 100, 100, 0.1); border-radius: 4px;">
                                <strong>星云 ${nebula.id}</strong>
                                <span style="margin-left: 8px; font-size: 12px; color: #ff6666;">(${statusText})</span>
                                <div style="font-size: 12px; margin-top: 4px;">
                                    星云质量: ${nebula.mass.toFixed(0)}<br>
                                    星云半径: ${nebula.currentRadius.toFixed(1)} 单位<br>
                                    温度: ${nebula.temperature.toFixed(0)} K<br>
                                    年龄: ${nebula.age.toFixed(1)} 刻
                        `;
                        
                        if (nebula.coreBody) {
                            const coreSpectralType = getSpectralType(nebula.coreBody.mass) || { name: '未知' };
                            const coreColor = getSpectralColor(nebula.coreBody.mass) || '#ffffff';
                            celestialBodiesHTML += `
                                    <div style="margin-top: 6px; padding: 6px; background: rgba(255, 200, 100, 0.15); border-radius: 3px;">
                                        <strong style="color: ${coreColor};">恒星核 ${nebula.coreBody.name}</strong>
                                        <span style="margin-left: 6px; font-size: 11px;">(${coreSpectralType.name}型)</span>
                                        <div style="font-size: 11px; margin-top: 2px;">
                                            质量: ${nebula.coreBody.mass.toFixed(0)}
                                        </div>
                                    </div>
                            `;
                        }
                        
                        celestialBodiesHTML += `
                                </div>
                            </div>
                        `;
                    });
                }
                
                celestialBodiesHTML += `
                    <div id="body-count">天体数量: ${bodiesLength}</div>
                    <div id="time-info">时间: ${timeValue}</div>
                    <div id="temperature-info">行星P表面温度: ${temperature} °C</div>
                    <div id="total-brightness">总亮度: <span id="total-brightness-value">计算中...</span></div>
                `;
                
                try {
                    content.innerHTML = celestialBodiesHTML;
                } catch (htmlError) {
                    console.warn('设置HTML内容时出错:', htmlError);
                    content.innerHTML = '<h4>恒星信息</h4><p>加载恒星信息时发生错误</p>';
                }
            }
        } catch (dataError) {
            console.error('处理恒星数据时发生错误:', dataError);
            content.innerHTML = '<h4>恒星信息</h4><p>加载恒星数据时发生错误</p>';
        }
        
        // 显示面板 - 使用!important确保覆盖内联样式
        try {
            infoPanel.style.setProperty('display', 'block', 'important');
            content.style.display = 'block';
            button.innerHTML = '✕';
        } catch (styleError) {
            console.warn('设置面板样式时出错:', styleError);
        }
        
        // 立即更新一次恒星信息
        try {
            // 重置状态，确保updateStarInfo能够正确执行
            if (typeof updateStarInfo.callCount !== 'undefined') {
                updateStarInfo.callCount = 0;
            }
            const tempIsUpdating = isUpdatingStarInfo;
            isUpdatingStarInfo = false; // 临时设置为false，允许updateStarInfo执行
            
            // 立即执行updateStarInfo，确保DOM元素已创建完成
            if (isShowingStarInfo) {
                updateStarInfo();
            }
            // 延迟恢复原来的状态，确保updateStarInfo能够正常执行
            setTimeout(() => {
                isUpdatingStarInfo = tempIsUpdating;
            }, 50);
        } catch (updateError) {
            console.warn('立即更新恒星信息时出错:', updateError);
        }
    } catch (error) {
        console.error('显示恒星信息窗口时发生严重错误:', error);
        // 重置显示状态，防止持续报错
        isShowingStarInfo = false;
    }
}

// 实时更新恒星信息的函数
function updateStarInfo() {
    // 防止重入和循环调用
    if (!isShowingStarInfo || isUpdatingStarInfo) return;
    
    // 添加递归调用计数器，防止无限循环
    if (typeof updateStarInfo.callCount === 'undefined') {
        updateStarInfo.callCount = 0;
    }
    if (updateStarInfo.callCount > 3) {
        console.warn('updateStarInfo调用次数过多，可能存在无限循环，重置计数器');
        updateStarInfo.callCount = 0;
        return;
    }
    
    try {
        isUpdatingStarInfo = true;
        updateStarInfo.callCount++;
        
        // 获取所有有效的非行星P且非碎片的天体 - 使用let允许后续重新赋值
        let celestialBodies = bodies.filter(body => body && body.name && body.name !== 'p' && !body.isFragment);
        const planetP = bodies.find(body => body && body.name === 'p');
        
        // 提前声明referencePoint变量，确保在变化检测逻辑中可以使用
        let referencePoint = planetP;
        if (!referencePoint && bodies.length > 0) {
            referencePoint = bodies[0];
        }
    
    // 检查天体列表是否发生变化（新增、删除或合并）
        let hasChanged = false; // 在外层定义hasChanged变量
        if (typeof lastBodyNames === 'undefined') {
            // 首次运行时初始化
            lastBodyNames = new Set(celestialBodies.map(body => body.name));
        } else {
            try {
                const currentBodyNames = new Set(celestialBodies.map(body => body.name));
                
                // 检查是否有新增或删除的天体
                hasChanged = lastBodyNames.size !== currentBodyNames.size ||
                           ![...lastBodyNames].every(name => currentBodyNames.has(name));
                
                if (hasChanged) {
                    // 天体列表发生变化，重新创建信息窗口
                    try {
                        // 检查是否正在更新中，避免递归调用
                        if (isUpdatingStarInfo) {
                            console.log('正在更新中，跳过天体列表变化处理');
                            return;
                        }
                        
                        // 检查调用计数器，防止无限循环
                        if (updateStarInfo.callCount > 1) {
                            console.log('调用次数过多，跳过天体列表变化处理');
                            return;
                        }
                        
                        // 避免在showStarInfo中立即调用updateStarInfo
                        const tempIsUpdating = isUpdatingStarInfo;
                        isUpdatingStarInfo = true; // 临时设置为true，防止showStarInfo中的updateStarInfo调用
                        
                        // 重置调用计数器，避免计数器干扰
                        if (updateStarInfo.callCount > 0) {
                            updateStarInfo.callCount = 0;
                        }
                        
                        showStarInfo();
                        
                        // 重置lastBodyNames
                        lastBodyNames = currentBodyNames;
                        
                        // 重置状态，避免重复调用
                        isUpdatingStarInfo = tempIsUpdating;
                        updateStarInfo.callCount = 0;
                        
                        // showStarInfo已经会调用updateStarInfo，不需要重复调用
                        // 直接返回，避免递归调用
                    } catch (error) {
                        console.warn('重新创建恒星信息窗口时出错:', error);
                        // 即使出错也更新lastBodyNames，避免持续触发重新创建
                        lastBodyNames = currentBodyNames;
                    }
                    
                    // 天体列表已变化并重新创建了窗口，直接返回
                    // 避免继续执行DOM更新逻辑，防止状态混乱和卡死
                    // 延迟的updateStarInfo调用会负责更新新窗口的数据
                    return;
                }
            } catch (changeCheckError) {
                console.warn('检查天体列表变化时出错:', changeCheckError);
                // 出错时重置lastBodyNames，避免持续触发错误
                lastBodyNames = new Set(celestialBodies.map(body => body.name));
            }
        }
    
    // 如果仍然没有参考点或没有其他天体，则跳过更新
    if (!referencePoint || celestialBodies.length === 0) {
        return;
    }
    
    // 计算总亮度的变量
    let totalBrightness = 0;
    let starCount = 0;
    
    try {
        celestialBodies.forEach((body) => {
            try {
                // 计算天体到行星的距离
                const dx = body.x - referencePoint.x;
                const dy = body.y - referencePoint.y;
                const dz = body.z - referencePoint.z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                // 计算恒星高度角
                // 使用行星P为参考点计算高度角，不再依赖第一视角屏幕坐标
                const observerY = dy; // 相对于参考点的Y坐标（高度）
                const observerHorizontalDistance = Math.sqrt(dx * dx + dz * dz); // 水平距离
                
                // 计算高度角（arctan(高度/水平距离)）
                let heightAngle = 0;
                if (observerHorizontalDistance > 0) {
                    heightAngle = Math.atan(observerY / observerHorizontalDistance) * (180 / Math.PI);
                } else if (observerY > 0) {
                    heightAngle = 90; // 正上方
                } else if (observerY < 0) {
                    heightAngle = -90; // 正下方
                }
                
                // 计算恒星表面温度
                const starTemperature = calculateStarTemperature(body);
                
                // 判断恒星状态
                let starStatus = '';
                // 初始化previousStarHeights对象，如果不存在
                if (!previousStarHeights) {
                    previousStarHeights = {};
                }
                const previousHeight = previousStarHeights[body.name] || heightAngle;
                
                // 飞星判断逻辑：当恒星与行星距离大于900时成为飞星
                let isFlyingStar = false;
                if (distance > 900) {
                    isFlyingStar = true;
                    starStatus = '飞星';
                    // 只有在第一视角下才修改恒星颜色为白色
                    if (isFirstPersonView) {
                        body.color = '#ffffff';
                    }
                } else {
                    // 恢复原来的恒星颜色（如果是第一视角模式）
                    if (isFirstPersonView) {
                        body.color = getSpectralColor(body.mass);
                    }
                    
                    // 改进的恒星状态判断逻辑
                    if (heightAngle >= 10 && heightAngle <= 90) {
                        starStatus = '升起';
                    } else if (heightAngle >= -90 && heightAngle <= -10) {
                        starStatus = '落下';
                    } else if (heightAngle > -10 && heightAngle < 10) {
                        // 在地平线附近（-10到10度），需要更精确的判断
                        if (heightAngle > previousHeight) {
                            // 高度角在增加，可能是日出或从落下变为升起
                            if (previousHeight <= -10) {
                                // 从落下状态变为升起，是日出
                                starStatus = '日出';
                            } else {
                                // 已经在地平线附近，高度角增加，继续认为是日出
                                starStatus = '日出';
                            }
                        } else {
                            // 高度角在减少，可能是日落或从升起变为落下
                            if (previousHeight >= 10) {
                                // 从升起状态变为落下，是日落
                                starStatus = '日落';
                            } else {
                                // 已经在地平线附近，高度角减少，继续认为是日落
                                starStatus = '日落';
                            }
                        }
                    }
                }
                
                // 计算亮度基础值（0-100，与质量成正比，与距离成反比）
                // 假设质量范围在0.1-10之间，距离范围在1-1000之间
                const massFactor = Math.min(body.mass / 10, 1); // 质量因子，最大为1
                const distanceFactor = Math.min(100 / distance, 1); // 距离因子，最大为1
                let brightness = massFactor * distanceFactor * 100; // 基础亮度值
                
                // 根据恒星状态调整亮度
                if (starStatus === '升起') {
                    brightness = brightness * 1; // 起起状态保持原值
                } else if (starStatus === '落下') {
                    brightness = brightness * 0; // 落下状态为0
                } else if (starStatus === '日出' || starStatus === '日落') {
                    // 日出/日落状态：亮度从0到基础值线性变化，基于高度角(-10到10度)
                    const transitionFactor = (heightAngle + 10) / 20; // 将-10到10映射到0到1
                    brightness = brightness * transitionFactor; // 日出/日落状态
                }
                
                // 确保亮度在0-100范围内
                brightness = Math.max(0, Math.min(100, brightness));
                
                // 累加到总亮度
                totalBrightness += brightness;
                starCount++;
                
                // 更新上一次的高度角
                previousStarHeights[body.name] = heightAngle;
                
                // 更新DOM元素（添加错误处理）
                try {
                    const distanceElement = document.getElementById(`star-${body.name}-distance`);
                    const heightElement = document.getElementById(`star-${body.name}-height`);
                    const temperatureElement = document.getElementById(`star-${body.name}-temperature`);
                    const brightnessElement = document.getElementById(`star-${body.name}-brightness`);
                    
                    // 检查DOM元素是否存在，如果不存在则跳过更新
                    if (!distanceElement || !heightElement || !temperatureElement || !brightnessElement) {
                        console.warn(`天体 ${body.name} 的DOM元素不存在，可能窗口刚被重新创建`);
                        // 如果DOM元素不存在，且不是由天体列表变化触发的更新，则重新创建窗口
                        // 添加更严格的条件检查，避免递归调用
                        if (isShowingStarInfo && !isUpdatingStarInfo && !hasChanged && updateStarInfo.callCount <= 1) {
                            // 重置调用计数器，避免计数器干扰
                            if (updateStarInfo.callCount > 0) {
                                updateStarInfo.callCount = 0;
                            }
                            showStarInfo();
                        }
                        return; // 跳过这个天体的更新
                    }
                    
                    distanceElement.textContent = distance.toFixed(2);
                    heightElement.textContent = heightAngle.toFixed(2);
                    temperatureElement.textContent = starTemperature;
                    brightnessElement.textContent = brightness.toFixed(1);
                } catch (error) {
                    console.warn(`更新天体 ${body.name} 信息时出错:`, error);
                    // 继续处理其他天体，不因单个天体更新失败而中断
                }
            } catch (bodyError) {
                console.warn(`处理天体 ${body.name} 时出错:`, bodyError);
                // 跳过这个天体，继续处理下一个
            }
        });
        
        // 计算并更新总亮度（所有恒星亮度之和除以总恒星数）
        const averageBrightness = starCount > 0 ? totalBrightness / starCount : 0;
        currentTotalBrightness = averageBrightness; // 更新全局总亮度变量
        try {
                        const totalBrightnessElement = document.getElementById('total-brightness-value');
                        if (totalBrightnessElement) {
                            totalBrightnessElement.textContent = averageBrightness.toFixed(1);
                        }
                    } catch (error) {
                        console.warn('更新总亮度时出错:', error);
                    }
                } catch (error) {
                    console.error('更新恒星信息时发生严重错误:', error);
                    // 重置显示状态，防止持续报错
                    isShowingStarInfo = false;
                    
                    try {
                        const infoPanel = document.getElementById('info');
                        const content = document.getElementById('info-content');
                        if (infoPanel && content) {
                            infoPanel.style.display = 'none';
                            content.style.display = 'none';
                        }
                    } catch (resetError) {
                        console.warn('重置信息面板时出错:', resetError);
                    }
                }
            } catch (error) {
                console.error('恒星信息更新过程中发生未捕获错误:', error);
                // 重置显示状态，防止持续报错
                isShowingStarInfo = false;
            } finally {
                // 确保标志始终被重置
                isUpdatingStarInfo = false;
                // 重置调用计数器
                if (updateStarInfo.callCount > 0) {
                    updateStarInfo.callCount--;
                }
            }
}

// 操作指南展开/收起
document.getElementById('toggle-info').addEventListener('click', function () {
    if (isFirstPersonView) {
        // 第一视角模式下显示恒星信息
        const infoPanel = document.getElementById('info');
        const content = document.getElementById('info-content');
        const button = this;
        
        if (content.style.display === 'none' || content.style.display === '') {
            // 只有在用户主动点击时才显示恒星信息
            if (!isShowingStarInfo) {
                showStarInfo();
            }
        } else {
            content.style.display = 'none';
            button.innerHTML = '⭐'; // 第一视角模式下关闭时显示星星图标
            // 停止实时更新恒星信息
            isShowingStarInfo = false;
            // 隐藏整个信息面板
            infoPanel.style.display = 'none';
        }
    } else {
        // 普通模式下显示操作说明
        const infoPanel = document.getElementById('info');
        const content = document.getElementById('info-content');
        const button = this;
        
        if (content.style.display === 'none' || content.style.display === '' || infoPanel.style.display === 'none') {
            // 恢复操作说明内容
            content.innerHTML = `
                <h4>操作说明</h4>
                <p>单指拖拽: 旋转视角</p>
                <p>双指缩放: 缩放</p>
                <p>双击天体: 聚焦到该天体</p>
                <p>单击天体: 查看天体信息</p>
                <div id="body-count">天体数量: ${bodies.length}</div>
                <div id="time-info">时间: ${time.toFixed(2)}</div>
                <div id="temperature-info">行星P表面温度: ${calculatePlanetPTemperature()} °C</div>
            `;
            infoPanel.style.display = 'block';
            content.style.display = 'block';
            button.innerHTML = '✕';
        } else {
            content.style.display = 'none';
            button.innerHTML = '📋';
        }
    }
});

// 天体信息面板展开/收起
document.getElementById('toggle-body-info').addEventListener('click', function () {
    const content = document.getElementById('body-info-content');
    const button = this;

    if (content.style.display === 'none') {
        content.style.display = 'block';
        button.textContent = '−';
    } else {
        content.style.display = 'none';
        button.textContent = '+';
    }
});

// 聚焦按钮事件
document.getElementById('focus-body').addEventListener('click', function () {
    if (selectedBody) {
        centerBody = selectedBody;
    }
});

// 导出参数功能
document.getElementById('exportBtn').addEventListener('click', function () {
    // 收集当前参数
    const params = {
        bodies: bodies.map(body => ({
            name: body.name,
            mass: body.mass,
            x: body.x,
            y: body.y,
            z: body.z,
            vx: body.vx,
            vy: body.vy,
            vz: body.vz,
            color: body.color,
            isFragment: body.isFragment || false,
            creationTime: body.creationTime
        })),
        nebulas: nebulas.map(nebula => {
            const coreBodyName = nebula.coreBody ? nebula.coreBody.name : null;
            if (!coreBodyName) {
                console.warn('导出时星云核天体名称为空:', nebula);
            }
            return {
                id: nebula.id,
                x: nebula.x,
                y: nebula.y,
                z: nebula.z,
                mass: nebula.mass,
                color1: nebula.color1,
                color2: nebula.color2,
                coreBodyName: coreBodyName,
                maxRadius: nebula.maxRadius,
                currentRadius: nebula.currentRadius,
                temperature: nebula.temperature,
                isStable: nebula.isStable,
                randomSeed: nebula.randomSeed
            };
        }),
        nebulaIdCounter: nebulaIdCounter,
        time: time,
        scale: scale,
        offsetX: offsetX,
        offsetY: offsetY,
        rotationX: rotationX,
        rotationY: rotationY
    };

    // 创建JSON文件
    const dataStr = JSON.stringify(params, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    // 创建下载链接
    const exportFileDefaultName = 'three-body-params.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
});

// 导入参数功能
document.getElementById('importBtn').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

// 导入参数功能
document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const params = JSON.parse(e.target.result);

            // 清空轨迹数据
            for (let key in trails) {
                delete trails[key];
            }

            // 恢复天体参数
            if (params.bodies && Array.isArray(params.bodies)) {
                bodies = params.bodies.map(bodyData => {
                    const body = new CelestialBody(
                        bodyData.name,
                        bodyData.mass,
                        bodyData.x,
                        bodyData.y,
                        bodyData.z,
                        bodyData.vx,
                        bodyData.vy,
                        bodyData.vz,
                        bodyData.color || '#ffffff' // 添加默认颜色以防未定义
                    );
                    // 恢复碎片标记
                    if (bodyData.isFragment) {
                        body.isFragment = true;
                    }
                    // 恢复碎片创建时间
                    if (bodyData.creationTime !== undefined) {
                        body.creationTime = bodyData.creationTime;
                    }
                    return body;
                });

                // 初始化轨迹数组
                for (const body of bodies) {
                    if (!trails[body.name]) {
                        trails[body.name] = [];
                    }
                }

                // 更新UI（如果天体数量足够）
                updateUI();
            }

            // 恢复星云参数
            nebulas = [];
            if (params.nebulas && Array.isArray(params.nebulas)) {
                for (const nebulaData of params.nebulas) {
                    // 先找到对应的星云核天体
                    const coreBody = bodies.find(b => b.name === nebulaData.coreBodyName);
                    if (coreBody) {
                        const nebula = new Nebula(
                            nebulaData.id,
                            nebulaData.x,
                            nebulaData.y,
                            nebulaData.z,
                            nebulaData.mass,
                            nebulaData.color1,
                            nebulaData.color2,
                            coreBody
                        );
                        // 恢复额外的状态
                        if (nebulaData.maxRadius !== undefined) nebula.maxRadius = nebulaData.maxRadius;
                        if (nebulaData.currentRadius !== undefined) nebula.currentRadius = nebulaData.currentRadius;
                        if (nebulaData.temperature !== undefined) nebula.temperature = nebulaData.temperature;
                        if (nebulaData.isStable !== undefined) nebula.isStable = nebulaData.isStable;
                        if (nebulaData.randomSeed !== undefined) nebula.randomSeed = nebulaData.randomSeed;
                        nebulas.push(nebula);
                    } else {
                        console.warn('导入时找不到星云核天体:', nebulaData.coreBodyName, '可用的天体:', bodies.map(b => b.name));
                    }
                }
            }

            // 恢复星云计数器
            if (params.nebulaIdCounter !== undefined) {
                nebulaIdCounter = params.nebulaIdCounter;
            }

            // 恢复视图参数
            if (params.time !== undefined) time = params.time;
            if (params.scale !== undefined) scale = params.scale;
            if (params.offsetX !== undefined) offsetX = params.offsetX;
            if (params.offsetY !== undefined) offsetY = params.offsetY;
            if (params.rotationX !== undefined) rotationX = params.rotationX;
            if (params.rotationY !== undefined) rotationY = params.rotationY;

            // 重置聚焦天体
            centerBody = null;
            selectedBody = null;
            document.getElementById('body-info').style.display = 'none';
            lastTemperatureMessage = "";
            
            // 导入参数后不计算文明兴衰
            lastCivilizationRecorded = true;
        } catch (error) {
            alert('参数文件解析失败：' + error.message);
        }
    };
    reader.readAsText(file);
    // 清空文件输入框，以便下次选择同一文件也能触发change事件
    e.target.value = '';
});
// 全局变量：用于跟踪上一次更新时的天体名称
let lastBodyNames;
// 全局变量：防止updateStarInfo和showStarInfo之间的无限循环
let isUpdatingStarInfo = false;

// 在 script.js 中添加检查文明是否进入星际时代的函数
function checkCivilizationMilestone() {
    // 只有当行星P存在且文明尚未记录时才检查
    const planetP = bodies.find(body => body.name === 'p');
    if (!planetP || lastCivilizationRecorded) return;
    
    const existenceTime = time - civilizationStartTime;
    
    // 如果文明存在时间超过400且还未记录，则立即记录并显示信息
    if (existenceTime >= 400) {
        const era = getCivilizationEra(existenceTime);
        showInterstellarMessage(era);
        currentDestructionType = 'interstellar';
        recordCivilization("飞向了新的家园", "--", era);
        lastCivilizationRecorded = true;
    }
}

// 添加显示星际殖民消息的函数
function showInterstellarMessage(era) {
    const message = `第${civilizationId}号文明开启了星际探索，第一舰队已经启航，目标是四光年外的一个只有一颗太阳的稳定世界……`;
    
    const temperatureMessage = document.getElementById('temperature-message');
    temperatureMessage.textContent = message;
    temperatureMessage.style.display = 'block';
    
    setTimeout(() => {
        temperatureMessage.style.display = 'none';
    }, 5000);
}

// 按钮事件绑定
document.getElementById('show-history-btn').addEventListener('click', showCivilizationHistory);
document.getElementById('updateBtn').addEventListener('click', resetSimulation); // 重新模拟使用初始数据
document.getElementById('randomizeBtn').addEventListener('click', function() {
    // 重开一局时重置恒星信息窗口相关变量
    lastBodyNames = undefined;
    isUpdatingStarInfo = false; // 确保重置更新标志，防止卡死
    randomizeBodies();
}); // 重开一局

// 文明历史按钮事件
document.querySelector('.close').addEventListener('click', closeCivilizationHistory);
window.addEventListener('click', function (event) {
    const modal = document.getElementById('civilization-history-modal');
    if (event.target === modal) {
        closeCivilizationHistory();
    }
});
// 清除文明历史记录
function clearCivilizationHistory() {
    try {
        localStorage.removeItem('civilizationHistory');
        // 确保下一个文明序号从1开始
        civilizationId = 1;
        showCivilizationHistory(); // 重新加载显示（此时为空）
    } catch (e) {
        console.error("Error clearing civilization history:", e);
        alert('清除历史记录失败');
    }
}

// 确保元素存在后再绑定事件
const clearHistoryBtn = document.getElementById('clear-history-btn');
if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', clearCivilizationHistory);
}


civilizationId = getNextCivilizationId();
randomizeBodies(); // 默认随机生成
// 设置默认视角为三个正半轴围成的象限的中线朝向原点
rotationX = Math.PI / 4; // 45度
rotationY = Math.PI / 4; // 45度

// 默认展开控制面板
document.getElementById('controls-content').style.display = 'block';
document.getElementById('toggle-controls').textContent = '▼';

// 初始化第一视角按钮状态
updateFirstPersonButtonState();

animate();
showQuote(); // 启动名句轮播