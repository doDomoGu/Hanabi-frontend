<template>
    <div id="game">
        <canvas id="canvas">
        </canvas>
        <div id="log-list">
            <li v-for="log in log_list">{{log}}</li>
        </div>
        <mt-button v-if="is_host" @click.native="endGame" size="large" class="game-end-btn" type="danger" style="position:absolute;bottom:0;z-index:9999;">结束游戏</mt-button>
        <x-dialog :show.sync="cardOperationShow" hide-on-blur :on-hide="clearSelect" class="">
            <div v-if="cardOperationType===1" class="opposite-card-operation">
                <div class="selected-card-info">
                    <span :class="colors[cardSelectColor]+'-color'">{{numbers[cardSelectNum]}}</span>
                </div>
                <div class="cue-btn cue-color">
                    <!--提示与之相同颜色的卡牌-->
                    提示颜色
                    <mt-button type="primary" size="small" @click.native="doCue('color')">
                        确定
                    </mt-button>
                </div>
                <div class="cue-btn cue-num">
                    <!--提示与之相同数字的卡牌-->
                    提示数字
                    <mt-button type="primary" size="small" @click.native="doCue('num')">
                        确定
                    </mt-button>
                </div>
            </div>
            <div v-if="cardOperationType===0" class="yourself-card-operation">
                <div class="selected-card-info">
                    {{is_host?cardSelectOrd+1:cardSelectOrd+1-5}}
                </div>
                <div class="discard-btn">
                    是否要弃掉这张牌
                    <mt-button type="danger" size="small" @click.native="doDiscard">
                        弃掉
                    </mt-button>
                </div>
                <div class="play-btn">
                    是否要打出这张牌
                    <mt-button type="primary" size="small" @click.native="doPlay">
                        打出
                    </mt-button>
                </div>
                <div class="change-card">
                    <div>选择一张牌，与之调换位置</div>
                    <li v-for="ordOne in [0,1,2,3,4]" class="no-color" @click="" v-if="ordOne!==(is_host?cardSelectOrd:cardSelectOrd-5)">{{ordOne+1}}</li>
                </div>
            </div>
        </x-dialog>
    </div>
</template>

<script src="@js/game/index.js"></script>
<style lang="scss" src="@css/game/index.scss"></style>
