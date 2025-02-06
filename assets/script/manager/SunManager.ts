import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SunManager')
// 单例模式
export class SunManager extends Component {
    private static _instance: SunManager = null

    // 阳光数量,只有有装饰器的才会出现在Cocos Creator的属性检查器中
    @property(Number)
    private sunPoint: number = 200

    @property(Label)
    private sunPointLabel: Label = null // 阳光数量的label

    // 公共访问器，获取阳光数量
    public get SunPoint(): number {
        return this.sunPoint
    }

    // 获取实例
    public static get Instance(): SunManager {
        return this._instance
    }

    // 初始化的时候挂载实例
    protected onLoad() {
        if (SunManager._instance == null) {
            SunManager._instance = this
            this.updateSunPointLabel()
        } else {
            console.log('sun manager already exist')
            this.node.destroy()
        }
    }

    // 更新阳光数量的label
    private updateSunPointLabel () {
        this.sunPointLabel.string = this.sunPoint.toString()
    }

    // 减少的阳光值
    public subSunPoint (subPoint: number) {
        this.sunPoint -= subPoint
        if (this.sunPoint < 0) {
            this.sunPoint = 0
        }
        this.updateSunPointLabel()
    }
}


