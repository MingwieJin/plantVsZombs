import { _decorator, Component, Node, Prefab, instantiate, EventMouse, Input, Vec3, input, find } from 'cc';
import {PlantType} from "../Global";
import {Plant} from "../Plant";
import {Cell} from './Cell'
const { ccclass, property } = _decorator;


@ccclass('MouseManager')
export class MouseManager extends Component {
    private static _instance: MouseManager = null

    @property({type: [Prefab], tooltip: '植物预制体数组'})
    public plantPrefabArray: Prefab[] = [] // 植物预制体数组, 拖拽传入数组

    private currentPlant: Node // 当前种植的植物

    // 获取实例
    public static get Instance(): MouseManager {
        return this._instance
    }

    // 初始化的时候挂载实例
    protected onLoad() {
        if (MouseManager._instance == null) {
            MouseManager._instance = this
        } else {
            console.log('MouseManager already exist')
            this.node.destroy()
        }
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this)
    }

    // 销毁事件监听
    protected onDestroy() {
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this)
    }

    // 鼠标移动的时候，改变位置
    onMouseMove (event: EventMouse) {
        this.followCursor(event)
    }

    // 种植的植物
    addPlant (plantType: PlantType, event: EventMouse): boolean {
        // 当前手上有植物，不能添加新植物
        if (this.currentPlant) return false
        let plantPrefab = this.getPlantPrefab(plantType)
        // 如何点击的预制体不存在，那么不能添加
        if (!plantPrefab) return false
        // 从 Prefab 实例化出新节点
        this.currentPlant = plantPrefab
        // 把新节点挂在在当前节点的上级节点（也即使Canvas的下面）
        // this.currentPlant.parent = this.node.parent
        // 寻找Game节点，放在下面
        this.currentPlant.parent = find('Canvas/Game')
        this.followCursor(event)
        return true
    }

    // 获取植物预制体
    getPlantPrefab (plantType: PlantType): Node {
        for (let i of this.plantPrefabArray) {
            // 实例化预制体
            let plantNode = instantiate(i)
            // 看类型是否一致
            if (plantNode.getComponent(Plant).plantType == plantType) {
                return plantNode
            } else { // 如果不一致，那么销毁
                plantNode.destroy()
            }
        }
        return null
    }

    // 跟随鼠标移动
    followCursor (event: EventMouse) {
        if (!this.currentPlant) return
        // 获取鼠标位置
        let mousePos = event.getLocation()
        // 鼠标坐标转化为世界坐标
        let worldPos = new Vec3(mousePos.x, mousePos.y)
        // 改变植物位置
        this.currentPlant.setWorldPosition(worldPos)
    }

    onCellClick (cell: Cell) {
        // 如果当前没有植物，那么就不做任何事情
        if (!this.currentPlant) return
        let isSuccess = cell.addPlant(this.currentPlant)

        // 释放植物
        if (isSuccess) this.currentPlant = null

    }
}


