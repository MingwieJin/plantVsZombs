import { _decorator, Component, Node, Enum, animation } from 'cc';
import {PlantStateEnum, PlantType} from "./Global";
const { ccclass, property } = _decorator;



@ccclass('Plant')
export class Plant extends Component {
    plantState: PlantStateEnum = PlantStateEnum.Disable

    @property({type: Enum(PlantType)})
    public plantType: PlantType // 植物类型


    start() {
        this.transitionToDisable()
    }

    update(deltaTime: number) {
        switch (this.plantState) {
            case PlantStateEnum.Disable:
                this.disableUpdate();
                break;
            case PlantStateEnum.Enable:
                this.enableUpdate();
                break;
        }
    }

    // 未激活状态更新
    disableUpdate () {

    }

    // 激活状态更新
    enableUpdate () {

    }

    // 植物变为禁止状态
    transitionToDisable () {
        this.plantState = PlantStateEnum.Disable
        // 实例化并且，停止动画
        this.getComponent(animation.AnimationController).enabled = false
    }

    // 植物变为激活状态
    transitionToEnable () {
        this.plantState = PlantStateEnum.Enable
        // 停止动画
        this.getComponent(animation.AnimationController).enabled = true
    }
}


