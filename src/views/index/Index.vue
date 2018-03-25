<template>
    <div id="index">
        <div v-if="isLogin" >
            <div v-if="isInGame" >
                <mt-cell title="您的游戏正在进行中！" to="/game" is-link value="进入">
                </mt-cell>
            </div>
            <div v-else-if="isInRoom" >
                <mt-cell title="您已在房间中！" to="/room" is-link value="进入">
                </mt-cell>
            </div>
            <!--v-if="isNotInGame && isNotInRoom"-->
            <div v-else :key="item.id" v-for="item in roomList">
                <mt-cell :title="item._title" is-link @click.native="enterRoom(item.id)" value="进入">
                </mt-cell>
            </div>
        </div>
        <div v-else >
            <mt-button class="loginBtn" type="primary" size="large" @click.native="toLogin">登录</mt-button><br/>
            <mt-button class="registerBtn" type="danger" size="large" @click.native="toRegister">注册</mt-button>
        </div>
    </div>
</template>
<script src="@js/index/index.js"></script>
<style lang="scss" src="@css/index/index.scss"></style>
