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
let verticalAngle = 0; // 垂直视角角度

// 文明历史相关变量
let civilizationId = 1;
let civilizationStartTime = 0;
let lastCivilizationRecorded = false;

// 天体轨迹历史记录
const trailLength = 100; // 移动端减少轨迹点数量以提高性能
const trails = {}; // 存储每个天体的轨迹点

// 三体名句
const quotes = [
    "不要回答！不要回答！不要回答！",
    "消灭人类暴政，世界属于三体！",
    "我们都是阴沟里的虫子，但总还是得有人仰望星空。",
    "给岁月以文明，给时光以生命。",
    "西方人并不比东方人聪明，但是他们却找对了路。",
    "越透明的东西越神秘，宇宙本身就是透明的，只要目力能及，你想看多远就看多远，但越看越神秘。",
    "上帝是个无耻的老赌徒，他抛弃了我们！",
    "藏好自己，做好清理。",
    "一知道在哪儿，世界就变得像一张地图那么小了；不知道在哪儿，感觉世界才广阔。",
    "给岁月以文明，而不是给文明以岁月。",
    "虫子从来没有被战胜过。",
    "碑是那么小，与其说是为了纪念，更像是为了忘却。",
    "前进！前进！不择手段地前进！",
    "一切的一切都导向这样一个结果：物理学从来就没有存在过，将来也不会存在。我知道自己这样做是不负责任的，但别无选择。",
    "把字刻在石头上。",
    "我不知道你在这儿，知道的话我会常来看你的。",
    "你的无畏来源于无知。",
    "记忆是一条早已干涸的河流，只在毫无生气的河床中剩下零落的砾石。",
    "空不是无，空是一种存在，你得用空这种存在填满自己。",
    "因为只有在这个选择中，人是大写的。",
    "弱小和无知不是生存的障碍，傲慢才是。",
    "毁灭你，与你有何相干？",
    "我有一个梦，也许有一天，灿烂的阳光能照进黑暗森林。",
    "没有什么能永远存在，即使是宇宙也有灭亡的那一天，凭什么人类就觉得自己该永远存在下去。",
    "是对规律的渴望，还是对混沌的屈服。",
    "这是人类的落日。",
    "在黑暗中沉淀出了重元素，所以光明不是文明的母亲，黑暗才是。",
    "“把海弄干的鱼在海干前上了陆地，从一片黑暗森林奔向另一片黑暗森林。鱼上了岸，也就不再是鱼。”",
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
    "这里本就没有路，你若想走，那它便是一条路，你若不想，那它便只会是一片荒野。",
    "当你开始和你的敌人共情的时候，你的是非观就已经被颠覆了。",
    "在意义之塔上，生存高于一切，面对生存，任何低熵体都只能两害相权取其轻。",
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
    "现在，我让心脏停止跳动，与此同时，我将成为两个文明有史以来最大的罪犯，对此，我对两个文明表示深深的歉意，但不会忏悔。",
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
        new CelestialBody('α', 10000, 0, 0, 0, 0, 0, 0, '#ff5555'),
        new CelestialBody('β', 10000, 200, 0, 0, 0, 10, 0, '#5555ff'),
        new CelestialBody('γ', 10000, -200, 0, 0, 0, -10, 0, '#55ff55'),
        new CelestialBody('p', 10, 0, 150, 0, -15, 0, 0, '#ffff55')
    ];
    
    // 保存初始状态
    saveInitialBodies();
    
    // 初始化轨迹数组
    for (const body of bodies) {
        trails[body.name] = [];
    }
    updateUI();
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
// 修改 showCivilizationHistory 函数以显示文明发展状态
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
// 修改 randomizeBodies 函数
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

    // 清空当前所有天体和轨迹
    bodies = [];

    // 清空轨迹数据
    for (let key in trails) {
        delete trails[key];
    }

    // 创建新的天体
    const alpha = new CelestialBody('α', 10000, 0, 0, 0, 0, 0, 0, '#ff5555');
    const beta = new CelestialBody('β', 10000, 0, 0, 0, 0, 0, 0, '#5555ff');
    const gamma = new CelestialBody('γ', 10000, 0, 0, 0, 0, 0, 0, '#55ff55');
    const p = new CelestialBody('p', 10, 0, 0, 0, 0, 0, 0, '#00ffff'); // 初始为青色

    bodies.push(alpha, beta, gamma, p);

    // 随机生成完全随机的三维三体系统
    // 随机质量范围
    const starMassMin = 5000;
    const starMassMax = 20000;
    const planetMassMin = 5;
    const planetMassMax = 55;

    // 随机系统大小
    const systemSize = Math.random() * 300 + 100; // 100-400

    // 为每个天体设置随机位置和速度
    for (let i = 0; i < bodies.length; i++) {
        // 设置质量
        if (i < 3) { // 恒星
            bodies[i].mass = Math.random() * (starMassMax - starMassMin) + starMassMin;
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
// 检查碰撞
// 检查碰撞
// 修改 checkCollisions 函数中的相关部分
// 修改 checkCollisions 函数
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

                const newBody = new CelestialBody(
                    newName,
                    totalMass,
                    newX, newY, newZ,
                    newVx, newVy, newVz,
                    body1.color // 保持原有颜色
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
// 显示碰撞消息
function showCollisionMessage(message) {
    const collisionMessage = document.getElementById('collision-message');
    collisionMessage.textContent = message;
    collisionMessage.style.display = 'block';

    setTimeout(() => {
        collisionMessage.style.display = 'none';
    }, 5000);
}

// 修改 showTemperatureMessage 函数
function showTemperatureMessage(message) {
    // 如果消息与上次相同或文明已经记录，则不重复显示
    if (message === lastTemperatureMessage || lastCivilizationRecorded) return;

    lastTemperatureMessage = message;

    // 定义不同温度情况下的多种描述
    const coldMessages = [
        `第${civilizationId}号文明在无尽的凛冬下毁灭了`,
    ];

    const hotMessages = [

        `第${civilizationId}号文明在阳光的烈焰下毁灭了`,
    ];

    // 根据消息内容选择合适的描述集合
    let finalMessage;
    if (message.includes("在阳光的烈焰下毁灭了")) {
        // 高温情况，随机选择一种描述
        finalMessage = hotMessages[Math.floor(Math.random() * hotMessages.length)];
    } else if (message.includes("在无尽的凛冬下毁灭了")) {
        // 低温情况，随机选择一种描述
        finalMessage = coldMessages[Math.floor(Math.random() * coldMessages.length)];
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
}// 修改 recordCivilization 函数
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

    // 按z深度排序（从后到前）
    trailsWithDepth.sort((a, b) => a.avgZ - b.avgZ);

    // 绘制轨迹
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

    if (isFirstPersonView) {
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

    // 按z深度排序（从后到前）
    bodiesWithDepth.sort((a, b) => a.projected.z - b.projected.z);

    // 绘制天体
    for (let bodyData of bodiesWithDepth) {
        const body = bodyData.body;
        const projected = bodyData.projected;
        const radius = bodyData.radius;

        // 绘制天体
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, Math.max(1, radius), 0, Math.PI * 2);
        ctx.fillStyle = body.color;
        ctx.fill();

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
    const planetP = bodies.find(body => body.name === 'p');
    if (!planetP) return;

    // 初始化Three.js场景（如果尚未初始化）
    if (!firstPersonScene) {
        initFirstPersonScene();
    }

    // 更新恒星位置
    updateStarsInFirstPersonView(planetP);
    
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

// 初始化第一视角3D场景
function initFirstPersonScene() {
    // 创建场景
    firstPersonScene = new THREE.Scene();
    
    // 创建相机
    firstPersonCamera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    
    // 创建渲染器 - 启用抗锯齿
    firstPersonRenderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true // 启用渲染器级别的抗锯齿
    });
    firstPersonRenderer.setSize(canvas.width, canvas.height);
    firstPersonRenderer.setClearColor(0x000000, 0); // 透明背景
    
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

// 更新第一视角中的恒星位置
function updateStarsInFirstPersonView(planetP) {
    if (!firstPersonInitialized) return;
    
    // 获取行星P的自转角度
    let planetRotation = 0;
    if (planetP && planetP.rotationAngle) {
        planetRotation = planetP.rotationAngle;
    }
    
    // 清除旧的恒星对象
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
        
        // 光晕对象已移除，无需释放
    });
    starObjects = [];
    
    // 获取三颗恒星
    const stars = bodies.filter(body => body.name !== 'p');
    
    // 观察者位于行星P的位置
    const observerX = planetP.x;
    const observerY = planetP.y;
    const observerZ = planetP.z;
    
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
        // 纬度相对于地面固定，不受观察者视角影响
        
        // 将经度和纬度转换为3D空间中的位置
        const skyRadius = 490; // 稍微小于天穹半径
        
        // 地面遮挡检测：如果恒星位置低于地平线且被地面遮挡，则不显示
        // 计算恒星在观察者坐标系中的实际高度（使用相对于地面的纬度）
        const starHeight = skyRadius * Math.sin(latitude);
        
        // 如果恒星高度低于观察者脚部位置（地面高度），则被地面遮挡
        if (starHeight < 0) {
            return; // 跳过这颗恒星的绘制
        }
        
        // 观察者视角可见性判断：考虑观察者的垂直视角
        // 计算恒星相对于观察者视角的可见纬度
        const visibleLatitude = latitude - verticalAngle;
        
        // 如果可见纬度小于0，说明恒星在观察者视角下方，不显示
        if (visibleLatitude < 0) {
            return; // 跳过这颗恒星的绘制
        }
        
        // 使用相对于地面的纬度进行投影
        const x = skyRadius * Math.cos(latitude) * Math.sin(longitude);
        const y = skyRadius * Math.sin(latitude);
        const z = skyRadius * Math.cos(latitude) * Math.cos(longitude);
        
        // 创建恒星对象 - 根据距离动态调整大小，增强远距离变小效果
        // 基础大小根据距离缩放，距离越近越大，距离越远越小
        const baseSize = star.radius * 2;
        const distanceScale = Math.max(0.1, Math.min(12, 500 / distance)); // 距离500时为原始大小，距离越近越大，最大12倍，最小0.1倍
        
        // 判断是否为远距离恒星（飞星）
        const isFlyingStar = distance > 450;
        
        // 计算恒星大小，飞星额外缩小
        let calculatedSize = baseSize * distanceScale;
        if (isFlyingStar) {
            calculatedSize *= 0.3; // 飞星大小缩小到原来的30%
        }
        const starSize = Math.max(0.3, Math.min(60, calculatedSize)); // 最小尺寸减小到0.3
        const starGeometry = new THREE.SphereGeometry(starSize, 32, 32); // 增加分段数使太阳更接近圆形
        
        // 根据距离调整亮度 - 增强近距离亮度效果
        const brightness = Math.max(0.3, Math.min(10, 2 - distance * 0.008)); // 最大亮度增加到2.5，增强近距离效果
        
        let starMaterial;
        if (isFlyingStar) {
            // 飞星：纯白色，取消透明度设置
            starMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff
            });
        } else {
            // 近距离恒星：黄色，取消透明度设置
            starMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff66
            });
        }
        
        const starMesh = new THREE.Mesh(starGeometry, starMaterial);
        starMesh.position.set(x, y, z);
        
        // 移除恒星光晕效果
        let glowMeshes = [];
        
        firstPersonScene.add(starMesh);
        
        // 保存恒星对象引用
        starObjects.push({
            mesh: starMesh,
            glowMeshes: glowMeshes,
            star: star,
            distance: distance,
            brightness: brightness
        });
    });
    
    // 更新天空颜色根据太阳距离
    updateSkyDomeColor(stars, planetP);
    
    // 更新地面亮度
    updateGroundBrightness();
}

// 更新地面亮度
function updateGroundBrightness() {
    if (!ground) return;
    
    // 计算所有恒星的总亮度
    let totalBrightness = 0;
    starObjects.forEach(starObj => {
        totalBrightness += starObj.brightness;
    });
    
    // 根据总亮度调整地面颜色
    const brightness = Math.min(1, totalBrightness);
    const baseColor = new THREE.Color(0x404040); // 深灰色
    const brightColor = new THREE.Color(0x808080); // 灰色
    
    const finalColor = baseColor.lerp(brightColor, brightness);
    ground.material.color = finalColor;
    
    // 更新格子线框颜色 - 始终比地面颜色亮
    const gridHelper = firstPersonScene.children.find(child => child instanceof THREE.GridHelper);
    if (gridHelper) {
        // 基于地面颜色计算网格线颜色，始终比地面亮
        const gridColor = finalColor.clone();
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
    
    // 计算太阳的最近距离
    let minStarDistance = Infinity;
    stars.forEach(star => {
        const dx = star.x - planetP.x;
        const dy = star.y - planetP.y;
        const dz = star.z - planetP.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        minStarDistance = Math.min(minStarDistance, distance);
    });
    
    // 根据太阳距离计算天空亮度和颜色
    const maxDistance = 300;
    const brightnessFactor = Math.max(0, 1 - minStarDistance / maxDistance);
    
    // 根据太阳距离调整天空颜色
    // 太阳接近时：明亮的浅天蓝色
    // 太阳远离时：深蓝到黑色
    const baseR = Math.floor(0 + brightnessFactor * 200); // 增强红色分量
    const baseG = Math.floor(0 + brightnessFactor * 230); // 增强绿色分量
    const baseB = Math.floor(17 + brightnessFactor * 238); // 增强蓝色分量
    
    // 创建Three.js颜色对象
    const skyColor = new THREE.Color(`rgb(${baseR}, ${baseG}, ${baseB})`);
    
    // 更新天穹颜色
    skyDome.material.color = skyColor;
    
    // 根据亮度调整天穹透明度
    const opacity = Math.max(0.3, Math.min(0.9, 0.3 + brightnessFactor * 0.6));
    skyDome.material.opacity = opacity;
}

// 用于跟踪天穹和恒星的旋转角度
let skyRotation = 0;

// 渲染第一视角场景
function renderFirstPersonScene() {
    if (!firstPersonInitialized) return;
    
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
    // 修改旋转轴为平行于地面（X轴）
    if (skyDome) {
        // 使用我们自己的旋转角度而不是行星自转
        skyDome.rotation.x = skyRotation;
    }
    
    // 让背景星星也随天穹一起旋转
    if (starField) {
        starField.rotation.x = skyRotation;
    }
    
    // 让太阳和飞星也随天穹一起旋转
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
    
    // 将Three.js渲染结果绘制到2D canvas上
    ctx.drawImage(firstPersonRenderer.domElement, 0, 0);
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
    
    // 计算太阳的最近距离
    let minStarDistance = Infinity;
    stars.forEach(star => {
        const dx = star.x - planetP.x;
        const dy = star.y - planetP.y;
        const dz = star.z - planetP.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        minStarDistance = Math.min(minStarDistance, distance);
    });
    
    // 根据太阳距离计算地面亮度和颜色
    const maxDistance = 300;
    const starBrightnessFactor = Math.max(0, 1 - minStarDistance / maxDistance);
    
    // 结合恒星亮度和原始亮度
    const totalBrightness = Math.max(0, Math.min(1, brightness + starBrightnessFactor * 0.8));
    
    // 根据太阳距离调整地面颜色
    // 太阳接近时：明亮的浅灰色
    // 太阳远离时：冷灰黑色
    const baseR = 64, baseG = 64, baseB = 64; // 深灰色 #404040
    const brightR = 200, brightG = 200, brightB = 200; // 明亮的浅灰色
    const warmR = 220, warmG = 210, warmB = 200; // 温暖的浅灰褐色
    
    // 根据亮度混合颜色
    let finalR, finalG, finalB;
    if (starBrightnessFactor > 0.5) {
        // 太阳接近时，使用明亮的浅灰色
        finalR = Math.floor(baseR + (brightR - baseR) * totalBrightness);
        finalG = Math.floor(baseG + (brightG - baseG) * totalBrightness);
        finalB = Math.floor(baseB + (brightB - baseB) * totalBrightness);
    } else {
        // 太阳远离时，使用冷色调
        finalR = Math.floor(baseR + (128 - baseR) * totalBrightness);
        finalG = Math.floor(baseG + (128 - baseG) * totalBrightness);
        finalB = Math.floor(baseB + (128 - baseB) * totalBrightness);
    }
    
    // 更新Three.js地面材质颜色
    if (groundTerrain) {
        groundTerrain.material.color.setRGB(finalR/255, finalG/255, finalB/255);
    }
    
    // 更新碎石颜色
    debrisStones.forEach(stone => {
        const stoneGray = Math.floor(Math.random() * 60 + 80);
        const adjustedGray = Math.floor(stoneGray * (0.5 + totalBrightness * 0.5));
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
    // 获取三颗恒星
    const stars = bodies.filter(body => body.name !== 'p');
    const planetP = bodies.find(body => body.name === 'p');
    
    // 计算太阳的最近距离
    let minStarDistance = Infinity;
    stars.forEach(star => {
        const dx = star.x - planetP.x;
        const dy = star.y - planetP.y;
        const dz = star.z - planetP.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        minStarDistance = Math.min(minStarDistance, distance);
    });
    
    // 根据太阳距离计算天空亮度和颜色
    const maxDistance = 300;
    const brightnessFactor = Math.max(0, 1 - minStarDistance / maxDistance);
    
    // 根据太阳距离调整天空颜色
    // 太阳接近时：明亮的浅天蓝色
    // 太阳远离时：深蓝到黑色
    const baseR = Math.floor(0 + brightnessFactor * 200); // 增强红色分量
    const baseG = Math.floor(0 + brightnessFactor * 230); // 增强绿色分量
    const baseB = Math.floor(17 + brightnessFactor * 238); // 增强蓝色分量
    
    const midR = Math.floor(0 + brightnessFactor * 180);
    const midG = Math.floor(0 + brightnessFactor * 210);
    const midB = Math.floor(51 + brightnessFactor * 204);
    
    const horizonR = Math.floor(0 + brightnessFactor * 150);
    const horizonG = Math.floor(0 + brightnessFactor * 180);
    const horizonB = Math.floor(85 + brightnessFactor * 170);
    
    // 绘制天空渐变（根据太阳距离调整亮度和颜色，增强地平线过渡效果）
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
    
    skyGradient.addColorStop(0, `rgb(${baseR}, ${baseG}, ${baseB})`);
    skyGradient.addColorStop(0.4, `rgb(${midR}, ${midG}, ${midB})`);
    skyGradient.addColorStop(0.8, `rgb(${horizonR}, ${horizonG}, ${horizonB})`);
    skyGradient.addColorStop(1, `rgb(${Math.floor(horizonR*0.8)}, ${Math.floor(horizonG*0.8)}, ${Math.floor(horizonB*0.8)})`);
    
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
    
    // 绘制星星背景（太阳近时星星变暗）
    const starBrightness = Math.max(0.1, 1 - brightnessFactor * 0.8);
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
        
        // 判断是否为远距离恒星（飞星）
        const isFlyingStar = distance > 450;
        
        if (isFlyingStar) {
            // 飞星：纯白色，固定大小，无光晕
            const flyingStarSize = 6;
            const flyingStarAlpha = 1;
            ctx.fillStyle = `rgba(255, 255, 255, ${flyingStarAlpha})`;
            ctx.beginPath();
            ctx.arc(skyX, skyY, flyingStarSize, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // 近距离恒星：黄色，有光晕
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
        }
    });
    
    // 返回总亮度用于调整地面亮度
    return Math.min(1, totalBrightness);
}
// 绘制第一视角控制提示
function drawFirstPersonControls() {
    if (isFirstPersonView) {
        // 第一视角模式下显示行星温度和自转信息
        const temperature = calculatePlanetPTemperature();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 300, 80);
        
        ctx.fillStyle = '#00ccff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('第一视角模式', 20, 30);
        ctx.fillText(`行星P表面温度: ${temperature} °C`, 20, 50);
        ctx.fillText('行星自转: 10刻/圈', 20, 70);
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
    const btn = document.getElementById('first-person-btn');
    
    if (isFirstPersonView) {
        // 进入第一视角模式
        centerBody = null; // 取消任何聚焦
        document.body.classList.add('first-person-mode');
        btn.classList.add('active');
        btn.textContent = '返回旁观视角';
        
        // 隐藏不必要的UI元素，但保持控制面板可见
        document.getElementById('info').style.display = 'none';
        document.getElementById('body-info').style.display = 'none';
        // 确保控制面板在第一视角模式下仍然可见
        document.getElementById('controls-container').style.display = 'block';
    } else {
        // 退出第一视角模式
        document.body.classList.remove('first-person-mode');
        btn.classList.remove('active');
        btn.textContent = '第一视角';
        
        // 恢复UI元素
        document.getElementById('info').style.display = 'block';
        // 恢复控制面板显示
        document.getElementById('controls-container').style.display = 'block';
    }
}

// 显示文明历史
// 修改 showCivilizationHistory 函数
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
                if (entry.destruction.includes("烈焰")) {
                    destructionType = "在高温下毁灭";
                } else if (entry.destruction.includes("凛冬")) {
                    destructionType = "在低温下毁灭";
                } else if (entry.destruction.includes("星际")) {
                    destructionType = "飞向了新家园";
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

// 主动画循环
// 修改主动画循环函数
function animate() {
    updateBodiesPosition();
    drawBodies();

    // 更新UI信息
    document.getElementById('body-count').textContent = `天体数量: ${bodies.length}`;
    document.getElementById('time-info').textContent = `时间: ${time.toFixed(2)}`;

    // 更新行星P表面温度
    const temperature = calculatePlanetPTemperature();
    document.getElementById('temperature-info').textContent = `行星P表面温度: ${temperature} °C`;

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
            
            // 鼠标上下移动：抬头低头（垂直旋转）
            verticalAngle += deltaY * 0.01;
            
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
            // 显示操作说明窗口
            document.getElementById('info').style.display = 'block';
        }
    }
});


canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    scale *= e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.max(0.1, Math.min(scale, 10));
});

// 双击事件处理
canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const body = getBodyAtPosition(x, y);
    if (body) {
        centerBody = body;
    } else {
        centerBody = null; // 取消聚焦
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
                } else {
                    centerBody = null; // 取消聚焦
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
            
            // 触摸上下移动：抬头低头（垂直旋转）
            verticalAngle += deltaY * 0.01;
            
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
            // 显示操作说明窗口
            document.getElementById('info').style.display = 'block';
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
});

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



// 第一视角按钮事件监听器
document.getElementById('first-person-btn').addEventListener('click', () => {
    toggleFirstPersonView();
});

// 控制面板展开/收起
// ... existing code ...
document.getElementById('toggle-controls').addEventListener('click', function() {
    const controlsContainer = document.getElementById('controls-container');
    const toggleBtn = document.getElementById('toggle-controls');
    const controlsContent = document.getElementById('controls-content');
if (controlsContent) {
    controlsContent.style.display = 'block';
}
document.getElementById('toggle-controls').textContent = '收起';
    if (controlsContainer.classList.contains('collapsed')) {
        controlsContainer.classList.remove('collapsed');
        toggleBtn.textContent = '收起';
        controlsContent.style.display = 'grid';
    } else {
        controlsContainer.classList.add('collapsed');
        toggleBtn.textContent = '展开';
        controlsContent.style.display = 'none';
    }
});

function showBodyInfo(body) {
    selectedBody = body;
    document.getElementById('body-name').textContent = body.name;
    document.getElementById('body-mass').textContent = body.mass;
    document.getElementById('body-velocity').textContent = `${Math.sqrt(body.vx**2 + body.vy**2 + body.vz**2).toFixed(2)}`;
    
    const bodyInfo = document.getElementById('body-info');
    const infoPanel = document.getElementById('info');
    
    // 隐藏操作说明窗口
    infoPanel.style.display = 'none';
    // 显示天体信息窗口
    bodyInfo.style.display = 'block';
}

// 添加天体信息窗口关闭按钮事件
if(document.getElementById('toggle-body-info')) {
    document.getElementById('toggle-body-info').addEventListener('click', function() {
        const bodyInfo = document.getElementById('body-info');
        const infoPanel = document.getElementById('info');
        
        bodyInfo.style.display = 'none';
        // 重新显示操作说明窗口
        infoPanel.style.display = 'block';
        selectedBody = null;
    });
}
// 操作指南展开/收起
document.getElementById('toggle-info').addEventListener('click', function () {
    const content = document.getElementById('info-content');
    const button = this;

    if (content.style.display === 'none') {
        content.style.display = 'block';
        button.textContent = '−';
    } else {
        content.style.display = 'none';
        button.textContent = '+';
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
document.getElementById('randomizeBtn').addEventListener('click', randomizeBodies); // 重开一局

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
// 删除重复且可能出错的绑定代码


civilizationId = getNextCivilizationId();
randomizeBodies(); // 默认随机生成
// 设置默认视角为三个正半轴围成的象限的中线朝向原点
rotationX = Math.PI / 4; // 45度
rotationY = Math.PI / 4; // 45度

// 默认展开控制面板
document.getElementById('controls-content').style.display = 'block';
document.getElementById('toggle-controls').textContent = '收起';

animate();
showQuote(); // 启动名句轮播