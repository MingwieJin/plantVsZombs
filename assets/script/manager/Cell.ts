import { _decorator, Component, Node, EventMouse } from 'cc';
const { ccclass, property } = _decorator;
import {Plant} from "../Plant";
import {MouseManager} from './MouseManager'

@ccclass('Cell')
export class Cell extends Component {
    public currentPlant: Node // 当前种植的植物


    protected onLoad() {
        this.node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this)
        this.node.on(Node.EventType.MOUSE_MOVE, this.onMouseMove, this)
    }

    // 销毁事件监听
    protected onDestroy() {
        this.node.off(Node.EventType.MOUSE_DOWN, this.onMouseDown, this)
        this.node.off(Node.EventType.MOUSE_MOVE, this.onMouseMove, this)
    }

    onMouseDown () {
        MouseManager.Instance.onCellClick(this)
    }

    // 让鼠标在cell中移动也是丝滑的而不卡顿
    onMouseMove (event: EventMouse) {
        MouseManager.Instance.followCursor(event)
    }

    // 种植植物
    addPlant (plant: Node): boolean {
        if (this.currentPlant) return false
        this.currentPlant = plant
        this.currentPlant.setPosition(this.node.position)

        // 靠节点获取他得组件
        plant.getComponent(Plant).transitionToEnable()
        return true
    }
}


