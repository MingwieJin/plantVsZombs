import { _decorator, Component, Node, Sprite, Enum, EventMouse } from 'cc';
import {SunManager} from "./manager/SunManager";
import {MouseManager} from "./manager/MouseManager";
import {CardState, PlantType} from "./Global";
const { ccclass, property } = _decorator;



@ccclass('Card')
export class Card extends Component {
    private cardState:CardState = CardState.Coolding // 卡片状态

    // 该卡片的植物种类
    @property({type: Enum(PlantType)})
    public plantType: PlantType // 植物类型


    @property(Node)
    public cardLight: Node = null // 卡片发光的时候

    @property(Node)
    public cardGary: Node = null // 卡片灰色的时候

    @property(Sprite)
    public cardMask: Sprite = null // 卡片遮罩

    @property(Number)
    public cdTime: number = 2 // 冷却时间
    private cdTimer: number = 0 // 冷却计时器

    @property({type:Number, tooltip:'下牌需要的阳光点数'}) // tooltip可以方面自己查看属性是干什么的
    private needSunPoint: number = 0 // 下牌需要的阳光点数

    start() {
        this.cdTimer = this.cdTime
    }

    // deltaTime 间歇时间
    update(deltaTime: number) {
        switch (this.cardState) {
            case CardState.Coolding:
                this.CoolingUpdate(deltaTime);
                break;
            case CardState.WaitingSun:
                this.WaitingSunUpdate();
                break;
            case CardState.Ready:
                this.ReadyUpdate();
                break;
        }
        
    }

    // 冷却中更新
    private CoolingUpdate (dt: number) {
        this.cdTimer -= dt
        this.cardMask.fillRange = -(this.cdTimer / this.cdTime)
        if (this.cdTimer <= 0) {
            this.transitionToWaitingSun()
        }
    }



    // 等待阳光更新
    private WaitingSunUpdate () {
        // 如果阳光足够，就切换到准备就绪状态
        if (this.needSunPoint <= SunManager.Instance.SunPoint) {
            this.transitionToReady()
        }
    }

    // 准备就绪更新
    private ReadyUpdate () {
        // 如果阳光足够，就切换到准备就绪状态
        if (this.needSunPoint > SunManager.Instance.SunPoint) {
            this.transitionToWaitingSun()
        }
    }

    // 过渡到等待阳光状态
    private transitionToWaitingSun () {
        this.cardState = CardState.WaitingSun
        this.cardLight.active = false
        this.cardGary.active = true
        this.cardMask.node.active = false

    }

    // 过渡到可以种植状态
    private transitionToReady () {
        this.cardState = CardState.Ready
        this.cardLight.active = true
        this.cardGary.active = false
        this.cardMask.node.active = false

    }

    // 过渡到冷却阶段
    private transitionToCoolding () {
        this.cardState = CardState.Coolding
        this.cdTimer = this.cdTime
        this.cardLight.active = false
        this.cardGary.active = true
        this.cardMask.node.active = true

    }

    onClick (event: EventMouse) {
        // 如果能量不够，那么就不做任何事情
        if (this.needSunPoint > SunManager.Instance.SunPoint) return
        // 开始种植，生成种植植物的节点
        const isSuccess = MouseManager.Instance.addPlant(this.plantType, event)
        if (!isSuccess) return
        // 种植的时候减少阳光
        SunManager.Instance.subSunPoint(this.needSunPoint)
        // 植物卡片的状态改变，变为冷却状态
        this.transitionToCoolding()
    }
}


