import { _decorator, Component, Node, animation, Prefab, instantiate, find } from 'cc';
const { ccclass, property } = _decorator;
import {Plant} from './Plant'

@ccclass('SunFlower')
export class SunFlower extends Plant {
    @property(Number)
    produceDuration: number = 2 // 产生阳光的间隔
    private produceTimer: number = 0 // 目前没有产生阳光得计时器

    private delataTime:number

    anim: animation.AnimationController = null

    // 阳光预制体
    @property({type: Prefab, tooltip: '阳光预制体'})
    sunPrefab: Prefab = null

    // 初始化得时候，把anim定义为animation.AnimationController
    protected onLoad(): void {
        this.anim = this.getComponent(animation.AnimationController)
    }

    // 集成父亲得时间间隔
    update(deltaTime: number) {
        super.update(deltaTime);
        this.delataTime = deltaTime
    }

    // 循环生产阳光方法
    enableUpdate () {
        super.enableUpdate()
        this.produceTimer += this.delataTime

        console.log(this.produceTimer)
        // 间隔时间够，该产生太阳了
        if (this.produceTimer >= this.produceDuration) {
            this.anim.setValue('isGlowing', true)
            this.produceTimer = 0
            this.produceSun()
        }
        // this.schedule(() => {
        //     this.anim.setValue('isGlowing', true)
        // }, this.sunProduceTime)
    }

    // 产生阳光
    produceSun () {
        // 实例化阳光
        let sunNode = instantiate(this.sunPrefab)
        // 设置阳光父节点
        sunNode.parent = find('Canvas/ForeGround')
        // 设置阳光位置
        sunNode.setPosition(this.node.position.x, this.node.position.y - 20)
    }
}


