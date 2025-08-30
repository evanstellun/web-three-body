// 移动设备检测和优化
// 初始加载动画逻辑
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // 3.5秒后隐藏加载动画
    setTimeout(function() {
        loadingScreen.style.animation = 'hideLoading 1s ease-out forwards';
        loadingScreen.style.pointerEvents = 'none';
        
        // 确保背景科技感样式正确应用
        document.body.style.backgroundImage = 'radial-gradient(circle at center, rgba(0, 50, 100, 0.3) 0%, rgba(0, 0, 0, 0.9) 70%)';
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

// 文明历史相关变量
let civilizationId = 1;
let civilizationStartTime = 0;
let lastCivilizationRecorded = false;

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
    "给岁月以文明，给时光以生命。",
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
    "生活需要平滑，但也需要一个方向，不能总是回到起点。", ,
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
        // 减小天体半径（质量不变）
        this.radius = Math.cbrt(mass) * 0.5;
    }
}

// 初始化天体
// 初始化天体（保存初始状态）
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

// 记录文明历史
// 显示文明发展状态
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
                // 根据灭亡消息内容判断是高温还是低温毁灭
                let destructionType = entry.destruction;
                if (entry.destruction.includes("烈焰") || 
                    entry.destruction.includes("高温") || 
                    entry.destruction.includes("巨日") ||
                    entry.destruction.includes("双日凌空") ||
                    entry.destruction.includes("飞星不动")) {
                    destructionType = "在高温下毁灭";
                } else if (entry.destruction.includes("凛冬") || 
                          entry.destruction.includes("严寒") || 
                          entry.destruction.includes("太阳落下") ||
                          entry.destruction.includes("雪花") ||
                          entry.destruction.includes("夜空升起") ||
                          entry.destruction.includes("氮氧凝固")) {
                    destructionType = "在低温下毁灭";
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
// 随机天体
function randomizeBodies() {
    // 如果上一个文明还没有毁灭，记录它繁荣昌盛
    if (!lastCivilizationRecorded && time > 0) {
        const existenceTime = time - civilizationStartTime;
        const era = getCivilizationEra(existenceTime);
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

    // 创建新的天体（使用不同质量展示不同光谱类型）
    const alpha = new CelestialBody('α', 40000, 0, 0, 0, 0, 0, 0, getSpectralColor(40000));    // O型恒星（蓝色，大质量）
    const beta = new CelestialBody('β', 15000, 0, 0, 0, 0, 0, 0, getSpectralColor(15000));      // B型恒星（蓝白色，中等质量）
    const gamma = new CelestialBody('γ', 3000, 0, 0, 0, 0, 0, 0, getSpectralColor(3000));       // K型恒星（橙色，较小质量）
    const p = new CelestialBody('p', 10, 0, 0, 0, 0, 0, 0, '#00ffff'); // 初始为青色

    bodies.push(alpha, beta, gamma, p);

    // 随机生成完全随机的三维三体系统
    // 行星质量范围
    const planetMassMin = 5;
    const planetMassMax = 55;

    // 随机系统大小
    const systemSize = Math.random() * 300 + 100; // 100-400

    // 为每个天体设置随机位置和速度
    for (let i = 0; i < bodies.length; i++) {
        // 设置质量
        if (i < 3) { // 恒星
            // 先随机选择光谱类型
            const randomSpectralType = spectralTypes[Math.floor(Math.random() * spectralTypes.length)];
            // 在该光谱类型的质量范围内随机质量
            bodies[i].mass = Math.random() * (randomSpectralType.maxMass - randomSpectralType.minMass) + randomSpectralType.minMass;
        } else { // 行星
            bodies[i].mass = Math.random() * (planetMassMax - planetMassMin) + planetMassMin;
        }

        // 设置随机位置
        const distance = Math.random() * systemSize;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        bodies[i].x = distance * Math.sin(phi) * Math.cos(theta);
        bodies[i].y = distance * Math.sin(phi) * Math.sin(theta);
        bodies[i].z = distance * Math.cos(phi);

        // 设置随机速度
        const speed = Math.random() * 15 + 5; // 5-20
        const vTheta = Math.random() * Math.PI * 2;
        const vPhi = Math.random() * Math.PI;

        bodies[i].vx = speed * Math.sin(vPhi) * Math.cos(vTheta);
        bodies[i].vy = speed * Math.sin(vPhi) * Math.sin(vTheta);
        bodies[i].vz = speed * Math.cos(vPhi);

        // 更新半径
        bodies[i].radius = Math.cbrt(bodies[i].mass) * 0.5;

        // 根据质量更新恒星颜色（仅对恒星）
        if (i < 3) { // 恒星
            bodies[i].color = getSpectralColor(bodies[i].mass);
        }

        // 初始化轨迹数组
        trails[bodies[i].name] = [];
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
                if (hasPlanetP && ((body1.name === 'p' && body2.name !== 'p') ||
                    (body2.name === 'p' && body1.name !== 'p'))) {
                    message = "行星P被恒星吞噬了";
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
                        recordCivilization("飞向了新的家园", "--", era);
                    }
                    lastCivilizationRecorded = true;
                }

                // 合并天体
                const totalMass = body1.mass + body2.mass;
                const newX = (body1.x * body1.mass + body2.x * body2.mass) / totalMass;
                const newY = (body1.y * body1.mass + body2.y * body2.mass) / totalMass;
                const newZ = (body1.z * body1.mass + body2.z * body2.mass) / totalMass;
                const newVx = (body1.vx * body1.mass + body2.vx * body2.mass) / totalMass;
                const newVy = (body1.vy * body1.mass + body2.vy * body2.mass) / totalMass;
                const newVz = (body1.vz * body1.mass + body2.vz * body2.mass) / totalMass;

                // 创建新的标准天体
                let newName = '';
                if (body1.name.length === 1 && body2.name.length === 1) {
                    newName = String.fromCharCode(body1.name.charCodeAt(0) + body2.name.charCodeAt(0));
                } else {
                    newName = 'New';
                }

                // 确保名称唯一
                let counter = 1;
                let testName = newName;
                while (bodies.some(b => b.name === testName)) {
                    testName = newName + counter;
                    counter++;
                }
                newName = testName;

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
function showTemperatureMessage(message) {
    // 如果消息与上次相同或文明已经记录，则不重复显示
    if (message === lastTemperatureMessage || lastCivilizationRecorded) return;

    lastTemperatureMessage = message;

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
            // 这里我们使用行星P作为参考点，计算恒星相对于行星P表面的高度角
            // 假设行星P的表面是一个平面，Y轴为垂直方向
            const observerY = dy; // 恒星相对于行星P的Y轴位置
            const observerHorizontalDistance = Math.sqrt(dx * dx + dz * dz); // 水平距离
            
            if (observerHorizontalDistance > 0) {
                heightAngle = Math.atan(observerY / observerHorizontalDistance) * (180 / Math.PI);
            } else if (observerY > 0) {
                heightAngle = 90; // 正上方
            } else if (observerY < 0) {
                heightAngle = -90; // 正下方
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
            `第${civilizationId}号文明在三日凌空的烈焰中毁灭了`
        ],
        twoStars: [
            `第${civilizationId}号文明在双日凌空的烈焰中毁灭了`
        ],
        oneStar: [
            `第${civilizationId}号文明在一轮巨日下毁灭了`
        ],
        default: [
            `第${civilizationId}号文明在阳光的烈焰下毁灭了`
        ]
    };

    const lowTemperatureMessages = {
        threeFlyingStars: [
            `第${civilizationId}号文明在三颗飞星的永恒寒夜中毁灭了`
        ],
        allBelowHorizon: [
            `第${civilizationId}号文明的太阳落下后再也没有升起`
        ],
        default: [
            `第${civilizationId}号文明被冻结在了无尽的凛冬中`
        ]
    };

    // 根据恒星状态选择合适的消息集合并随机选择一条消息
    let finalMessage;
    if (message.includes("在阳光的烈焰下毁灭了")) {
        // 高温情况
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
        // 随机选择一条消息
        finalMessage = messageList[Math.floor(Math.random() * messageList.length)];
    } else if (message.includes("在无尽的凛冬下毁灭了")) {
        // 低温情况
        let messageList;
        if (flyingStarCount === 3) {
            messageList = lowTemperatureMessages.threeFlyingStars;
        } else if (allBelowMinus10) {
            messageList = lowTemperatureMessages.allBelowHorizon;
        } else {
            messageList = lowTemperatureMessages.default;
        }
        // 随机选择一条消息
        finalMessage = messageList[Math.floor(Math.random() * messageList.length)];
    } else {
        // 其他情况，使用原始消息
        finalMessage = `第${civilizationId}号文明${message}`;
    }

    // 添加文明所处的时代信息
    const existenceTime = time - civilizationStartTime;
    const era = getCivilizationEra(existenceTime);
    
    finalMessage += `，该文明发展到${era}`;

    const temperatureMessage = document.getElementById('temperature-message');
    temperatureMessage.textContent = finalMessage;
    temperatureMessage.style.display = 'block';

    // 记录文明毁灭 - 但需要确保文明存在了一定时间才记录
    if (!lastCivilizationRecorded && existenceTime > 0.1) { // 至少存在0.1个时间单位才记录
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

        // 添加新的文明记录
        const record = {
            id: civilizationId,
            destruction: destructionMethod,
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
    // 找到行星p
    const planetP = bodies.find(body => body.name === 'p');
    if (!planetP) return '--';

    // 如果系统中没有其他天体，则返回默认值
    if (bodies.length <= 1) return '--';

    let totalEnergy = 0;

    // 计算来自所有其他天体的能量贡献
    for (const body of bodies) {
        // 跳过行星P本身
        if (body.name === 'p') continue;

        // 计算距离
        const dx = planetP.x - body.x;
        const dy = planetP.y - body.y;
        const dz = planetP.z - body.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // 防止除零错误
        if (distance === 0) continue;

        // 使用增强的 Stefan-Boltzmann 定律计算能量贡献
        // 假设所有天体都是理想黑体辐射源，能量与质量成正比，与距离平方成反比
        // 增加系数以提高温度值
        const energy = 50 * body.mass / (distance * distance);
        totalEnergy += energy;
    }

    // 如果没有其他天体贡献能量，返回默认值
    if (totalEnergy === 0) return '--';

    // 基于总能量计算温度 (增强模型)
    // 使用 Stefan-Boltzmann 定律: P = σ * A * T^4
    // 这里我们增强系数使温度更现实
    const temperatureK = 150 * Math.pow(totalEnergy, 0.25);

    // 转换为摄氏度
    const temperatureC = temperatureK - 273.15;

    return temperatureC.toFixed(2);
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

        // 更新速度 (F = ma => a = F/m)
        bodies[i].vx += fx / bodies[i].mass * 0.01 * speedFactor;
        bodies[i].vy += fy / bodies[i].mass * 0.01 * speedFactor;
        bodies[i].vz += fz / bodies[i].mass * 0.01 * speedFactor;
    }

    // 更新位置
    for (let body of bodies) {
        body.x += body.vx * 0.01 * speedFactor;
        body.y += body.vy * 0.01 * speedFactor;
        body.z += body.vz * 0.01 * speedFactor;
        
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
        const temperature = calculatePlanetPTemperature();
        if (temperature !== '--') {
            const temp = parseFloat(temperature);
            planetP.color = getPlanetPColor(temp);
        }
    }

    // 检查碰撞
    checkCollisions();

    // 更新时间
    time += 0.01 * speedFactor;
}
// 3D到2D投影
function project3D(x, y, z) {
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

    return {
        x: projectedX,
        y: projectedY,
        z: z2,
        sizeFactor: sizeFactor
    };
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

            // 设置轨迹颜色和透明度
            ctx.strokeStyle = body.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');

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

// 绘制天体
function drawBodies() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log('drawBodies函数被调用，isFirstPersonView状态:', isFirstPersonView);

    if (isFirstPersonView) {
        console.log('进入第一视角模式，调用drawFirstPersonView');
        drawFirstPersonView();
        return;
    }

    // 绘制网格
    drawGrid();

    // 绘制轨迹
    drawTrails();

    // 创建一个包含天体和z深度的数组，用于正确排序
    const bodiesWithDepth = bodies.map(body => {
        const projected = project3D(body.x, body.y, body.z);
        return {
            body: body,
            projected: projected,
            radius: body.radius * projected.sizeFactor * scale
        };
    });

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
            if (color.startsWith('#')) {
                const hex = color.slice(1);
                r = parseInt(hex.slice(0, 2), 16);
                g = parseInt(hex.slice(2, 4), 16);
                b = parseInt(hex.slice(4, 6), 16);
            } else {
                r = g = b = 255; // 默认白色
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
}

// 获取鼠标点击位置下的天体
function getBodyAtPosition(mouseX, mouseY) {
    // 创建一个包含天体和z深度的数组，用于正确排序
    const bodiesWithDepth = bodies.map(body => {
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
    console.log('drawFirstPersonView函数被调用');
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
    console.log('准备调用updateStarsInFirstPersonView函数，当前isFirstPersonView状态:', isFirstPersonView);
    updateStarsInFirstPersonView(referencePoint);
    
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
    
    // 相机初始位置（提高视角高度）
    firstPersonCamera.position.y = 10.0;
    cameraContainer.add(firstPersonCamera);
    
    // 创建格子地面（类似Minecraft超平坦模式）
    const gridSize = 1000;
    const gridDivisions = 100;
    const groundGeometry = new THREE.PlaneGeometry(gridSize, gridSize, gridDivisions, gridDivisions);
    
    // 创建格子材质
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x808080,
        roughness: 0.9,
        metalness: 0.1,
        side: THREE.DoubleSide,
        wireframe: false
    });
    
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0; // 地面位于Y=0位置
    ground.renderOrder = 1; // 确保地面在所有其他对象之上渲染
    firstPersonScene.add(ground);
    
    // 创建格子线框 - 缓解摩尔纹效应
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x404040, 0x404040);
    gridHelper.position.y = 0.01; // 稍微抬高避免z-fighting
    // 设置网格线更粗并增强抗锯齿
    gridHelper.material.linewidth = 3; // 增大线宽
    gridHelper.material.antialias = true; // 启用抗锯齿
    gridHelper.material.depthTest = false; // 禁用深度测试以减少锯齿
    gridHelper.material.depthWrite = false; // 禁用深度写入以减少锯齿
    
    // 为网格线添加轻微的随机偏移来打破规律性，缓解摩尔纹
    const gridPositions = gridHelper.geometry.attributes.position.array;
    for (let i = 0; i < gridPositions.length; i += 3) {
        // 只对X和Z坐标添加微小随机偏移，Y坐标保持不变
        gridPositions[i] += (Math.random() - 0.5) * 0.1; // X轴偏移
        gridPositions[i + 2] += (Math.random() - 0.5) * 0.1; // Z轴偏移
    }
    gridHelper.geometry.attributes.position.needsUpdate = true;
    firstPersonScene.add(gridHelper);
    
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
    
    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    firstPersonScene.add(ambientLight);
    
    // 移除雾效效果
    
    // 添加星星背景
    createStarField();
    
    firstPersonInitialized = true;
}

// 背景星星对象引用
let starField = null;

// 创建星星背景
function createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        // 在球面上随机分布星星
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 490;
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        transparent: true,
        opacity: 0.8
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
        // 注意：现在所有恒星都会被投影，即使在地面以下或被完全遮挡
        
        // 将经度和纬度转换为3D空间中的位置
        const skyRadius = 490; // 稍微小于天穹半径
        
        // 地面遮挡检测：考虑恒星大小，让恒星可以部分显示直到完全沉入地平线
        // 计算恒星在观察者坐标系中的实际高度（使用相对于地面的纬度）
        const starHeight = skyRadius * Math.sin(latitude);
        
        // 计算恒星大小 - 基础大小根据距离缩放，距离越近越大，距离越远越小
        
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
        
        // 创建恒星对象 - 根据距离动态调整大小，增强远距离变小效果
        // 基础大小根据距离缩放，距离越近越大，距离越远越小
        const baseSize = star.radius * 2;
        const distanceScale = Math.max(0.1, Math.min(12, 500 / distance)); // 距离500时为原始大小，距离越近越大，最大12倍，最小0.1倍
        
        // 计算恒星大小
        let calculatedSize = baseSize * distanceScale;
        const starSize = Math.max(0.3, Math.min(60, calculatedSize)); // 最小尺寸减小到0.3
        const starGeometry = new THREE.SphereGeometry(starSize, 32, 32); // 增加分段数使太阳更接近圆形
        
        // 根据距离调整亮度 - 大幅增强近距离亮度效果
        const brightness = Math.max(0.5, Math.min(15, 3 - distance * 0.006)); // 提高基础亮度、最大亮度和影响范围
        
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
                    varying float vGroundClip;
                    
                    void main() {
                        vUv = uv;
                        
                        // 计算顶点是否在地面以下
                        // 假设地面在y=0位置
                        vec4 worldPos = modelMatrix * vec4(position, 1.0);
                        vGroundClip = max(0.0, worldPos.y + 0.5); // 添加小偏移以平滑过渡
                        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color;
                    uniform float maxOpacity;
                    varying vec2 vUv;
                    varying float vGroundClip;
                    
                    void main() {
                        // 计算从中心到边缘的距离（0-1）
                        vec2 center = vec2(0.5, 0.5);
                        float distance = length(vUv - center) * 2.0; // 映射到0-1范围
                        
                        // 使用平滑的衰减函数，使光晕从中心到边缘逐渐淡出到完全透明
                        // 减小衰减因子，使光晕更加明显
                        float opacity = maxOpacity * exp(-distance * 2.0);
                        
                        // 添加地面裁剪，确保光晕不会出现在地面以下
                        opacity *= smoothstep(0.0, 1.0, vGroundClip);
                        
                        gl_FragColor = vec4(color, opacity);
                    }
                `,
                transparent: true,
                depthWrite: false,
                depthTest: false,
                blending: THREE.AdditiveBlending
            });
        };
        
        // 检查恒星是否在地面以上，如果在地面以下则不添加光晕
        if (y > -starSize) { // 确保恒星大部分在地面以上才显示光晕
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
        
        const typeLabel = '(太阳)';
        
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
    
    // 更新天空颜色根据太阳距离
    updateSkyDomeColor(stars, planetP);
    
    // 更新地面亮度
    updateGroundBrightness();
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
    if (!ground) return;
    
    // 根据总亮度计算地面颜色（深灰色到浅灰色）
    const normalizedBrightness = Math.max(0, Math.min(1, currentTotalBrightness / 60)); // 0-60映射到0-1
    
    // 深灰色（最暗）
    const darkR = 64, darkG = 64, darkB = 64; // #404040
    // 浅灰色（最亮）
    const brightR = 200, brightG = 200, brightB = 200; // #C8C8C8
    
    // 使用线性插值计算最终颜色
    const finalR = darkR + (brightR - darkR) * normalizedBrightness;
    const finalG = darkG + (brightG - darkG) * normalizedBrightness;
    const finalB = darkB + (brightB - darkB) * normalizedBrightness;
    
    const groundColor = new THREE.Color(finalR/255, finalG/255, finalB/255);
    ground.material.color = groundColor;
    
    // 更新格子线框颜色 - 始终比地面颜色亮
    const gridHelper = firstPersonScene.children.find(child => child instanceof THREE.GridHelper);
    if (gridHelper) {
        // 基于地面颜色计算网格线颜色，始终比地面亮
        const gridColor = groundColor.clone();
        gridColor.multiplyScalar(1.5); // 将地面颜色亮度增加50%
        // 确保颜色值在有效范围内
        gridColor.r = Math.min(1, gridColor.r);
        gridColor.g = Math.min(1, gridColor.g);
        gridColor.b = Math.min(1, gridColor.b);
        gridHelper.material.color = gridColor;
    }
}

// 更新天空颜色根据太阳距离
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
    
    // 更新相机旋转 - 只应用用户视角控制
    cameraContainer.rotation.y = firstPersonRotation;
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
        
        // 纬度因子：考虑地平线遮挡效果，越接近地平线越暗淡
        const latitudeFactor = Math.max(0.1, adjustedLatitude / (Math.PI / 2));
        
        const brightness = distanceFactor * latitudeFactor;
        
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
        // 删除了第一视角模式下显示的温度和行星距离窗口
    } else {
        // 普通模式下显示操作说明
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 300, 60);
        
        ctx.fillStyle = '#00ccff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('第一视角模式', 20, 30);
        ctx.fillText('ESC键: 退出第一视角', 20, 50);
    }
}

// 切换第一视角
function toggleFirstPersonView() {
    isFirstPersonView = !isFirstPersonView;
    console.log('切换第一视角模式:', isFirstPersonView ? '进入' : '退出');
    const btn = document.getElementById('first-person-btn');
    const infoBtn = document.getElementById('toggle-info');
    const infoPanel = document.getElementById('info');
    const infoContent = document.getElementById('info-content');
    
    if (isFirstPersonView) {
        // 进入第一视角模式
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
        
        // 显示第一视角渲染器DOM元素
        if (firstPersonRenderer && firstPersonRenderer.domElement) {
            firstPersonRenderer.domElement.style.display = 'block';
        }
        
        // 显示文本标注容器
        if (labelContainer) {
            labelContainer.style.display = 'block';
        }
    } else {
        // 退出第一视角模式
        document.body.classList.remove('first-person-mode');
        btn.classList.remove('active');
        btn.textContent = '第一视角';
        
        // 停止实时更新恒星信息
        isShowingStarInfo = false;
        
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
                // 根据灭亡消息内容判断是高温还是低温毁灭
                let destructionType = "被观察者关闭了"; // 默认低温毁灭
                
                // 高温毁灭的关键词
                if (entry.destruction.includes("烈焰") || 
                    entry.destruction.includes("高温") || 
                    entry.destruction.includes("巨日") || 
                    entry.destruction.includes("三日凌空") || 
                    entry.destruction.includes("双日凌空") || 
                    entry.destruction.includes("飞星不动") || 
                    entry.destruction.includes("吞噬") || 
                    entry.destruction.includes("烈日")) {
                    destructionType = "在高温下毁灭";
                } 
                // 星际探索特殊情况保留
                else if (entry.destruction.includes("星际") || 
                         entry.destruction.includes("家园")) {
                    destructionType = "飞向了新家园";
                }
                // 其他情况默认为低温毁灭

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

// 主动画循环
function animate() {
    updateBodiesPosition();
    console.log('animate函数调用drawBodies，isFirstPersonView状态:', isFirstPersonView);
    drawBodies();

    // 更新UI信息
    document.getElementById('body-count').textContent = `天体数量: ${bodies.length}`;
    document.getElementById('time-info').textContent = `时间: ${time.toFixed(2)}`;

    // 更新行星P表面温度
    const temperature = calculatePlanetPTemperature();
    document.getElementById('temperature-info').textContent = `行星P表面温度: ${temperature} °C`;
    
    // 更新第一视角按钮状态
    updateFirstPersonButtonState();

    // 如果正在显示恒星信息，则实时更新（不限制视角模式）
    if (isShowingStarInfo) {
        updateStarInfo();
    }

    // 检查文明是否达到里程碑
    checkCivilizationMilestone();

    // 检查温度并显示相应消息（仅当文明尚未记录时）
    if (temperature !== '--' && !lastCivilizationRecorded) {
        const temp = parseFloat(temperature);
        if (temp > 400) {
            showTemperatureMessage("在阳光的烈焰下毁灭了……文明的种子仍然存在");
        } else if (temp < -100) {
            showTemperatureMessage("在无尽的凛冬下毁灭了……文明的种子仍然存在");
        }
    }

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
            
            // 限制垂直角度范围（-85度到85度）
            verticalAngle = Math.max(-Math.PI * 0.472, Math.min(Math.PI * 0.472, verticalAngle));
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
            
            // 限制垂直角度范围（-85度到85度）
            verticalAngle = Math.max(-Math.PI * 0.472, Math.min(Math.PI * 0.472, verticalAngle));
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

function showBodyInfo(body) {
    selectedBody = body;
    document.getElementById('body-name').textContent = body.name;
    document.getElementById('body-mass').textContent = body.mass;
    document.getElementById('body-velocity').textContent = `${Math.sqrt(body.vx**2 + body.vy**2 + body.vz**2).toFixed(2)}`;
    
    const bodyInfo = document.getElementById('body-info');
    // 显示天体信息窗口
    bodyInfo.style.display = 'block';
    // 保持操作说明窗口显示，不隐藏它
}

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
            // 获取所有非行星P的天体
            const celestialBodies = bodies.filter(body => body.name !== 'p');
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
    console.log('updateStarInfo被调用，isShowingStarInfo:', isShowingStarInfo, 'isUpdatingStarInfo:', isUpdatingStarInfo, 'callCount:', updateStarInfo.callCount || 0);
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
        
        // 获取所有有效的非行星P的天体 - 使用let允许后续重新赋值
        let celestialBodies = bodies.filter(body => body && body.name && body.name !== 'p');
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
                    // 修改恒星颜色为白色
                    body.color = '#ffffff';
                } else {
                    // 恢复原来的恒星颜色
                    body.color = getSpectralColor(body.mass);
                    
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
        
        if (content.style.display === 'none' || content.style.display === '') {
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
            color: body.color
        })),
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
                    return new CelestialBody(
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