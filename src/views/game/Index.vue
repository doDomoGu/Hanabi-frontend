<template>
    <div id="game">
        <section :class="'player-block' + (is_host?' is_you':'')">
            <div class="player-name">房主： {{'('+host_player.id+')'+host_player.name}} {{round_player_is_host?'出牌中':''}}</div>

            <div class="hand-card">
                <li v-if="!is_host" v-for="card in host_hands" :class="colors[card.color]+'-color'"
                    @click="showCardOperation(host_hands,card,1)">
                    <span>{{numbers[card.num]}}</span>
                </li>
                <li v-else class="no-color" @click="showCardOperation(host_hands,card,0)"></li>
            </div>
        </section>

        <section class="middle-block">
            <div class="library-block">
                牌库<br/>{{library_cards_num}}张
            </div>
            <div class="box-block">
                提示: {{cue_num}}
                <br/>
                机会: {{chance_num}}
                <br/>
                得分: {{score}}
            </div>
            <div class="table-block">
                <li v-for="(color,c_key) in colors" :class="colors[c_key]+'-color'">{{success_cards[c_key]}}</li>
            </div>
            <div class="discard-block">
                弃牌<br/>{{discard_cards_num}}张
            </div>
        </section>
        <section class="log-block">
            游戏记录：
            <div class="log-list">
                <li v-for="log in log_list">{{log}}</li>
            </div>
        </section>

        <section :class="'player-block' + (!is_host?' is_you':'')">
            <div class="player-name">玩家：{{'('+guest_player.id+')'+guest_player.name}} {{round_player_is_host?'':'出牌中'}}</div>

            <div class="hand-card">
                <li v-if="is_host"  v-for="card in guest_hands" :class="colors[card.color]+'-color'"
                    @click="showCardOperation(guest_hands,card,1)">
                    <span>{{numbers[card.num]}}</span>
                </li>
                <li v-else class="no-color" @click="showCardOperation(guest_hands,card,0)"></li>
            </div>
        </section>

        <mt-button v-if="is_host" @click.native="endGame" size="large" class="game-end-btn" type="danger">结束游戏</mt-button>

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